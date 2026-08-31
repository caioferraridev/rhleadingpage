import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const supabase = getAdminClient();
    const { data: registration, error } = await supabase
      .from("registrations")
      .select("*, events(name, event_date, start_time, end_time, location, address)")
      .eq("stripe_checkout_session_id", sessionId)
      .single();

    if (error || !registration) {
      return NextResponse.json(
        { error: "Inscrição não encontrada. Aguarde a confirmação do pagamento." },
        { status: 404 }
      );
    }

    const isConfirmed =
      registration.registration_status === "confirmed" &&
      registration.payment_status === "paid";

    return NextResponse.json({
      registration: {
        name: registration.name,
        email: registration.email,
        is_confirmed: isConfirmed,
        status: registration.registration_status,
        payment_status: registration.payment_status,
      },
      event: registration.events,
    });
  } catch (error) {
    console.error("Registration lookup error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
