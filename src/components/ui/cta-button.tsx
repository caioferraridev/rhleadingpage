"use client";

import { cn } from "@/lib/utils";
import { openRegistration } from "@/lib/registration-cta";

interface CtaButtonProps {
  label: string;
  className?: string;
  tone?: "brand" | "teal";
  size?: "sm" | "md" | "lg";
}

const sizeClass: Record<NonNullable<CtaButtonProps["size"]>, string> = {
  sm: "text-sm px-5 py-3",
  md: "text-base px-7 py-4",
  lg: "text-lg px-8 py-5",
};

/**
 * CTA de inscrição para as seções de conteúdo.
 * Sempre usa o mesmo fluxo de checkout da seção `#inscricao`.
 */
export function CtaButton({
  label,
  className,
  tone = "brand",
  size = "md",
}: CtaButtonProps) {
  return (
    <button
      type="button"
      onClick={openRegistration}
      className={cn(tone === "teal" ? "btn-teal" : "btn-brand", sizeClass[size], className)}
    >
      {label}
    </button>
  );
}