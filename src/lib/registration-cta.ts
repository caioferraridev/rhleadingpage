export const OPEN_REGISTRATION_EVENT = "academia-rh:abrir-inscricao";

/**
 * Ponto único de entrada para todos os CTAs da landing page.
 *
 * Rola até a seção de inscrição E pede que o formulário de checkout abra
 * automaticamente. Não existe um segundo fluxo de pagamento: o usuário
 * cai exatamente no mesmo formulário que chama `POST /api/checkout`.
 */
export function openRegistration() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(OPEN_REGISTRATION_EVENT));
  document
    .getElementById("inscricao")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}