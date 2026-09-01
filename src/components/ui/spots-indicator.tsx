"use client";

import { Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpotsIndicatorProps {
  spotsLeft: number;
  capacity: number;
  isSoldOut: boolean;
  isLastSpots: boolean;
  loading?: boolean;
  size?: "sm" | "lg";
}

export function SpotsIndicator({
  spotsLeft,
  capacity,
  isSoldOut,
  isLastSpots,
  loading,
  size = "sm",
}: SpotsIndicatorProps) {
  const confirmed = capacity - Math.max(spotsLeft, 0);

  if (isSoldOut) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full font-bold border",
          size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs",
          "bg-red-50 text-red-700 border-red-200"
        )}
      >
        <AlertTriangle className={size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />
        VAGAS ESGOTADAS · {capacity}/{capacity} preenchidas
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-bold border",
        size === "lg" ? "px-4 py-2.5 text-sm" : "px-3 py-1.5 text-xs",
        isLastSpots
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-teal-50 text-teal-700 border-teal-200"
      )}
    >
      <Users className={size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />
      {loading ? (
        <span>Consultando vagas...</span>
      ) : (
        <>
          {isLastSpots ? "ÚLTIMAS VAGAS" : `${spotsLeft} VAGAS DISPONÍVEIS`}
          <span className={cn("font-semibold", isLastSpots ? "text-red-600/70" : "text-teal-600/70")}>
            · {confirmed} de {capacity} preenchidas
          </span>
        </>
      )}
    </div>
  );
}

export function SpotsMeter({
  spotsLeft,
  capacity,
  isSoldOut,
  isLastSpots,
}: {
  spotsLeft: number;
  capacity: number;
  isSoldOut: boolean;
  isLastSpots: boolean;
}) {
  const confirmed = capacity - Math.max(spotsLeft, 0);
  const pct = Math.min((confirmed / capacity) * 100, 100);

  return (
    <div>
      <div className="flex items-end justify-between text-sm mb-2">
        <span className="font-bold text-navy">
          {isSoldOut
            ? `${capacity}/${capacity} vagas preenchidas`
            : `${confirmed} de ${capacity} vagas preenchidas`}
        </span>
        <span className={cn("font-bold", isSoldOut ? "text-red-600" : isLastSpots ? "text-red-500" : "text-teal-600")}>
          {isSoldOut ? "Esgotado" : `Restam ${spotsLeft} vagas`}
        </span>
      </div>
      <div className="h-2.5 bg-navy-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            isSoldOut
              ? "bg-red-500"
              : isLastSpots
              ? "bg-gradient-to-r from-red-500 to-red-400"
              : "bg-gradient-to-r from-navy-500 to-teal-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-navy-500/70 mt-2 font-medium">
        Vagas limitadas a {capacity} participantes.
      </p>
    </div>
  );
}
