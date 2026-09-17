import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SITE_URL } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Academia RH | Recrutamento e Seleção na Prática",
    template: "%s | Academia RH",
  },
  description:
    "A Academia RH é um espaço de desenvolvimento e capacitação que transforma conhecimento em prática. Nesta primeira edição, o treinamento é dedicado a Recrutamento e Seleção. Evento presencial com Talita Maia em Bauru/SP. 17 de outubro de 2026, das 08h às 13h, na Universidade Anhembi Morumbi. Coffee break incluso. Vagas limitadas.",
  keywords: [
    "Academia RH",
    "Talita Maia",
    "recrutamento e seleção",
    "recrutamento",
    "seleção de profissionais",
    "processo seletivo",
    "capacitação de RH",
    "evento presencial RH",
    "Bauru",
    "Universidade Anhembi Morumbi",
  ],
  authors: [{ name: "Academia RH" }],
  openGraph: {
    title: "Academia RH | Recrutamento e Seleção na Prática",
    description:
      "Nesta primeira edição, o treinamento é dedicado a Recrutamento e Seleção, com abordagem prática para quem deseja aprender, aprimorar ou entender os processos de contratação. Evento presencial em Bauru/SP com Talita Maia em 17 de outubro de 2026. Coffee break incluso. Vagas limitadas.",
    type: "website",
    locale: "pt_BR",
    siteName: "Academia RH",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Academia RH - Recrutamento e Seleção na Prática",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academia RH | Recrutamento e Seleção na Prática",
    description:
      "Nesta primeira edição, o treinamento é dedicado a Recrutamento e Seleção. Evento presencial em Bauru/SP com Talita Maia em 17 de outubro de 2026. Vagas limitadas.",
    images: ["/images/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#012955",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-white text-navy-800 min-h-screen flex flex-col">
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
