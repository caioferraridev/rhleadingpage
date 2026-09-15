import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
import { getPreference } from "@/lib/mercadopago";
import { getCheckoutUnitPrice } from "@/lib/pricing";
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Mercado Pago preference (Checkout Pro)
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
        external_reference: result.registration_id!,
        metadata: {
          registration_id: result.registration_id!,
          event_id: event.id,
        },
        back_urls: {
          success: `${appUrl}/sucesso`,
          pending: `${appUrl}/sucesso`,
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

    // Update registration with preference ID
    await supabase
      .from("registrations")
      .update({ mercadopago_preference_id: preference.id })
      .eq("id", result.registration_id);

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