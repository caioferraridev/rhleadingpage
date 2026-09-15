import { Section, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { eventConfig } from "@/lib/event-config";

export function WhoFor() {
  return (
    <Section id="para-quem">
      <Reveal>
        <SectionTitle
          eyebrow="Para quem é"
          subtitle="Se você se identificou com alguma dessas situações, este encontro foi pensado para você."
        >
          A Academia RH é para você que...
        </SectionTitle>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventConfig.targetAudience.map((item, index) => (
          <Reveal key={item} delay={index * 60}>
            <Card hover className="flex items-start gap-4 h-full">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-navy to-navy-600 text-white flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-teal-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <p className="text-navy-800 font-semibold mt-2.5 leading-snug">{item}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
