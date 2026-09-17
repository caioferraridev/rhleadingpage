import { NextRequest, NextResponse } from "next/server";
import { WebhookSignatureValidator } from "mercadopago";
import { getAdminClient } from "@/lib/supabase/server";
import { getPayment } from "@/lib/mercadopago";
import { sendConfirmationEmails } from "@/lib/emails/service";
import { readJsonBody, errorStatus } from "@/lib/security";

export async function POST(request: NextRequest) {
  let body: {
    type?: string;
    action?: string;
    data?: { id?: number | string };
  };
  try {
    body = (await readJsonBody(request, 32768)) as typeof body;
  } catch (err) {
    const status = errorStatus(err);
    return NextResponse.json(
      { error: status === 413 ? "Payload too large" : "Invalid JSON" },
      { status }
    );
  }

  // Optional: validate the HMAC signature if a secret signature is configured.
  // Mercado Pago signed webhooks send `x-signature` + `x-request-id` headers.
  // Recomendado: configure MERCADOPAGO_WEBHOOK_SECRET para impedir webhooks forjados.
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (webhookSecret) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: request.headers.get("x-signature"),
        xRequestId: request.headers.get("x-request-id"),
        dataId: request.nextUrl.searchParams.get("data.id"),
        secret: webhookSecret,
        toleranceSeconds: 300,
      });
    } catch (err) {
      console.error("Mercado Pago webhook signature invalid:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  const type = body.type ?? body.action;
  const paymentId = typeof body.data?.id === "string" || typeof body.data?.id === "number"
    ? String(body.data.id)
    : "";

  // We only act on payment notifications. Everything else (plans, orders, tests)
  // is acknowledged and ignored.
  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ received: true });
  }

  try {
    // Always fetch the payment from the API to confirm the real status.
    // The notification body alone is never trusted as the source of truth.
    const payment = await getPayment().get({ id: String(paymentId) });

    const supabase = getAdminClient();

    // Link the Mercado Pago payment id to the registration row.
    // We stored the registration id in both `external_reference` and `metadata`
    // when the preference was created.
    const registrationId =
      payment.metadata?.registration_id ?? payment.external_reference;

    if (registrationId) {
      await supabase
        .from("registrations")
        .update({ mercadopago_payment_id: String(paymentId) })
        .eq("id", registrationId);
    }

    const status = String(payment.status ?? "");

    if (status === "approved") {
      // Idempotent confirmation — repeated notifications don't create dupes.
      const { data: result, error } = await supabase.rpc(
        "confirm_registration",
        {
          p_payment_id: String(paymentId),
          p_amount_paid: Math.round((payment.transaction_amount ?? 0) * 100),
        }
      );

      if (error) {
        console.error("Confirm registration error:", error);
        return NextResponse.json(
          { error: "Failed to confirm registration" },
          { status: 500 }
        );
      }

      if (!(result as { success?: boolean })?.success) {
        console.error(
          "Registration confirmation failed:",
          (result as { error?: string })?.error
        );
        return NextResponse.json(
          { error: "Confirmation failed" },
          { status: 400 }
        );
      }

      console.log("Registration confirmed:", result);

      // Dispara os emails de confirmação (participante + administrador).
      // Erros de email NUNCA quebram a resposta do webhook.
      try {
        const { data: registration } = await supabase
          .from("registrations")
          .select("*")
          .eq("id", registrationId)
          .maybeSingle();

        if (registration) {
          const { data: event } = await supabase
            .from("events")
            .select("*")
            .eq("id", registration.event_id)
            .maybeSingle();

          if (event) {
            await sendConfirmationEmails({ registration, event });
          }
        }
      } catch (emailErr) {
        console.error("Email de confirmação falhou (não-bloqueante):", emailErr);
      }

      return NextResponse.json({ received: true, confirmed: true });
    }

    if (["rejected", "cancelled", "expired"].includes(status)) {
      if (registrationId) {
        await supabase
          .from("registrations")
          .update({
            payment_status: "failed",
            registration_status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", registrationId);
      }
      return NextResponse.json({ received: true, status });
    }

    // pending / in_process / authorized — keep the registration pending.
    return NextResponse.json({ received: true, status });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}