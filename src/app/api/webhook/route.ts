import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only confirm registrations for actually paid sessions. A completed
    // session may still have payment_status "unpaid" (e.g. async payment or
    // authorization failure) — those must NOT count as confirmed spots.
    if (session.payment_status !== "paid") {
      console.log("Checkout session not paid, skipping confirmation", {
        session_id: session.id,
        payment_status: session.payment_status,
      });
      return NextResponse.json({ received: true, skipped: "not_paid" });
    }

    try {
      const supabase = getAdminClient();
      // Confirm the registration via RPC (idempotent)
      const { data: result, error } = await supabase.rpc(
        "confirm_registration",
        {
          p_session_id: session.id,
          p_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
          p_amount_paid: session.amount_total ?? 0,
        }
      );

      if (error) {
        console.error("Confirm registration error:", error);
        return NextResponse.json(
          { error: "Failed to confirm registration" },
          { status: 500 }
        );
      }

      const confirmResult = result as {
        success: boolean;
        error?: string;
      };

      if (!confirmResult.success) {
        console.error("Registration confirmation failed:", confirmResult.error);
        return NextResponse.json(
          { error: confirmResult.error || "Confirmation failed" },
          { status: 400 }
        );
      }

      console.log("Registration confirmed:", confirmResult);
    } catch (err) {
      console.error("Webhook processing error:", err);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
