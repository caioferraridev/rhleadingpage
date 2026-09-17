import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
import { safeEqual } from "@/lib/security";
import { enforceRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

const ADMIN_FAIL_LIMIT = 10;
const ADMIN_FAIL_WINDOW_MS = 15 * 60 * 1000;

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const authHeader = request.headers.get("authorization") ?? "";
  const adminPassword = (process.env.ADMIN_PASSWORD ?? "").trim();

  if (!adminPassword) {
    console.error(
      "[admin] ADMIN_PASSWORD não configurada no ambiente do servidor. Configure a variável ADMIN_PASSWORD para habilitar o acesso."
    );
  }

  const authed = adminPassword && safeEqual(authHeader, `Bearer ${adminPassword}`);

  if (!authed) {
    const rate = await enforceRateLimit({
      key: `admin_fail:${ip}`,
      limit: ADMIN_FAIL_LIMIT,
      windowMs: ADMIN_FAIL_WINDOW_MS,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde alguns minutos." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await resetRateLimit(`admin_fail:${ip}`);

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

    const { data: registrations, error: regError } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", event.id)
      .order("created_at", { ascending: true });

    if (regError) {
      console.error("Registrations error:", regError);
    }

    const { data: waitlist, error: waitError } = await supabase
      .from("waitlist")
      .select("*")
      .eq("event_id", event.id)
      .order("created_at", { ascending: true });

    if (waitError) {
      console.error("Waitlist error:", waitError);
    }

    const confirmed_count =
      registrations?.filter(
        (r) =>
          r.registration_status === "confirmed" &&
          r.payment_status === "paid"
      ).length ?? 0;

    const cancelled_count =
      registrations?.filter(
        (r) => r.registration_status === "cancelled"
      ).length ?? 0;

    const total_received =
      registrations
        ?.filter((r) => r.payment_status === "paid")
        .reduce((sum, r) => sum + (Number(r.amount_paid) || 0), 0) ?? 0;

    return NextResponse.json({
      event,
      registrations: registrations ?? [],
      waitlist: waitlist ?? [],
      stats: {
        total_registrations: registrations?.length ?? 0,
        confirmed: confirmed_count,
        pending:
          registrations?.filter((r) => r.payment_status === "pending").length ??
          0,
        failed:
          registrations?.filter((r) => r.payment_status === "failed").length ??
          0,
        cancelled: cancelled_count,
        total_received,
        spots_left: event.capacity - confirmed_count,
        waitlist_count: waitlist?.length ?? 0,
      },
    });
  } catch (error) {
    console.error("Admin error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}