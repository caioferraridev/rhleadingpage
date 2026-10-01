import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { eventConfig } from "@/lib/event-config";

export function About() {
  return (
    <Section id="o-que-e" className="bg-mist">
      <Reveal>
        <SectionTitle eyebrow="Sobre a Academia RH">
          O que é a <span className="text-brand-gradient">Academia RH</span>?
        </SectionTitle>
      </Reveal>

      <Reveal delay={100}>
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <p className="text-lg md:text-xl text-navy-600/80 leading-relaxed">
            {eventConfig.aboutText}
          </p>
          <p className="text-2xl md:text-3xl font-black text-brand-gradient">
            {eventConfig.aboutStatement}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}