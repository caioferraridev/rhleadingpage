import { Section, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { CtaButton } from "@/components/ui/cta-button";
import { eventConfig } from "@/lib/event-config";

export function WhoFor() {
  return (
    <Section id="para-quem">
      <Reveal>
        <SectionTitle eyebrow="Para quem é" subtitle="Esta 1ª edição é para você que:">
          O treinamento é para quem quer
          <br className="hidden sm:block" />{" "}
          <span className="text-brand-gradient">selecionar melhor</span>
        </SectionTitle>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventConfig.targetAudience.map((item, index) => (
          <Reveal key={item.title} delay={index * 60}>
            <Card hover className="flex items-start gap-4 h-full">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-navy to-navy-600 text-white flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-teal-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="text-navy-900 font-bold leading-snug">{item.title}</h3>
                <p className="text-navy-600/80 text-sm leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-12 flex justify-center">
          <CtaButton label="QUERO ME INSCREVER" size="lg" className="w-full sm:w-auto" />
        </div>
      </Reveal>
    </Section>
  );
}