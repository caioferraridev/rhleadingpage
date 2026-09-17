import { Section, SectionTitle } from "@/components/ui/section";
import { Card, CardIcon } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { eventConfig } from "@/lib/event-config";
import { Target, Handshake, Lightbulb, Rocket, BadgeCheck, Coffee } from "lucide-react";

const benefitIcons = [Target, Handshake, Lightbulb, Rocket, BadgeCheck, Coffee];

export function Experience() {
  return (
    <Section id="experiencia" className="bg-mist">
      <Reveal>
        <SectionTitle eyebrow="A experiência">
          O que você leva dessa <span className="text-brand-gradient">experiência</span>
        </SectionTitle>
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