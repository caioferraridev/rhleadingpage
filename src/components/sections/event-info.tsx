import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CtaButton } from "@/components/ui/cta-button";
import { Clock, MapPin, CalendarCheck, Coffee } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import type { Event } from "@/types/database";

export function EventInfo({ event }: { event: Event }) {
  const items = [
    {
      icon: CalendarCheck,
      label: "Data",
      value: formatDate(event.event_date),
    },
    {
      icon: Clock,
      label: "Horário",
      value: `${formatTime(event.start_time)} às ${formatTime(event.end_time)}`,
    },
    {
      icon: MapPin,
      label: "Local",
      value: event.location,
      sub: event.address,
    },
  ];

  return (
    <Section id="evento">
      <Reveal>
        <SectionTitle eyebrow="Quando e onde">
          Data · Horário · Local
        </SectionTitle>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.label} delay={index * 80}>
              <div className="relative bg-white border border-navy-100 rounded-[1.25rem] p-7 text-center card-brand h-full">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 shadow-lg flex items-center justify-center bg-gradient-to-br from-navy to-navy-600 shadow-navy/20">
                  <Icon className="w-6 h-6 text-teal-300" />
                </div>
                <h3 className="font-black text-sm mb-1 uppercase tracking-wide text-navy-500">
                  {item.label}
                </h3>
                <p className="font-semibold text-lg leading-snug text-navy-800 capitalize">
                  {item.value}
                </p>
                {item.sub && (
                  <p className="text-sm mt-2 whitespace-pre-line text-navy-500">
                    {item.sub}
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={120}>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-navy-700 font-semibold">
          <Coffee className="w-5 h-5 text-teal-600 shrink-0" aria-hidden />
          Coffee break incluso no encontro.
        </p>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-10 flex justify-center">
          <CtaButton label="GARANTIR MINHA INSCRIÇÃO" size="lg" className="w-full sm:w-auto" />
        </div>
      </Reveal>
    </Section>
  );
}