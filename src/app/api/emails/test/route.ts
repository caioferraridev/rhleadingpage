import { NextRequest, NextResponse } from "next/server";
import { getCronSecret, isEmailConfigured, isValidEmail } from "@/lib/emails/config";
import { sendTestEmail } from "@/lib/emails/service";
import { safeEqual, readJsonBody, errorStatus } from "@/lib/security";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = await enforceRateLimit({
    key: `email_test:${ip}`,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 }
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const cronSecret = getCronSecret();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  const authed =
    (cronSecret && safeEqual(header, `Bearer ${cronSecret}`)) ||
    (adminPassword && safeEqual(header, `Bearer ${adminPassword}`));

  if (!authed) {
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
    body = (await readJsonBody(request, 8192)) as typeof body;
  } catch (err) {
    const status = errorStatus(err);
    return NextResponse.json(
      { error: status === 413 ? "Payload muito grande" : "Invalid JSON" },
      { status }
    );
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

  const daysUntil = body.daysUntil;

  try {
    const result = await sendTestEmail({
      to,
      type: type as "confirmation" | "admin" | "countdown" | "event_today",
      daysUntil: typeof daysUntil === "number" ? daysUntil : undefined,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Teste de email falhou:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}