import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Academia RH | Palestra de RH em Bauru",
    template: "%s | Academia RH",
  },
  description:
    "Palestra presencial de RH e recrutamento para iniciantes em Bauru/SP. Aprenda na prática como funcionam os processos seletivos e dê o primeiro passo na sua carreira. Vagas limitadas a 50 participantes.",
  keywords: [
    "Academia RH",
    "palestra RH",
    "recrutamento",
    "RH para iniciantes",
    "carreira em RH",
    "Bauru",
    "evento presencial RH",
  ],
  authors: [{ name: "Academia RH" }],
  openGraph: {
    title: "Academia RH | Palestra de RH em Bauru",
    description:
      "Palestra presencial de RH e recrutamento para iniciantes em Bauru/SP. Vagas limitadas a 50 participantes. Garanta sua vaga!",
    type: "website",
    locale: "pt_BR",
    siteName: "Academia RH",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Academia RH - Palestra de RH em Bauru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academia RH | Palestra de RH em Bauru",
    description:
      "Palestra presencial de RH e recrutamento para iniciantes em Bauru/SP. Vagas limitadas a 50 participantes.",
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
  themeColor: "#f59e0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
