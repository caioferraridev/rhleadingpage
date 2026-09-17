import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAdminClient } from "@/lib/supabase/server";
import { getPreference } from "@/lib/mercadopago";
import { getCheckoutUnitPrice } from "@/lib/pricing";
import { eventConfig } from "@/lib/event-config";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  readJsonBody,
  errorStatus,
  isValidEmail,
  sanitizeName,
  PHONE_MAX_LENGTH,
} from "@/lib/security";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const ipLimit = await enforceRateLimit({
    key: `checkout_ip:${ip}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error: "Muitas tentativas de inscrição. Tente novamente mais tarde.",
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  let body: { name?: unknown; email?: unknown; phone?: unknown };
  try {
    body = (await readJsonBody(request, 8192)) as typeof body;
  } catch (err) {
    const status = errorStatus(err);
    const message =
      status === 413 ? "Requisição muito grande." : "JSON inválido.";
    return NextResponse.json({ error: message }, { status });
  }

  const name = sanitizeName(typeof body.name === "string" ? body.name : "");
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
  const phone = (rawPhone ? rawPhone.slice(0, PHONE_MAX_LENGTH) : rawPhone) || null;

  if (!name) {
    return NextResponse.json(
      { error: "Nome é obrigatório." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "E-mail inválido." },
      { status: 400 }
    );
  }

  if (!phone && typeof body.phone === "string" && body.phone.trim()) {
    return NextResponse.json(
      { error: "Telefone inválido." },
      { status: 400 }
    );
  }

  const emailLimit = await enforceRateLimit({
    key: `checkout_email:${email}`,
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });
  if (!emailLimit.allowed) {
    return NextResponse.json(
      {
        error: "Este e-mail já realizou muitas tentativas. Tente novamente mais tarde.",
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  try {
    const supabase = getAdminClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("status", "active")
      .single();

    if (eventError || !event) {
      console.warn("Checkout blocked: no active event in DB.", eventError?.message);
      return NextResponse.json(
        {
          error:
            "As inscrições ainda não estão abertas. Entre na lista de espera e avisaremos você assim que estiverem disponíveis.",
          code: "EVENT_NOT_AVAILABLE",
        },
        { status: 403 }
      );
    }

    const { data: reserveResult, error: reserveError } = await supabase.rpc(
      "reserve_spot",
      {
        p_event_id: event.id,
        p_name: name,
        p_email: email,
        p_phone: phone,
      }
    );

    if (reserveError) {
      console.error("Reserve spot error:", reserveError);
      const notMigrated =
        reserveError.code === "PGRST202" ||
        /not found|does not exist|function.*reserve_spot/i.test(
          reserveError.message || ""
        );
      return NextResponse.json(
        notMigrated
          ? {
              error:
                "As inscrições ainda não estão abertas. Entre na lista de espera e avisaremos você assim que estiverem disponíveis.",
              code: "EVENT_NOT_AVAILABLE",
            }
          : { error: "Erro ao processar inscrição. Tente novamente." },
        { status: notMigrated ? 403 : 500 }
      );
    }

    const result = reserveResult as {
      success: boolean;
      registration_id?: string;
      spots_left?: number;
      error?: string;
    };

    if (!result.success) {
      const status = result.error === "No spots available" ? 409 : 400;
      return NextResponse.json(
        {
          error:
            result.error === "No spots available"
              ? "Todas as vagas foram preenchidas."
              : result.error || "Erro ao processar inscrição.",
        },
        { status }
      );
    }

    const registrationId = result.registration_id!;
    const confirmationToken = randomBytes(24).toString("hex");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const preference = await getPreference().create({
      body: {
        items: [
          {
            id: `event-${event.id}`,
            title: eventConfig.name,
            description: `${eventConfig.tagline} - ${eventConfig.date}`,
            quantity: 1,
            currency_id: "BRL",
            unit_price: getCheckoutUnitPrice(event.price),
          },
        ],
        payer: {
          name,
          email,
        },
        external_reference: registrationId,
        metadata: {
          registration_id: registrationId,
          event_id: event.id,
        },
        back_urls: {
          success: `${appUrl}/sucesso?token=${confirmationToken}`,
          pending: `${appUrl}/sucesso?token=${confirmationToken}`,
          failure: `${appUrl}/cancelado`,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/webhook`,
        statement_descriptor: "ACADEMIA RH",
      },
    });

    if (!preference.id || !preference.init_point) {
      throw new Error("Mercado Pago não retornou a URL de pagamento.");
    }

    const { error: updateError } = await supabase
      .from("registrations")
      .update({
        mercadopago_preference_id: preference.id,
        confirmation_token: confirmationToken,
      })
      .eq("id", registrationId);

    if (updateError) {
      console.error("Failed to persist preference on registration:", updateError.message);
    }

    return NextResponse.json({
      url: preference.init_point,
      preference_id: preference.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}