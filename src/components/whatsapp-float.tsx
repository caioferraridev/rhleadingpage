"use client";

import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { getWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar com a Academia RH pelo WhatsApp (${WHATSAPP_NUMBER})`}
      className={cn(
        "fixed right-4 bottom-[5.5rem] md:bottom-6 z-40 group",
        "flex items-center gap-0 rounded-full",
        "bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)]",
        "transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_36px_-8px_rgba(37,211,102,0.75)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
      )}
    >
      <span
        className={cn(
          "relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366]",
          "after:content-[''] after:absolute after:-inset-1 after:rounded-full",
          "after:animate-ping after:bg-[#25D366]/20 after:pointer-events-none"
        )}
      >
        <WhatsAppIcon className="w-7 h-7" />
      </span>
      <span className="inline-flex max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:pr-4">
        Fale conosco
      </span>
    </a>
  );
}