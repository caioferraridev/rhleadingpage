import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getAdminClient();
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

    const { count: confirmed_count, error: countError } = await supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event.id)
      .eq("registration_status", "confirmed")
      .eq("payment_status", "paid");

    if (countError) {
      console.error("Count error:", countError);
      return NextResponse.json(
        { error: "Erro ao consultar vagas." },
        { status: 500 }
      );
    }

    const spots_left = event.capacity - (confirmed_count ?? 0);

    return NextResponse.json({
      event,
      confirmed_count: confirmed_count ?? 0,
      spots_left,
      is_sold_out: spots_left <= 0,
      is_last_spots: spots_left > 0 && spots_left <= 10,
    });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
