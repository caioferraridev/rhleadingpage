export const EMAILS_CONFIG = {
  adminEmail: process.env.ADMIN_EMAIL || "madeinbauru@gmail.com",
  fromPrefix: "Academia RH",
  adminSubject: "Nova inscrição confirmada — Academia RH",
  confirmationSubject: "Inscrição confirmada — Academia RH",
};

export function getEmailFrom(): string | null {
  const from = process.env.EMAIL_FROM;
  if (from && from.includes("<")) return from;
  if (from) return `${EMAILS_CONFIG.fromPrefix} <${from}>`;
  return null;
}

export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY;
  return key && key.trim() ? key.trim() : null;
}

export function getCronSecret(): string | null {
  const secret = process.env.CRON_SECRET;
  return secret && secret.trim() ? secret.trim() : null;
}

export function isEmailConfigured(): boolean {
  return Boolean(getResendApiKey() && getEmailFrom());
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}