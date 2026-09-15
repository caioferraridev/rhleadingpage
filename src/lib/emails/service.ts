import { Resend } from "resend";
import { getAdminClient } from "@/lib/supabase/server";
import type {
  EmailNotification,
  Event,
  Registration,
} from "@/types/database";
import {
  EMAILS_CONFIG,
  getEmailFrom,
  isEmailConfigured,
  isValidEmail,
} from "./config";
import { getResendApiKey } from "./config";
import {
  getReminderPlan,
  getReminderSubject,
  getTodayDateKeySaoPaulo,
  daysUntil,
  type ReminderPlan,
} from "./countdown";
import {
  adminTemplate,
  confirmationTemplate,
  countdownTemplate,
  eventTodayTemplate,
} from "./templates";

export interface SendSummary {
  sent: string[];
  skipped: string[];
  failed: string[];
}

interface BuildOptions {
  event: Event;
  registration?: Registration;
  spotsLeft?: number;
  daysUntil?: number;
}

function briefText(event: Event, daysUntil?: number): string {
  const lines = [
    "ACADEMIA RH",
    "",
    EMAILS_CONFIG.confirmationSubject,
    "",
    `Data: ${event.event_date}`,
    `Horário: ${event.start_time} às ${event.end_time}`,
    `Local: ${event.location}`,
    ...(event.address ? event.address.split("\n") : []),
  ];
  if (typeof daysUntil === "number") {
    lines.unshift(getReminderSubject(daysUntil));
  }
  return lines.join("\n");
}

function buildEmail(
  type: string,
  opts: BuildOptions
): { subject: string; html: string; text: string } | null {
  const { event, registration, spotsLeft, daysUntil } = opts;

  switch (type) {
    case "registration_confirmation":
      return {
        subject: EMAILS_CONFIG.confirmationSubject,
        html: confirmationTemplate({ event, name: registration?.name }),
        text: briefText(event),
      };
    case "admin_new_registration":
      if (!registration) return null;
      return {
        subject: EMAILS_CONFIG.adminSubject,
        html: adminTemplate({
          event,
          registration,
          spotsLeft: spotsLeft ?? 0,
        }),
        text: briefText(event),
      };
    case "countdown":
      return {
        subject: getReminderSubject(daysUntil ?? 0),
        html: countdownTemplate({ event, daysUntil: daysUntil ?? 0, name: registration?.name }),
        text: briefText(event, daysUntil),
      };
    case "event_today":
      return {
        subject: getReminderSubject(0),
        html: eventTodayTemplate({ event, name: registration?.name }),
        text: briefText(event, 0),
      };
    default:
      return null;
  }
}

let cachedResend: Resend | null = null;

function getResend(): Resend {
  const key = getResendApiKey();
  if (!key) throw new Error("RESEND_API_KEY não configurada");
  if (!cachedResend) cachedResend = new Resend(key);
  return cachedResend;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<string> {
  const { data, error } = await getResend().emails.send({
    from: getEmailFrom()!,
    to,
    subject,
    html,
    text,
  });
  if (error) throw new Error(error.message || "Erro ao enviar via Resend");
  return data?.id ?? "";
}

// ---------- Idempotência no banco ----------

async function ensureNotification(opts: {
  registrationId: string;
  email: string;
  type: string;
  scheduledFor: string;
}): Promise<string> {
  const supabase = getAdminClient();
  const { data: inserted } = await supabase
    .from("email_notifications")
    .upsert(
      {
        registration_id: opts.registrationId,
        email: opts.email,
        type: opts.type,
        scheduled_for: opts.scheduledFor,
      },
      {
        onConflict: "registration_id,type,scheduled_for",
        ignoreDuplicates: true,
      }
    )
    .select("id")
    .single();

  if (inserted?.id) return inserted.id;

  const { data: existing } = await supabase
    .from("email_notifications")
    .select("id")
    .eq("registration_id", opts.registrationId)
    .eq("type", opts.type)
    .eq("scheduled_for", opts.scheduledFor)
    .maybeSingle();

  if (existing?.id) return existing.id;

  // Corrida: recupeça o id criado por outra requisição simultânea.
  const { data: retry } = await supabase
    .from("email_notifications")
    .select("id")
    .eq("registration_id", opts.registrationId)
    .eq("type", opts.type)
    .eq("scheduled_for", opts.scheduledFor)
    .maybeSingle();
  return retry?.id ?? "";
}

async function claimNotification(id: string): Promise<boolean> {
  const supabase = getAdminClient();
  // 1º: reclama quando ainda não processada.
  const { data: fresh } = await supabase
    .from("email_notifications")
    .update({
      status: "sending",
      error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .in("status", ["pending", "failed"])
    .select("id")
    .maybeSingle();
  if (fresh?.id) return true;

  // 2º: libera notificação travada em "sending" há mais de 30min
  // (crash entre claim e envio em execução anterior).
  const staleCutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data: stale } = await supabase
    .from("email_notifications")
    .update({
      status: "sending",
      error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "sending")
    .lt("updated_at", staleCutoff)
    .select("id")
    .maybeSingle();
  return Boolean(stale?.id);
}

async function markSent(id: string, providerMessageId: string): Promise<void> {
  await getAdminClient()
    .from("email_notifications")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
      provider_message_id: providerMessageId || null,
      error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

async function markFailed(id: string, message: string): Promise<void> {
  await getAdminClient()
    .from("email_notifications")
    .update({
      status: "failed",
      error: message.slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

async function sendOne(
  notificationId: string,
  recipient: string,
  build: () => BuildOptions,
  type: string
): Promise<"sent" | "failed" | "skipped"> {
  const claimed = await claimNotification(notificationId);
  if (!claimed) return "skipped";
  try {
    const email = buildEmail(type, build());
    if (!email) {
      await markFailed(notificationId, `Tipo desconhecido: ${type}`);
      return "failed";
    }
    const mid = await sendEmail(recipient, email.subject, email.html, email.text);
    await markSent(notificationId, mid);
    return "sent";
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await markFailed(notificationId, message);
    return "failed";
  }
}

// ---------- Orquestradores ----------

export async function getActiveEvent(): Promise<Event | null> {
  const { data } = await getAdminClient()
    .from("events")
    .select("*")
    .eq("status", "active")
    .order("event_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getSpotCounts(eventId: string): Promise<number> {
  const { count } = await getAdminClient()
    .from("registrations")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("registration_status", "confirmed")
    .eq("payment_status", "paid");
  return count ?? 0;
}

/**
 * Após uma confirmação de pagamento, registra e envia o email de
 * confirmação para o participante e o email administrativo.
 * Falhas NUNCA quebram o fluxo do webhook.
 */
export async function sendConfirmationEmails(opts: {
  registration: Registration;
  event: Event;
}): Promise<SendSummary> {
  const summary: SendSummary = { sent: [], skipped: [], failed: [] };
  const { registration, event } = opts;

  if (!isEmailConfigured() || !isValidEmail(registration.email)) {
    summary.skipped.push("not_configured");
    return summary;
  }

  const spotsLeft = Math.max(0, event.capacity - (await getSpotCounts(event.id)));
  const scheduledFor = event.event_date;

  // Email administrativo (recipiente real fica gravado na linha)
  const adminId = await ensureNotification({
    registrationId: registration.id,
    email: EMAILS_CONFIG.adminEmail,
    type: "admin_new_registration",
    scheduledFor,
  });

  // Email de confirmação do participante
  const confirmationId = await ensureNotification({
    registrationId: registration.id,
    email: registration.email,
    type: "registration_confirmation",
    scheduledFor,
  });

  const adminResult = await sendOne(
    adminId,
    EMAILS_CONFIG.adminEmail,
    () => ({ event, registration, spotsLeft }),
    "admin_new_registration"
  );
  pushResult(summary, adminResult, "admin_new_registration");

  const participantResult = await sendOne(
    confirmationId,
    registration.email,
    () => ({ event, registration }),
    "registration_confirmation"
  );
  pushResult(summary, participantResult, "registration_confirmation");

  return summary;
}

/**
 * Cron diário: envia os lembretes programados (countdown a cada 3 dias,
 * diário nos últimos 3 dias, "É HOJE!") e tenta novamente notificações que
 * falharam em execuções anteriores.
 */
export async function sendScheduledReminders(): Promise<{
  plan: ReminderPlan | null;
  summary: SendSummary;
}> {
  const summary: SendSummary = { sent: [], skipped: [], failed: [] };
  const today = getTodayDateKeySaoPaulo();

  if (!isEmailConfigured()) {
    summary.skipped.push("not_configured");
    return { plan: null, summary };
  }

  const event = await getActiveEvent();
  if (!event) {
    summary.skipped.push("no_active_event");
    return { plan: null, summary };
  }

  const plan = getReminderPlan(event.event_date, today);
  const supabase = getAdminClient();

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*")
    .eq("event_id", event.id)
    .eq("registration_status", "confirmed")
    .eq("payment_status", "paid");

  const confirmed = (registrations ?? []).filter((r) =>
    isValidEmail(r.email)
  );

  const pendingRuns: Array<{ r: Registration; plan: ReminderPlan }> = [];

  if (plan) {
    for (const r of confirmed) {
      pendingRuns.push({ r, plan });
    }
  }

  // Fora do plano do dia, tenta reenviar lembretes/confirmações que falharam.
  const { data: failedRows } = await supabase
    .from("email_notifications")
    .select("*")
    .lte("scheduled_for", today)
    .or(`status.eq.failed,status.eq.sending`);

  const byRegistration = new Map<string, Registration>(
    confirmed.map((r) => [r.id, r])
  );

  for (const row of (failedRows ?? []) as EmailNotification[]) {
    const r = byRegistration.get(row.registration_id);
    if (!r) continue;
    const executed = await sendOne(
      row.id,
      row.email,
      () => ({
        event,
        registration: r,
        daysUntil: daysUntil(event.event_date, row.scheduled_for),
      }),
      row.type
    );
    pushResult(summary, executed, row.type);
  }

  for (const { r, plan: p } of pendingRuns) {
    const notifId = await ensureNotification({
      registrationId: r.id,
      email: r.email,
      type: p.type,
      scheduledFor: p.scheduledFor,
    });
    if (!notifId) {
      summary.skipped.push(`${p.type}:${r.id}`);
      continue;
    }
    const result = await sendOne(
      notifId,
      r.email,
      () => ({ event, registration: r, daysUntil: p.daysUntil }),
      p.type
    );
    pushResult(summary, result, p.type);
  }

  return { plan, summary };
}

function pushResult(
  summary: SendSummary,
  result: "sent" | "failed" | "skipped",
  label: string
): void {
  if (result === "sent") summary.sent.push(label);
  else if (result === "failed") summary.failed.push(label);
  else summary.skipped.push(label);
}

/**
 * Envia um email de teste (sem registrar no banco) para validar templates
 * manualmente. Usado pela rota /api/emails/test.
 */
export async function sendTestEmail(opts: {
  to: string;
  type: "confirmation" | "admin" | "countdown" | "event_today";
  daysUntil?: number;
}): Promise<{ subject: string; messageId: string }> {
  const event = await getActiveEvent();
  if (!event) throw new Error("Nenhum evento ativo encontrado");

  const { data: latest } = await getAdminClient()
    .from("registrations")
    .select("*")
    .eq("event_id", event.id)
    .eq("registration_status", "confirmed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const registration: Registration = latest ?? {
    id: "00000000-0000-0000-0000-000000000000",
    event_id: event.id,
    name: "Participante de Teste",
    email: opts.to,
    phone: null,
    mercadopago_payment_id: null,
    mercadopago_preference_id: null,
    amount_paid: event.price,
    payment_status: "paid",
    registration_status: "confirmed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const typeMap: Record<string, string> = {
    confirmation: "registration_confirmation",
    admin: "admin_new_registration",
    countdown: "countdown",
    event_today: "event_today",
  };
  const type = typeMap[opts.type];

  const email = buildEmail(type, {
    event,
    registration,
    spotsLeft: Math.max(0, event.capacity - (await getSpotCounts(event.id))),
    daysUntil: opts.daysUntil ?? daysUntil(event.event_date),
  });

  if (!email) throw new Error("Template não encontrado");

  const messageId = await sendEmail(opts.to, email.subject, email.html, email.text);
  return { subject: email.subject, messageId };
}