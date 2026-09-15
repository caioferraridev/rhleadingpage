export const SAO_PAULO_TZ = "America/Sao_Paulo";

export type ReminderType = "countdown" | "event_today";

export interface ReminderPlan {
  daysUntil: number;
  type: ReminderType;
  scheduledFor: string;
}

const DAY_MS = 1000 * 60 * 60 * 24;

export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateKey: string, days: number): string {
  const d = parseDateOnly(dateKey);
  d.setUTCDate(d.getUTCDate() + days);
  return toDateKey(d);
}

export function getTodayDateKeySaoPaulo(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SAO_PAULO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const values: Record<string, string> = {};
  for (const part of parts) {
    values[part.type] = part.value;
  }
  return `${values.year}-${values.month}-${values.day}`;
}

export function daysUntil(dateKey: string, fromKey?: string): number {
  const target = parseDateOnly(dateKey).getTime();
  const base = parseDateOnly(fromKey ?? getTodayDateKeySaoPaulo()).getTime();
  return Math.round((target - base) / DAY_MS);
}

/**
 * Retorna o plano de email para uma data específica, ou null se nenhum
 * email deve ser enviado nesse dia.
 *
 * Regra:
 * - >30 dias: nada
 * - 30..3 (múltiplos de 3): countdown "Faltam X dias"
 * - 2 e 1 dias: countdown diário
 * - 0 dias: event_today "É HOJE!"
 * - <0 dias (após evento): nada
 */
export function getReminderPlan(
  eventDate: string,
  dateKey: string
): ReminderPlan | null {
  const d = daysUntil(eventDate, dateKey);
  if (d < 0) return null;
  if (d === 0) return { daysUntil: 0, type: "event_today", scheduledFor: dateKey };
  if (d > 30) return null;
  if (d % 3 === 0 || d === 2 || d === 1) {
    return { daysUntil: d, type: "countdown", scheduledFor: dateKey };
  }
  return null;
}

/**
 * Retorna todas as datas (inclusive) em que um lembrete deve ser
 * enviado, para fins de teste/visualização da agenda completa.
 */
export function getFullReminderDates(eventDate: string): string[] {
  const dates: string[] = [];
  for (let d = 30; d >= 1; d--) {
    if (d % 3 === 0 || d === 2 || d === 1) {
      dates.push(addDays(eventDate, -d));
    }
  }
  dates.push(eventDate);
  return dates;
}

export function getReminderSubject(daysUntil: number): string {
  if (daysUntil <= 0) return "É HOJE! A Academia RH acontece hoje";
  if (daysUntil === 1) return "Falta 1 dia para a Academia RH";
  return `Faltam ${daysUntil} dias para a Academia RH`;
}