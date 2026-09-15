import { NextRequest, NextResponse } from "next/server";
import { getCronSecret, isEmailConfigured, isValidEmail } from "@/lib/emails/config";
import { sendTestEmail } from "@/lib/emails/service";

function authorize(request: NextRequest): boolean {
  const header = request.headers.get("authorization") ?? "";
  const cronSecret = getCronSecret();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  return (
    header === `Bearer ${cronSecret}` || header === `Bearer ${adminPassword}`
  );
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      {
        error: "Emails não configurados",
        hint: "Defina RESEND_API_KEY e EMAIL_FROM no ambiente para ativar o envio.",
      },
      { status: 501 }
    );
  }

  let body: {
    to?: string;
    type?: "confirmation" | "admin" | "countdown" | "event_today";
    daysUntil?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const to = body.to?.trim();
  if (!to || !isValidEmail(to)) {
    return NextResponse.json(
      { error: "Campo `to` deve ser um e-mail válido" },
      { status: 400 }
    );
  }

  const type = body.type ?? "confirmation";
  if (!["confirmation", "admin", "countdown", "event_today"].includes(type)) {
    return NextResponse.json({ error: "`type` inválido" }, { status: 400 });
  }

  try {
    const result = await sendTestEmail({
      to,
      type: type as "confirmation" | "admin" | "countdown" | "event_today",
      daysUntil: body.daysUntil,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Teste de email falhou:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}