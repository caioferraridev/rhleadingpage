import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const body = await request.json();
    const { name, email, phone, event_id } = body;

    if (!name || !email || !event_id) {
      return NextResponse.json(
        { error: "Nome, e-mail e evento são obrigatórios." },
        { status: 400 }
      );
    }

    // Check if already on waitlist
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("event_id", event_id)
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Você já está na lista de espera." },
        { status: 409 }
      );
    }

    // Insert into waitlist
    const { error } = await supabase.from("waitlist").insert({
      event_id,
      name,
      email,
      phone: phone || null,
      status: "waiting",
    });

    if (error) {
      console.error("Waitlist error:", error);
      return NextResponse.json(
        { error: "Erro ao entrar na lista de espera." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Você entrou na lista de espera da Academia RH.",
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
