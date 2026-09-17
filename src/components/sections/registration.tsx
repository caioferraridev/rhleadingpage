"use client";

import { useState } from "react";
import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { AvailabilityNotice } from "@/components/ui/spots-indicator";
import { CheckoutForm } from "@/components/checkout-form";
import { WaitlistForm } from "@/components/waitlist-form";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { eventConfig } from "@/lib/event-config";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/whatsapp";
import type { Event } from "@/types/database";
import { ShieldCheck, Sparkles, ArrowLeft, Coffee } from "lucide-react";

interface RegistrationSectionProps {
  event: Event;
  isSoldOut: boolean;
  loading?: boolean;
}

export function RegistrationSection({
  event,
  isSoldOut,
  loading,
}: RegistrationSectionProps) {
  const [view, setView] = useState<"select" | "checkout" | "waitlist">("select");
  const [notice, setNotice] = useState<string | null>(null);

  const handleCheckout = async (data: { name: string; email: string; phone: string }) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (json.code === "EVENT_NOT_AVAILABLE") {
        setNotice(
          "As inscrições ainda não estão abertas. Deixe seus dados abaixo e avisaremos você assim que liberarmos o acesso (ou resolva seu pagamento)!"
        );
        setView("waitlist");
        throw new Error("__NOT_AVAILABLE__");
      }
      throw new Error(json.error || "Erro ao iniciar o pagamento.");
    }
    return json.url as string;
  };

  return (
    <Section id="inscricao" className="relative bg-gradient-to-b from-white via-mist to-white">
      {/* decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full border border-navy-100/60 pointer-events-none" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] rounded-full border border-teal-100/70 pointer-events-none" aria-hidden />

      <div className="relative">
        <Reveal>
          <SectionTitle
            eyebrow="Garanta sua vaga"
            subtitle="Garanta seu lugar presencialmente. Vagas limitadas."
          >
            Pronto para dar o próximo passo?
          </SectionTitle>
        </Reveal>

        <Reveal delay={100}>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-[1.8rem] overflow-hidden shadow-[0_40px_90px_-40px_rgba(1,33,74,0.5)] border border-navy-100 bg-white">
              {/* Top brand band */}
              <div className="bg-gradient-to-r from-navy via-navy-600 to-navy p-6 md:p-8 text-white text-center">
                <h3 className="text-xl md:text-2xl font-black tracking-tight">{eventConfig.name}</h3>
                <p className="text-teal-200/90 text-sm mt-1 font-medium">{eventConfig.tagline}</p>
                <p className="inline-flex items-center gap-2 mt-3 bg-white/10 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-200">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden />
                  Primeira edição · {eventConfig.editionTitle}
                </p>

                <div className="flex items-baseline justify-center gap-2 mt-5">
                  <span className="text-5xl font-black">{formatPrice(event.price)}</span>
                </div>
                <p className="text-navy-100/70 text-xs uppercase tracking-widest mt-1">
                  Investimento único
                </p>
              </div>

              <div className="p-6 md:p-9">
                {view === "select" && (
                  <div className="space-y-6">
                    {/* Availability notice (no counters) */}
                    <div className="rounded-2xl border border-navy-100 bg-mist p-5">
                      {loading ? (
                        <p className="text-center font-bold text-navy">Consultando disponibilidade...</p>
                      ) : (
                        <AvailabilityNotice isSoldOut={isSoldOut} />
                      )}
                    </div>

                    {isSoldOut ? (
                      <div className="space-y-4">
                        <p className="text-center text-navy-700 font-semibold">
                          As vagas para participação estão esgotadas. Entre na lista de espera e
                          seja avisado(a) caso uma vaga seja liberada.
                        </p>
                        <button
                          onClick={() => setView("waitlist")}
                          className="btn-teal text-base w-full"
                        >
                          ENTRAR NA LISTA DE ESPERA
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <button onClick={() => setView("checkout")} className="btn-brand text-lg w-full py-4">
                          QUERO GARANTIR MINHA VAGA
                        </button>

                        <div className="border-t border-navy-100 pt-5 text-center">
                          <p className="text-sm font-semibold text-navy-500 mb-3">
                            Prefere falar com a gente?
                          </p>
                          <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost-brand text-base w-full py-3.5"
                            aria-label="Falar com a Academia RH pelo WhatsApp"
                          >
                            <WhatsAppIcon className="w-5 h-5 text-teal-600" />
                            Falar pelo WhatsApp
                          </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-navy-600 pt-1 text-center">
                          <div className="flex items-center gap-1.5 justify-center">
                            <ShieldCheck className="w-4 h-4 text-teal-600" /> Pagamento seguro
                          </div>
                          <div className="flex items-center gap-1.5 justify-center">
                            <Coffee className="w-4 h-4 text-teal-600" /> Coffee Break incluso
                          </div>
                          <div className="flex items-center gap-1.5 justify-center">
                            <Sparkles className="w-4 h-4 text-teal-600" /> Conteúdo exclusivo
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {view === "checkout" && (
                  <div>
                    <button
                      onClick={() => setView("select")}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-500 hover:text-navy mb-5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                    <h4 className="text-lg font-black text-navy mb-4 text-center">
                      Preencha seus dados para continuar
                    </h4>
                    <CheckoutForm onSubmit={handleCheckout} />
                  </div>
                )}

                {view === "waitlist" && (
                  <div>
                    {notice && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 text-sm mb-4">
                        {notice}
                      </div>
                    )}
                    {!isSoldOut && (
                      <button
                        onClick={() => {
                          setNotice(null);
                          setView("select");
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-500 hover:text-navy mb-5"
                      >
                        <ArrowLeft className="w-4 h-4" /> Voltar
                      </button>
                    )}
                    <h4 className="text-lg font-black text-navy mb-4 text-center">
                      Entre na lista de espera
                    </h4>
                    <WaitlistForm eventId={event.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
