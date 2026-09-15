import type { NextConfig } from "next";

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
};

export default nextConfig;