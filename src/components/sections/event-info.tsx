import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Clock, MapPin, CalendarCheck, Coffee, Users } from "lucide-react";
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
    {
      icon: Coffee,
      label: "Coffee Break",
      value: "Incluso no evento",
      sub: "Momento para networking e troca de experiências entre os participantes.",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isCoffee = item.label === "Coffee Break";
          return (
            <Reveal key={item.label} delay={index * 80}>
              <div
                className={`relative ${
                  isCoffee
                    ? "bg-gradient-to-br from-navy to-navy-600 text-white border-navy"
                    : "bg-white border-navy-100"
                } rounded-[1.25rem] border p-8 text-center card-brand h-full`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl mx-auto mb-5 shadow-lg flex items-center justify-center ${
                    isCoffee
                      ? "bg-white/10 shadow-navy/20"
                      : "bg-gradient-to-br from-navy to-navy-600 shadow-navy/20"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isCoffee ? "text-teal-300" : "text-teal-300"}`} />
                </div>
                <h3 className="font-black text-lg mb-1 uppercase tracking-wide text-sm opacity-90">
                  {item.label}
                </h3>
                <p
                  className={`font-semibold text-lg leading-snug ${
                    isCoffee ? "text-white" : "text-navy-800 capitalize"
                  }`}
                >
                  {item.value}
                </p>
                {item.sub && (
                  <p
                    className={`text-sm mt-2 whitespace-pre-line ${
                      isCoffee ? "text-navy-100/80" : "text-navy-500"
                    }`}
                  >
                    {item.sub}
                  </p>
                )}
                {isCoffee && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-bold text-teal-200">
                    <Coffee className="w-3.5 h-3.5" />
                    Destaque do evento
                  </div>
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
            Treinamento de Recrutamento e Seleção em Bauru · Evento presencial exclusivo · Vagas limitadas
          </p>
        </div>
      </Reveal>
    </Section>
  );
}