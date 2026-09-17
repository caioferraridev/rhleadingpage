import { Section, SectionTitle } from "@/components/ui/section";
import { Card, CardIcon } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { eventConfig } from "@/lib/event-config";
import { Target, Rocket, BadgeCheck, Eye, Users, BookOpen } from "lucide-react";

const benefitIcons = [BadgeCheck, Rocket, Target, Eye, Users, BookOpen];

export function About() {
  return (
    <Section id="o-que-e" className="bg-mist">
      <Reveal>
        <SectionTitle
          eyebrow="Sobre a Academia RH"
          subtitle="A Academia RH é um espaço de desenvolvimento e capacitação que transforma conhecimento em prática, ajudando profissionais e empresas a desenvolverem uma gestão de pessoas mais preparada, estratégica e humana."
        >
          O que é a <span className="text-brand-gradient">Academia RH</span>?
        </SectionTitle>
      </Reveal>

      <Reveal delay={100}>
        <div className="mb-12 max-w-3xl mx-auto text-center">
          <p className="text-lg text-navy-600/80 leading-relaxed">
            Ao longo de sua trajetória, a Academia RH poderá abordar diferentes temas
            relacionados à gestão de pessoas. Nesta primeira edição, o foco é
            <span className="font-bold text-navy"> Recrutamento e Seleção</span>.
          </p>
          <p className="text-lg text-navy-600/80 leading-relaxed mt-4">
            {eventConfig.editionFocus}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventConfig.benefits.map((benefit, index) => {
          const Icon = benefitIcons[index % benefitIcons.length];
          return (
            <Reveal key={benefit.title} delay={index * 60}>
              <Card hover className="h-full">
                <CardIcon>
                  <Icon className="w-6 h-6" />
                </CardIcon>
                <h3 className="text-lg font-bold text-navy mb-2">{benefit.title}</h3>
                <p className="text-navy-600/80 text-sm leading-relaxed">{benefit.description}</p>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
