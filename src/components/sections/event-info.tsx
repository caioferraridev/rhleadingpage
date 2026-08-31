import { Section, SectionTitle } from "@/components/ui/section";
import { Clock, MapPin, CalendarCheck, Users } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import type { Event } from "@/types/database";

export function EventInfo({ event }: { event: Event }) {
  return (
    <Section id="evento" className="bg-slate-50">
      <SectionTitle subtitle="Guarde a data! Este é um encontro presencial, único e exclusivo.">
        Data · Horário · Local
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center hover:shadow-md transition-shadow">
          <CalendarCheck className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 text-lg mb-1">Data</h3>
          <p className="text-slate-600 capitalize">{formatDate(event.event_date)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center hover:shadow-md transition-shadow">
          <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 text-lg mb-1">Horário</h3>
          <p className="text-slate-600">
            {formatTime(event.start_time)} às {formatTime(event.end_time)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center hover:shadow-md transition-shadow">
          <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 text-lg mb-1">Local</h3>
          <p className="text-slate-600">{event.location}</p>
          <p className="text-slate-500 text-sm mt-2">{event.address}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl border border-amber-200 p-6 flex flex-col md:flex-row items-center gap-4 justify-center">
        <Users className="w-5 h-5 text-amber-500" />
        <p className="text-slate-700 font-semibold text-center">
          Evento presencial exclusivo · Capacidade limitada a {event.capacity} participantes
        </p>
      </div>
    </Section>
  );
}
