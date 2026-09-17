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
        <SectionTitle eyebrow="Sobre a Academia RH">
          O que é a <span className="text-brand-gradient">Academia RH</span>?
        </SectionTitle>
      </Reveal>

      <Reveal delay={100}>
        <div className="mb-12 max-w-3xl mx-auto text-center space-y-6">
          <p className="text-lg text-navy-600/80 leading-relaxed">
            A Academia RH nasceu de uma experiência construída ao longo de anos de
            atuação em Recursos Humanos e da vontade de compartilhar aquilo que
            realmente funciona na prática.
          </p>
          <p className="text-lg text-navy-600/80 leading-relaxed">
            Mais do que transmitir conceitos, a proposta é criar experiências de
            aprendizagem que aproximem o conhecimento dos desafios encontrados pelos
            profissionais e pelas empresas no dia a dia.
          </p>
          <p className="text-2xl md:text-3xl font-black text-brand-gradient pt-1">
            Aprender. Praticar. Transformar.
          </p>
          <p className="text-lg text-navy-600/80 leading-relaxed">
            Esse é o propósito que guia a Academia RH.
          </p>
          <p className="text-lg text-navy-600/80 leading-relaxed">
            E se você está buscando mais conhecimento, segurança e preparo para lidar
            com pessoas e processos de contratação, essa experiência foi pensada para
            você.
          </p>
          <p className="text-lg text-navy-600/80 leading-relaxed font-medium">
            Venha aprender na prática, trocar experiências e dar um novo passo no seu
            desenvolvimento profissional.
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
