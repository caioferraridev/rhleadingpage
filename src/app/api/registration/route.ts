import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

const TOKEN_PATTERN = /^[a-f0-9]{48,64}$/i;

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = await enforceRateLimit({
    key: `reg_lookup:${ip}`,
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429 }
    );
  }

  const token = request.nextUrl.searchParams.get("token");
  const paymentId =
    request.nextUrl.searchParams.get("payment_id") ??
    request.nextUrl.searchParams.get("collection_id");
  const preferenceId = request.nextUrl.searchParams.get("preference_id");

  if (!token && !paymentId && !preferenceId) {
    return NextResponse.json(
      { error: "Identificador do pedido é obrigatório." },
      { status: 400 }
    );
  }

  if (token && !TOKEN_PATTERN.test(token)) {
    return NextResponse.json({ error: "Token inválido." }, { status: 400 });
  }

  try {
    const supabase = getAdminClient();
    let query = supabase
      .from("registrations")
      .select("*, events(name, event_date, start_time, end_time, location, address)");

    if (token) {
      query = query.eq("confirmation_token", token);
    } else if (paymentId) {
      query = query.eq("mercadopago_payment_id", paymentId);
    } else {
      query = query.eq("mercadopago_preference_id", preferenceId!);
    }

    const { data: registration, error } = await query.single();

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