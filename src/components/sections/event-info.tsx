import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Clock, MapPin, CalendarCheck, Users } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import type { Event } from "@/types/database";

export function EventInfo({ event }: { event: Event }) {
  const items = [
    {
      icon: CalendarCheck,
      label: "Data",
      value: formatDate(event.event_date),
      sub: null,
    },
    {
      icon: Clock,
      label: "Horário",
      value: `${formatTime(event.start_time)} às ${formatTime(event.end_time)}`,
      sub: null,
    },
    {
      icon: MapPin,
      label: "Local",
      value: event.location,
      sub: event.address,
    },
  ];

  return (
    <Section id="evento" className="bg-mist">
      <Reveal>
        <SectionTitle
          eyebrow="Quando e onde"
          subtitle="Guarde a data! Este é um encontro presencial, único e exclusivo."
        >
          Data · Horário · Local
        </SectionTitle>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.label} delay={index * 80}>
              <div className="relative bg-white rounded-[1.25rem] border border-navy-100 p-8 text-center card-brand h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-navy-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-navy/20">
                  <Icon className="w-6 h-6 text-teal-300" />
                </div>
                <h3 className="font-black text-navy text-lg mb-1 uppercase tracking-wide text-sm">
                  {item.label}
                </h3>
                <p className="text-navy-800 capitalize font-semibold text-lg leading-snug">
                  {item.value}
                </p>
                {item.sub && (
                  <p className="text-navy-500 text-sm mt-2">{item.sub}</p>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={150}>
        <div className="max-w-5xl mx-auto mt-9 bg-gradient-to-r from-navy to-navy-600 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 justify-center text-white">
          <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-teal-300" />
          </span>
          <p className="font-semibold text-center text-white/95">
            Evento presencial exclusivo · Capacidade limitada a {event.capacity} participantes
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
