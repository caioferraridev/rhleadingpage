import { eventConfig } from "@/lib/event-config";
import type { Event, Registration } from "@/types/database";

const NAVY = "#0b2a55";
const NAVY_DARK = "#081d3d";
const TEAL = "#0d9488";
const MIST = "#f4f6fb";
const TEXT = "#3f4a5c";

const BRAND_COLORS = `
  .brand-bg { background-color: ${NAVY_DARK}; }
  .header-accent { background-color: ${TEAL}; }
  .facts-grid { background-color: ${MIST}; }
  .btn-primary { background-color: ${TEAL}; color: #ffffff; }
  .btn-secondary { background-color: ${NAVY}; color: #ffffff; }
`;

const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function formatDatePtBr(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return `${d} de ${MONTHS_PT[m - 1]} de ${y}`;
}

export function formatTimeBr(time: string): string {
  const h = Number(time.slice(0, 2));
  return `${String(h).padStart(2, "0")}h`;
}

export function getFirstName(name?: string | null): string | null {
  const first = name?.trim().split(/\s+/)[0];
  return first ? first : null;
}

function greeting(name?: string | null): string {
  const first = getFirstName(name);
  return first ? `Olá, ${first}!` : "Olá!";
}

function eventFactsHtml(event: Event): string {
  const addressLines = (event.address || eventConfig.address)
    .split("\n")
    .map((l) => `<span>${l.trim()}</span>`)
    .join("<br>");

  return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="facts-grid" style="border-radius:18px; padding:28px 32px;">
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" style="padding:10px 6px; vertical-align:top;">
                  <p style="margin:0; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8a94a6;">Data</p>
                  <p style="margin:6px 0 0; font-size:16px; font-weight:700; color:${NAVY};">${formatDatePtBr(event.event_date)}</p>
                </td>
                <td width="33%" style="padding:10px 6px; vertical-align:top;">
                  <p style="margin:0; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8a94a6;">Horário</p>
                  <p style="margin:6px 0 0; font-size:16px; font-weight:700; color:${NAVY};">${formatTimeBr(event.start_time)} às ${formatTimeBr(event.end_time)}</p>
                </td>
                <td width="33%" style="padding:10px 6px; vertical-align:top;">
                  <p style="margin:0; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8a94a6;">Coffee Break</p>
                  <p style="margin:6px 0 0; font-size:16px; font-weight:700; color:${NAVY};">Incluso</p>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="padding:10px 6px 0;">
                  <p style="margin:0; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8a94a6;">Local</p>
                  <p style="margin:6px 0 0; font-size:16px; font-weight:700; color:${NAVY};">${event.location}</p>
                  <p style="margin:4px 0 0; font-size:13px; color:${TEXT};">${addressLines}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
}

function topicsHtml(): string {
  const topics = eventConfig.benefits.map((b) => b.title);
  const bullets = topics
    .map(
      (t) =>
        `<li style="padding:5px 0; font-size:14px; color:${TEXT};">&#9989; ${t}</li>`
    )
    .join("");
  return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 4px;">
            <p style="margin:0 0 4px; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8a94a6;">O que você vai encontrar</p>
            <p style="margin:0 0 10px; font-size:18px; font-weight:800; color:${NAVY};">Conteúdo da Academia RH</p>
            <ul style="margin:0; padding-left:18px;">${bullets}</ul>
          </td>
        </tr>
      </table>`;
}

function speakerHtml(): string {
  return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${MIST}; border-radius:18px; padding:28px 32px;">
        <tr>
          <td>
            <p style="margin:0 0 4px; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8a94a6;">Palestrante</p>
            <p style="margin:0 0 2px; font-size:20px; font-weight:800; color:${NAVY};">${eventConfig.speaker.name}</p>
            <p style="margin:0 0 12px; font-size:13px; font-weight:700; color:${TEAL};">${eventConfig.speaker.role}</p>
            <p style="margin:0 0 12px; font-size:14px; line-height:1.55; color:${TEXT};">${eventConfig.speaker.bioIntro}</p>
            <p style="margin:0; font-size:14px; line-height:1.55; color:${NAVY}; font-weight:600; border-left:3px solid ${TEAL}; padding-left:12px;">${eventConfig.speaker.bioQuote}</p>
          </td>
        </tr>
      </table>`;
}

function ctasHtml(): string {
  return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center; padding:28px 0 8px;">
            <a href="${eventConfig.whatsappGroupLink}" target="_blank" class="btn-primary" style="display:inline-block; padding:15px 34px; border-radius:14px; font-size:16px; font-weight:800; text-decoration:none; letter-spacing:0.3px;">ENTRAR NO GRUPO OFICIAL</a>
          </td>
        </tr>
        <tr>
          <td style="text-align:center; padding:12px 0 8px;">
            <a href="https://wa.me/${eventConfig.whatsappNumber}" target="_blank" style="color:${TEAL}; font-size:14px; font-weight:700; text-decoration:none;">Falar com a Academia RH pelo WhatsApp</a>
          </td>
        </tr>
      </table>`;
}

function layoutHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <style>${BRAND_COLORS} @media only screen and (max-width:600px){ .inner{width:100%!important;} }</style>
  </head>
  <body style="margin:0; padding:0; background-color:#e9edf3;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#e9edf3; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="inner" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(11,42,85,0.12);">
            <tr>
              <td class="brand-bg" style="padding:34px 40px 28px; text-align:center;">
                <p style="margin:0; font-size:26px; font-weight:900; color:#ffffff; letter-spacing:2px;">ACADEMIA <span style="color:#5eead4;">RH</span></p>
                <p style="margin:8px 0 0; font-size:13px; color:#9fb6d8; letter-spacing:0.6px;">${eventConfig.tagline}</p>
              </td>
            </tr>
            <tr><td class="header-accent" style="height:6px; padding:0;"></td></tr>
            <tr>
              <td style="padding:36px 40px 12px; text-align:left;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 40px 34px;">
                ${ctasHtml()}
              </td>
            </tr>
            <tr>
              <td style="background-color:${MIST}; padding:22px 40px; text-align:center; border-top:1px solid #e2e7ef;">
                <p style="margin:0 0 6px; font-size:12px; color:${TEXT};">${eventConfig.name} &middot; Vagas limitadas a ${eventConfig.capacity} participantes</p>
                <p style="margin:0; font-size:12px; color:#8a94a6;">&copy; 2026 Academia RH</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// TODO(programacao): quando houver agenda/programação oficial do evento no
// projeto, exibí-la nos templates abaixo no lugar indicado por <!-- AGENDA -->.
const AGENDA_PLACEHOLDER = "<!-- AGENDA -->";

export function confirmationTemplate(opts: {
  event: Event;
  name?: string | null;
}): string {
  const { event } = opts;
  const body = `
    <h1 style="margin:0 0 8px; font-size:22px; font-weight:800; color:${NAVY};">Inscrição confirmada!</h1>
    <p style="margin:0 0 6px; font-size:15px; color:${TEXT}; line-height:1.6;">${greeting(opts.name)}</p>
    <p style="margin:0 0 24px; font-size:15px; color:${TEXT}; line-height:1.6;">Sua inscrição para a <strong>Academia RH</strong> foi confirmada com sucesso. Estamos ansiosos para te receber!</p>

    <p style="margin:0 0 14px; font-size:20px; font-weight:800; color:${NAVY}; text-align:center;">ACADEMIA RH</p>
    ${eventFactsHtml(event)}
    ${AGENDA_PLACEHOLDER}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:28px 4px 4px;">
          <p style="margin:0 0 8px; font-size:15px; color:${TEXT}; line-height:1.6;">${eventConfig.description}</p>
        </td>
      </tr>
    </table>
    ${topicsHtml()}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:24px;"></td></tr></table>
    ${speakerHtml()}
  `;
  return layoutHtml("Inscrição confirmada — Academia RH", body);
}

export function adminTemplate(opts: {
  event: Event;
  registration: Registration;
  spotsLeft: number;
}): string {
  const { event, registration, spotsLeft } = opts;
  const rows: Array<[string, string]> = [
    ["Inscrito", registration.name],
    ["E-mail", registration.email],
    ["Telefone", registration.phone || "—"],
    ["Data/hora da inscrição", new Date(registration.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })],
    ["Valor pago", `R$ ${(registration.amount_paid / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
    ["Status do pagamento", registration.payment_status === "paid" ? "Pago (approved)" : registration.payment_status],
    ["ID do pagamento (Mercado Pago)", registration.mercadopago_payment_id || "—"],
    ["ID da inscrição", registration.id],
    ["Vagas restantes", `${spotsLeft}`],
  ];

  const rowsHtml = rows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:9px 10px; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; color:#8a94a6; border-bottom:1px solid #eef1f6;">${k}</td>
        <td style="padding:9px 10px; font-size:14px; font-weight:600; color:${NAVY}; border-bottom:1px solid #eef1f6;">${v}</td>
      </tr>`
    )
    .join("");

  const body = `
    <h1 style="margin:0 0 8px; font-size:20px; font-weight:800; color:${NAVY};">Nova inscrição confirmada</h1>
    <p style="margin:0 0 20px; font-size:14px; color:${TEXT};">Uma nova inscrição foi confirmada e paga via Mercado Pago para "${eventConfig.name}" (${formatDatePtBr(event.event_date)}).</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${MIST}; border-radius:14px; padding:12px 14px;">
      ${rowsHtml}
    </table>
  `;
  return layoutHtml("Nova inscrição confirmada — Academia RH", body);
}

export function countdownTemplate(opts: {
  event: Event;
  daysUntil: number;
  name?: string | null;
}): string {
  const { event, daysUntil } = opts;
  const spotlight = daysUntil === 1 ? "Falta 1 dia para a Academia RH!" : `Faltam ${daysUntil} dias para a Academia RH!`;
  const body = `
    <p style="margin:0 0 6px; font-size:15px; color:${TEXT};">${greeting(opts.name)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="brand-bg" style="border-radius:18px;">
      <tr>
        <td style="padding:30px 24px 24px; text-align:center;">
          <p style="margin:0; font-size:13px; letter-spacing:2px; text-transform:uppercase; color:#9fb6d8;">Contagem regressiva</p>
          <p style="margin:10px 0 4px; font-size:30px; font-weight:900; color:#ffffff; line-height:1.15;">${spotlight}</p>
          <p style="margin:0; font-size:14px; color:#9fb6d8;">Guarde a data e prepare-se para essa experiência presencial.</p>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;"></td></tr></table>
    ${eventFactsHtml(event)}
    ${AGENDA_PLACEHOLDER}
    ${topicsHtml()}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;"></td></tr></table>
    ${speakerHtml()}
  `;
  return layoutHtml(spotlight, body);
}

export function eventTodayTemplate(opts: {
  event: Event;
  name?: string | null;
}): string {
  const { event } = opts;
  const body = `
    <p style="margin:0 0 6px; font-size:15px; color:${TEXT};">${greeting(opts.name)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="brand-bg" style="border-radius:18px;">
      <tr>
        <td style="padding:34px 24px 26px; text-align:center;">
          <p style="margin:0; font-size:38px; font-weight:900; color:#ffffff; line-height:1.1;">É HOJE!</p>
          <p style="margin:12px 0 0; font-size:17px; font-weight:700; color:#5eead4;">A Academia RH acontece hoje.</p>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;"></td></tr></table>
    ${eventFactsHtml(event)}
    ${AGENDA_PLACEHOLDER}
    <p style="margin:0 0 20px; font-size:15px; color:${TEXT}; line-height:1.6;">${eventConfig.description}</p>
    ${topicsHtml()}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;"></td></tr></table>
    ${speakerHtml()}
  `;
  return layoutHtml("É HOJE! A Academia RH acontece hoje", body);
}