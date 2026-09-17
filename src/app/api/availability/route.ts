import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
import { eventConfig } from "@/lib/event-config";

function fallbackResponse() {
  return NextResponse.json({
    event: {
      id: "fallback",
      name: eventConfig.name,
      description: eventConfig.description,
      event_date: eventConfig.date,
      start_time: eventConfig.startTime,
      end_time: eventConfig.endTime,
      location: eventConfig.location,
      address: eventConfig.address,
      capacity: eventConfig.capacity,
      price: eventConfig.price,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_sold_out: false,
    from_fallback: true,
  });
}

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("status", "active")
      .single();

    if (eventError || !event) {
      const cause = (eventError as { cause?: unknown } | null)?.cause;
      console.warn(
        "No active event found in DB, using fallback config:",
        eventError?.message,
        "| url:",
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        "| cause:",
        cause instanceof Error ? `${cause.name}: ${cause.message}` : JSON.stringify(cause ?? null)
      );
      return fallbackResponse();
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

    const spotsLeft = event.capacity - (confirmed_count ?? 0);

    return NextResponse.json({
      event,
      is_sold_out: spotsLeft <= 0,
    });
  } catch (error) {
    console.error("Availability error:", error);
    return fallbackResponse();
  }
}
