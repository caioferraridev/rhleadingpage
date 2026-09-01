import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { eventConfig } from "@/lib/event-config";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-navy-100/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <BrandLogo variant="light" className="mb-4" />
            <p className="text-sm leading-relaxed max-w-xs">
              Palestra presencial de RH e recrutamento para iniciantes. Seu primeiro
              passo para entrar no mundo do RH começa aqui.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Informações do evento
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                {eventConfig.date} · {eventConfig.startTime} às {eventConfig.endTime}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                {eventConfig.location} - {eventConfig.address}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
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

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-navy-200/60">
          <span>© {new Date().getFullYear()} Academia RH. Todos os direitos reservados.</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            Bauru/SP · Evento presencial
          </span>
        </div>
      </div>
    </footer>
  );
}
