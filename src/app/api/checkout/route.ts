import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { eventConfig } from "@/lib/event-config";

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    // Get event data
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("status", "active")
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Evento não encontrado." },
        { status: 404 }
      );
    }

    // Use the RPC function to safely reserve a spot (prevents race conditions)
    const { data: reserveResult, error: reserveError } = await supabase.rpc(
      "reserve_spot",
      {
        p_event_id: event.id,
        p_name: name,
        p_email: email,
        p_phone: phone || null,
      }
    );

    if (reserveError) {
      console.error("Reserve spot error:", reserveError);
      return NextResponse.json(
        { error: "Erro ao processar inscrição. Tente novamente." },
        { status: 500 }
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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: eventConfig.name,
              description: `${eventConfig.tagline} - ${eventConfig.date}`,
            },
            unit_amount: event.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        registration_id: result.registration_id!,
        event_id: event.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancelado`,
    });

    // Update registration with session ID
    await supabase
      .from("registrations")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", result.registration_id);

    return NextResponse.json({
      url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
