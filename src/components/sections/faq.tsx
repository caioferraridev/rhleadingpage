"use client";

import { useState } from "react";
import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CtaButton } from "@/components/ui/cta-button";
import { ChevronDown } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { eventConfig } from "@/lib/event-config";
import { cn, formatDate, formatPrice, formatTime } from "@/lib/utils";
import type { Event } from "@/types/database";

function buildFaqs(event: Event) {
  const total = formatPrice(event.price);
  const months = eventConfig.installmentMonths;
  const installment = formatPrice(eventConfig.installmentPrice);
  const when = `${formatDate(event.event_date)}, das ${formatTime(event.start_time)} às ${formatTime(event.end_time)}`;

  return [
    {
      question: "Quem pode participar?",
      answer:
        "Profissionais de RH, iniciantes na área, gestores, líderes, empreendedores, pessoas que contratam fora do RH e estudantes de Administração e Psicologia. Não é preciso conhecimento prévio: o conteúdo é prático, do zero ou para quem já atua.",
    },
    {
      question: "Quando e onde será?",
      answer: `O encontro é presencial, na ${event.location}, ${when}.`,
    },
    {
      question: "Qual é o valor da inscrição?",
      answer: `O investimento é de ${total} à vista para a 1ª edição completa do treinamento, ou ${months}x de ${installment} no cartão de crédito.`,
    },
    {
      question: "Posso parcelar?",
      answer: `Sim. ${months}x de ${installment} no cartão de crédito, ou ${total} à vista. Você escolhe a melhor condição na tela de pagamento do Mercado Pago, que também aceita Pix, boleto e débito.`,
    },
    {
      question: "Como faço minha inscrição?",
      answer:
        "Clique em “Inscrever-me agora”, preencha nome, e-mail e telefone e você será redirecionado para concluir o pagamento no Mercado Pago. A confirmação chega no seu e-mail assim que o pagamento é aprovado.",
    },
    {
      question: "O que está incluso?",
      answer:
        "A participação em toda a jornada do treinamento, o coffee break durante o encontro e o certificado de participação.",
    },
  ];
}

export function FAQ({ event }: { event: Event }) {
  const faqs = buildFaqs(event);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-mist">
      <Reveal>
        <SectionTitle eyebrow="Dúvidas" subtitle="As perguntas mais comuns sobre a 1ª edição.">
          Antes de garantir sua vaga
        </SectionTitle>
      </Reveal>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = open === index;
          return (
            <Reveal key={faq.question} delay={index * 50}>
              <div
                className={cn(
                  "bg-white rounded-xl border transition-colors",
                  isOpen ? "border-teal-300" : "border-navy-100"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-bold text-navy">{faq.question}</span>
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors",
                      isOpen ? "bg-teal-500 text-white" : "bg-navy-50 text-navy-500"
                    )}
                  >
                    <ChevronDown
                      className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-navy-600/80 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={120}>
        <div className="mt-12 flex flex-col items-center gap-5">
          <CtaButton label="GARANTIR MINHA VAGA" size="lg" className="w-full sm:w-auto" />
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-navy-600 hover:text-teal-700 transition-colors"
            aria-label="Falar com a Academia RH pelo WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5 text-teal-600" />
            Ainda com dúvida? Fale com a gente no WhatsApp
          </a>
        </div>
      </Reveal>
    </Section>
  );
}