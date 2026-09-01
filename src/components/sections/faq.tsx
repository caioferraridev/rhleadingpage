"use client";

import { useState } from "react";
import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Preciso ter experiência para participar?",
    answer:
      "Não! A Academia RH foi pensada justamente para quem está começando ou quer iniciar na área de RH. Não é necessário nenhum conhecimento prévio.",
  },
  {
    question: "O evento é presencial mesmo?",
    answer:
      "Sim! A palestra acontece presencialmente em Bauru/SP. Esse formato é ideal para o networking e a troca de experiências com a palestrante e outros participantes.",
  },
  {
    question: "Como recebo a confirmação da minha inscrição?",
    answer:
      "Assim que o pagamento for confirmado, você recebe a confirmação pelo e-mail cadastrado e sua vaga fica garantida.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "O pagamento é feito de forma segura pela Stripe, com cartão de crédito. Todo o processo é automático e você recebe a confirmação imediatamente.",
  },
  {
    question: "E se eu precisar de mais informações?",
    answer:
      "Fique à vontade para entrar em contato. Teremos o maior prazer em te ajudar a garantir sua participação.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-mist">
      <Reveal>
        <SectionTitle
          eyebrow="Dúvidas"
          subtitle="Ficou com alguma dúvida? Confira as respostas abaixo."
        >
          Perguntas frequentes
        </SectionTitle>
      </Reveal>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = open === index;
          return (
            <Reveal key={faq.question} delay={index * 50}>
              <div
                className={cn(
                  "bg-white rounded-xl border overflow-hidden transition-colors",
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
    </Section>
  );
}
