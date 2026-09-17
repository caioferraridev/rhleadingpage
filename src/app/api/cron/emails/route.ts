import { NextRequest, NextResponse } from "next/server";
import { getCronSecret, isEmailConfigured } from "@/lib/emails/config";
import { sendScheduledReminders } from "@/lib/emails/service";
import { safeEqual } from "@/lib/security";

function authorize(request: NextRequest): boolean {
  const secret = getCronSecret();
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  return safeEqual(header, `Bearer ${secret}`);
}

async function run(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    // Configuração incompleta: emails nunca são enviados (falha segura).
    return NextResponse.json(
      {
        error: "Emails não configurados",
        hint: "Defina RESEND_API_KEY e EMAIL_FROM no ambiente para ativar o envio.",
        requires: ["RESEND_API_KEY", "EMAIL_FROM"],
      },
      { status: 501 }
    );
  }

  try {
    const startedAt = Date.now();
    const { plan, summary } = await sendScheduledReminders();
    return NextResponse.json({
      ok: true,
      today: {
        plan: plan
          ? { type: plan.type, daysUntil: plan.daysUntil, scheduledFor: plan.scheduledFor }
          : null,
      },
      sent: summary.sent,
      skipped: summary.skipped,
      failed: summary.failed,
      durationMs: Date.now() - startedAt,
    });
  } catch (err) {
    console.error("Cron de emails falhou:", err);
    return NextResponse.json(
      { error: "Falha ao processar lembretes" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return run(request);
}

export async function POST(request: NextRequest) {
  return run(request);
}