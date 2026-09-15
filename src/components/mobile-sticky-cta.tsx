"use client";

import { useEventAvailability } from "@/lib/hooks/use-event-availability";
import { formatPrice } from "@/lib/utils";
import { eventConfig } from "@/lib/event-config";

export function MobileStickyCta() {
  const { data, loading } = useEventAvailability();
  const isSoldOut = data?.is_sold_out ?? false;
  const price = data?.event?.price ?? eventConfig.price;

  if (loading) return null;

  const scrollToInscription = () => {
    document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Brand accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-navy via-navy-600 to-teal-500" aria-hidden />
      <div className="bg-white/95 backdrop-blur border-t border-navy-100 p-3 shadow-[0_-6px_24px_-12px_rgba(1,33,74,0.3)]">
        {isSoldOut ? (
          <button
            onClick={scrollToInscription}
            className="w-full btn-teal text-sm py-3.5"
          >
            ENTRAR NA LISTA DE ESPERA
          </button>
        ) : (
          <button onClick={scrollToInscription} className="w-full btn-brand text-sm py-3.5">
            Garanta sua vaga — {formatPrice(price)}
          </button>
        )}
      </div>
    </div>
  );
}
