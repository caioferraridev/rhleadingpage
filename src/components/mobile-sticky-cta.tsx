"use client";

import { useEventAvailability } from "@/lib/hooks/use-event-availability";
import { formatPrice, formatInstallment } from "@/lib/utils";
import { eventConfig } from "@/lib/event-config";
import { openRegistration } from "@/lib/registration-cta";

export function MobileStickyCta() {
  const { data, loading } = useEventAvailability();
  const isSoldOut = data?.is_sold_out ?? false;
  const price = data?.event?.price ?? eventConfig.price;

  const handleClick = () => {
    if (isSoldOut) {
      document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    openRegistration();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Brand accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-navy via-navy-600 to-teal-500" aria-hidden />
      <div className="bg-white/95 backdrop-blur border-t border-navy-100 px-3 py-2.5 shadow-[0_-6px_24px_-12px_rgba(1,33,74,0.3)]">
        {loading ? (
          <div className="h-12" aria-hidden />
        ) : isSoldOut ? (
          <button onClick={handleClick} className="w-full btn-teal text-sm py-3.5">
            ENTRAR NA LISTA DE ESPERA
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="min-w-0 shrink-0 leading-tight">
              <p className="text-[0.6rem] font-bold uppercase tracking-wide text-teal-700">
                {eventConfig.installmentMonths}x de{" "}
                {formatInstallment(price, eventConfig.installmentMonths)}
              </p>
              <p className="text-[0.7rem] text-navy-500">
                Total {formatPrice(price)}
              </p>
            </div>
            <button
              onClick={handleClick}
              className="flex-1 min-w-0 btn-brand text-[0.8rem] px-2.5 py-3.5 leading-tight"
            >
              GARANTIR MINHA INSCRIÇÃO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}