import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

const isConfigured = Boolean(
  accessToken &&
    accessToken.length > 10 &&
    !accessToken.includes("your-access-token")
);

export const mercadoPagoClient = isConfigured
  ? new MercadoPagoConfig({
      accessToken: accessToken!,
      options: { timeout: 10000 },
    })
  : null;

export function getMercadoPagoClient() {
  if (!isConfigured || !mercadoPagoClient) {
    throw new Error(
      "Mercado Pago não configurado. Preencha a variável MERCADOPAGO_ACCESS_TOKEN no arquivo .env.local"
    );
  }
  return mercadoPagoClient;
}

export function getPreference() {
  return new Preference(getMercadoPagoClient());
}

export function getPayment() {
  return new Payment(getMercadoPagoClient());
}

export function getEnvironment(): "production" | "sandbox" {
  return (accessToken ?? "").startsWith("TEST-") ? "sandbox" : "production";
}