import type { NextConfig } from "next";

const deploymentEnv = process.env.NODE_ENV;

// Headers de segurança aplicados em todas as respostas.
// Em produção também adicionamos CSP e HSTS.
function securityHeaders() {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' ws:",
    "frame-src 'self' https://*.mercadopago.com.br https://*.mercadopago.com https://*.mercadolibre.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");

  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
    ...(deploymentEnv === "production"
      ? [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy", value: csp },
        ]
      : []),
  ];
}

const nextConfig: NextConfig = {
  // Permite acesso ao dev server a partir de outros dispositivos na mesma rede
  // (celular/tablet) que acessam via IP da LAN. Sem isso, o Next.js 16 bloqueia
  // os scripts cross-origin, quebrando hidratação/FAQ/checkout ao abrir pelo IP.
  allowedDevOrigins: [
    "26.150.181.197",
    "192.168.*",
    "10.*",
    "172.16.*",
    "localhost",
    "*.trycloudflare.com",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders(),
      },
    ];
  },
};

export default nextConfig;