import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
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
    key: `waitlist_ip:${ip}`,
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error: "Muitas tentativas. Tente novamente mais tarde.",
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  let body: { name?: unknown; email?: unknown; phone?: unknown; event_id?: unknown };
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
  const event_id = typeof body.event_id === "string" ? body.event_id.trim() : "";

  if (!name || !email || !event_id) {
    return NextResponse.json(
      { error: "Nome, e-mail e evento são obrigatórios." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  try {
    const supabase = getAdminClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("id", event_id)
      .eq("status", "active")
      .maybeSingle();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Evento não encontrado." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("event_id", event_id)
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Você já está na lista de espera." },
        { status: 409 }
      );
    }

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