"use client";

import { useState } from "react";
import { Section, SectionTitle } from "@/components/ui/section";
import { CheckoutForm } from "@/components/checkout-form";
import { WaitlistForm } from "@/components/waitlist-form";
import { eventConfig } from "@/lib/event-config";
import { formatPrice } from "@/lib/utils";
import type { Event } from "@/types/database";
import { Users, Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";

interface RegistrationSectionProps {
  event: Event;
  spotsLeft: number;
  isSoldOut: boolean;
  isLastSpots: boolean;
  loading?: boolean;
}

export function RegistrationSection({
  event,
  spotsLeft,
  isSoldOut,
  isLastSpots,
  loading,
}: RegistrationSectionProps) {
  const [view, setView] = useState<"select" | "checkout" | "waitlist">("select");

  const handleCheckout = async (data: { name: string; email: string; phone: string }) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Erro ao iniciar o pagamento.");
    }
    return json.url as string;
  };

  const stateLabel = isSoldOut
    ? "VAGAS ESGOTADAS"
    : isLastSpots
    ? "ÚLTIMAS VAGAS DISPONÍVEIS"
    : `${spotsLeft} DE ${event.capacity} VAGAS DISPONÍVEIS`;

  return (
    <Section id="inscricao">
      <SectionTitle subtitle="Garanta seu lugar presencialmente. Vagas limitadas a 50 participantes.">
        Garanta sua vaga
      </SectionTitle>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border-2 border-amber-500 shadow-2xl shadow-amber-500/20 p-8 md:p-10">
          {/* Status banner */}
          <div
            className={`text-center rounded-xl px-4 py-3 mb-6 font-bold text-sm ${
              isSoldOut
                ? "bg-red-50 text-red-700 border border-red-200"
                : isLastSpots
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            <AlertTriangle className="w-5 h-5 inline mr-2 -mt-0.5" />
            {loading ? "Consultando vagas..." : stateLabel}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-900">{eventConfig.name}</h3>
            <p className="text-slate-600 mt-1">{eventConfig.tagline}</p>
            <p className="text-4xl font-bold text-amber-500 mt-4">
              {formatPrice(event.price)}
            </p>
            <p className="text-sm text-slate-500">Investimento único, sem mensalidades</p>
          </div>

          {view === "select" && (
            <div className="space-y-4">
              {/* Spots meter */}
              <div className="mb-2">
                <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                  <span>
                    {isSoldOut
                      ? `${event.capacity}/${event.capacity} vagas preenchidas`
                      : `${spotsLeft} de ${event.capacity} vagas disponíveis`}
                  </span>
                  <span>{isSoldOut ? "100%" : `${Math.round((spotsLeft / event.capacity) * 100)}%`}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSoldOut ? "bg-red-500" : isLastSpots ? "bg-amber-500" : "bg-green-500"
                    }`}
                    style={{
                      width: isSoldOut ? "100%" : `${((event.capacity - spotsLeft) / event.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {isSoldOut ? (
                <div className="space-y-4">
                  <p className="text-center text-slate-700 font-semibold">
                    As {event.capacity} vagas disponíveis foram preenchidas.
                  </p>
                  <button
                    onClick={() => setView("waitlist")}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-lg transition-colors w-full"
                  >
                    ENTRAR NA LISTA DE ESPERA
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setView("checkout")}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-4 rounded-lg transition-colors shadow-lg shadow-amber-500/30 text-lg w-full"
                  >
                    QUERO GARANTIR MINHA VAGA
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500 pt-4 text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> Pagamento seguro
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <Users className="w-4 h-4 text-amber-500" /> Presencial
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Conteúdo exclusivo
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {view === "checkout" && (
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-4 text-center">
                Preencha seus dados para continuar
              </h4>
              <CheckoutForm onSubmit={handleCheckout} onCancel={() => setView("select")} />
            </div>
          )}

          {view === "waitlist" && (
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-4 text-center">
                Entre na lista de espera
              </h4>
              <WaitlistForm eventId={event.id} />
              {!isSoldOut && (
                <button
                  onClick={() => setView("select")}
                  className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-3"
                >
                  Voltar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
