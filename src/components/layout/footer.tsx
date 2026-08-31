import Link from "next/link";
import { GraduationCap, MapPin, Clock } from "lucide-react";
import { eventConfig } from "@/lib/event-config";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xl font-bold text-white">
                Academia <span className="text-amber-500">RH</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Palestra presencial de RH e recrutamento para iniciantes. Comece sua
              trajetória na área com quem entende do assunto.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Informações do evento</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                {eventConfig.date} · {eventConfig.startTime} às {eventConfig.endTime}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                {eventConfig.location} - {eventConfig.address}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Links rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#o-que-e" className="hover:text-white transition-colors">
                  O que é a Academia RH
                </Link>
              </li>
              <li>
                <Link href="#palestrante" className="hover:text-white transition-colors">
                  Palestrante
                </Link>
              </li>
              <li>
                <Link href="#inscricao" className="hover:text-white transition-colors">
                  Garantir minha vaga
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <span>© {new Date().getFullYear()} Academia RH. Todos os direitos reservados.</span>
          <span>Bauru/SP · Evento presencial</span>
        </div>
      </div>
    </footer>
  );
}
