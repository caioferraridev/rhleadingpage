"use client";

import { Users, AlertTriangle } from "lucide-react";

interface SpotsIndicatorProps {
  isSoldOut: boolean;
  loading?: boolean;
}

/**
 * Indicador público de disponibilidade.
 * NUNCA exibe quantidade de vagas restantes nem total de inscritos.
 */
export function SpotsIndicator({ isSoldOut, loading }: SpotsIndicatorProps) {
  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold border bg-teal-50 text-teal-700 border-teal-200">
        <Users className="w-3.5 h-3.5" />
        <span>Consultando disponibilidade...</span>
      </div>
    );
  }

  if (isSoldOut) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold border bg-red-50 text-red-700 border-red-200">
        <AlertTriangle className="w-3.5 h-3.5" />
        VAGAS ESGOTADAS
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold border bg-teal-50 text-teal-700 border-teal-200">
      <Users className="w-3.5 h-3.5" />
      VAGAS LIMITADAS
    </div>
  );
}

/**
 * Aviso público de disponibilidade para a seção de inscrição.
 * Sem contadores, sem percentual de ocupação e sem quantidade de inscritos.
 */
export function AvailabilityNotice({ isSoldOut }: { isSoldOut: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2 text-center">
      {isSoldOut ? (
        <span className="inline-flex items-center gap-2 font-bold text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Vagas esgotadas
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 font-bold text-navy">
          <Users className="w-5 h-5 text-teal-600" />
          Vagas limitadas
        </span>
      )}
    </div>
  );
}
