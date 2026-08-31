"use client";

import { useEventAvailability } from "@/lib/hooks/use-event-availability";
import { formatPrice } from "@/lib/utils";

export function MobileStickyCta() {
  const { data, loading } = useEventAvailability();
  const isSoldOut = data?.is_sold_out ?? false;

  if (loading) return null;

  const scrollToInscription = () => {
    document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      {isSoldOut ? (
        <button
          onClick={scrollToInscription}
          className="w-full bg-slate-900 text-white font-bold text-sm px-4 py-3.5 rounded-lg"
        >
          ENTRAR NA LISTA DE ESPERA
        </button>
      ) : (
        <button
          onClick={scrollToInscription}
          className="w-full bg-amber-500 text-white font-bold text-sm px-4 py-3.5 rounded-lg shadow-lg shadow-amber-500/30"
        >
          Garanta sua vaga — {formatPrice(22990)}
        </button>
      )}
    </div>
  );
}
