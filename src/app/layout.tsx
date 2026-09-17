import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhatsAppFloat } from "@/components/whatsapp-float";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Academia RH | Desenvolvimento e capacitação em Gestão de Pessoas",
    template: "%s | Academia RH",
  },
  description:
    "Academia RH é um espaço de desenvolvimento e capacitação para profissionais e empresas que desejam aprender, praticar e transformar a gestão de pessoas. Evento presencial com Talita Maia em Bauru/SP. 17 de outubro de 2026, das 08h às 13h, na Universidade Anhembi Morumbi. Coffee break incluso. Vagas limitadas.",
  keywords: [
    "Academia RH",
    "Talita Maia",
    "gestão de pessoas",
    "capacitação de RH",
    "recrutamento",
    "desenvolvimento de pessoas",
    "liderança",
    "RH estratégico",
    "evento presencial RH",
    "Bauru",
    "Universidade Anhembi Morumbi",
  ],
  authors: [{ name: "Academia RH" }],
  openGraph: {
    title: "Academia RH | Desenvolvimento e capacitação em Gestão de Pessoas",
    description:
      "Conhecimento vira prática, profissionais ganham segurança e empresas constroem resultados melhores por meio das pessoas. Evento presencial em Bauru/SP com Talita Maia em 17 de outubro de 2026. Coffee break incluso. Vagas limitadas.",
    type: "website",
    locale: "pt_BR",
    siteName: "Academia RH",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Academia RH - Desenvolvimento e capacitação em Gestão de Pessoas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academia RH | Desenvolvimento e capacitação em Gestão de Pessoas",
    description:
      "Conhecimento vira prática, profissionais ganham segurança e empresas constroem resultados melhores por meio das pessoas. Evento presencial em Bauru/SP em 17 de outubro de 2026. Vagas limitadas.",
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
