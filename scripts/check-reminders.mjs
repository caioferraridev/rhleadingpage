// Verificação da regra de lembretes da Academia RH.
// Espelha as funções puras de src/lib/emails/countdown.ts (manter em sincronia).
// Uso: node scripts/check-reminders.mjs

const DAY_MS = 1000 * 60 * 60 * 24;
const EVENT_DATE = "2026-10-17";

function parseDateOnly(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateKey, days) {
  const d = parseDateOnly(dateKey);
  d.setUTCDate(d.getUTCDate() + days);
  return toDateKey(d);
}

function daysUntil(dateKey, fromKey) {
  return Math.round((parseDateOnly(dateKey).getTime() - parseDateOnly(fromKey).getTime()) / DAY_MS);
}

function getReminderPlan(eventDate, dateKey) {
  const d = daysUntil(eventDate, dateKey);
  if (d < 0) return null;
  if (d === 0) return { type: "event_today", daysUntil: 0 };
  if (d > 30) return null;
  if (d % 3 === 0 || d === 2 || d === 1) return { type: "countdown", daysUntil: d };
  return null;
}

function getFullReminderDates(eventDate) {
  const dates = [];
  for (let d = 30; d >= 1; d--) {
    if (d % 3 === 0 || d === 2 || d === 1) dates.push(addDays(eventDate, -d));
  }
  dates.push(eventDate);
  return dates;
}

const EXPECTED_DATES = [
  "2026-09-17", "2026-09-20", "2026-09-23", "2026-09-26", "2026-09-29",
  "2026-10-02", "2026-10-05", "2026-10-08", "2026-10-11",
  "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17",
];

let failures = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok ? "" : `\n  esperado: ${expected}\n  obtido:   ${actual}`}`);
}

// 1) Agenda completa de lembretes
check("agenda completa", getFullReminderDates(EVENT_DATE).join(","), EXPECTED_DATES.join(","));

// 2) Plano por data
check("17/10 (3 dias antes) -> countdown", getReminderPlan(EVENT_DATE, "2026-10-14").type, "countdown");
check("17/10 (2 dias antes) -> countdown", getReminderPlan(EVENT_DATE, "2026-10-15").daysUntil, 2);
check("17/10 (1 dia antes) -> countdown", getReminderPlan(EVENT_DATE, "2026-10-16").daysUntil, 1);
check("17/10 (dia do evento) -> event_today", getReminderPlan(EVENT_DATE, "2026-10-17").type, "event_today");
check("dia 18/10 -> nenhum (passou)", getReminderPlan(EVENT_DATE, "2026-10-18"), null);
check("d+31 (16/09) -> nenhum (>30)", getReminderPlan(EVENT_DATE, "2026-09-16"), null);
check("d+28 (19/09) -> nenhum (não múltiplo de 3)", getReminderPlan(EVENT_DATE, "2026-09-19"), null);
check("d+5 (12/10) -> nenhum", getReminderPlan(EVENT_DATE, "2026-10-12"), null);
check("d+24 (23/09) -> countdown", getReminderPlan(EVENT_DATE, "2026-09-23").daysUntil, 24);
check("d+30 (17/09) -> countdown", getReminderPlan(EVENT_DATE, "2026-09-17").daysUntil, 30);

// 3) Assuntos esperados (espelha getReminderSubject)
function getReminderSubject(daysUntil) {
  if (daysUntil <= 0) return "É HOJE! A Academia RH acontece hoje";
  if (daysUntil === 1) return "Falta 1 dia para a Academia RH";
  return `Faltam ${daysUntil} dias para a Academia RH`;
}
check("subject 30d", getReminderSubject(30), "Faltam 30 dias para a Academia RH");
check("subject 3d", getReminderSubject(3), "Faltam 3 dias para a Academia RH");
check("subject 2d", getReminderSubject(2), "Faltam 2 dias para a Academia RH");
check("subject 1d", getReminderSubject(1), "Falta 1 dia para a Academia RH");
check("subject 0d", getReminderSubject(0), "É HOJE! A Academia RH acontece hoje");

// 4) Invariantes da regra (independentes do espelhamento)
const dates = getFullReminderDates(EVENT_DATE);
let maxGap = 0;
for (let i = 1; i < dates.length; i++) {
  maxGap = Math.max(maxGap, daysUntil(dates[i], dates[i - 1]));
}
check("máximo intervalo entre lembretes <= 3 dias", maxGap <= 3, true);
check("últimos 3 dias enviados de forma consecutiva", dates.slice(-4, -1).join(","), "2026-10-14,2026-10-15,2026-10-16");
check("dia 17/10 ('É HOJE!') é o último", dates.at(-1), EVENT_DATE);
check("30 dias antes também é lembrado", dates[0], "2026-09-17");

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log("\nTodas as verificações passaram.");