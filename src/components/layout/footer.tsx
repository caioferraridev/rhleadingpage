import Link from "next/link";
import { MapPin, Clock, Coffee } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { eventConfig } from "@/lib/event-config";
import { getWhatsAppLink, getWhatsAppDisplayNumber } from "@/lib/whatsapp";
import { formatDateShort, formatTime } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-navy-100/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <BrandLogo variant="light" className="mb-4" />
            <p className="text-sm leading-relaxed max-w-xs">
              Um espaço de desenvolvimento e capacitação que transforma conhecimento
              em prática — nesta 1ª edição, dedicada a Recrutamento e Seleção.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Informações do evento
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                {formatDateShort(eventConfig.date)} · {formatTime(eventConfig.startTime)} às{" "}
                {formatTime(eventConfig.endTime)}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  {eventConfig.location}
                  <br />
                  {eventConfig.address.split("\n").join(", ")}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Coffee className="w-4 h-4 text-teal-400 shrink-0" />
                Coffee Break incluso
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

            <h4 className="text-white font-semibold mt-8 mb-4 text-sm uppercase tracking-wider">
              Atendimento
            </h4>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-teal-200 transition-colors"
              aria-label={`Falar com a Academia RH pelo WhatsApp (${getWhatsAppDisplayNumber()})`}
            >
              <WhatsAppIcon className="w-4 h-4" />
              {getWhatsAppDisplayNumber()}
            </a>
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