"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm",
        hover && "hover:shadow-md hover:border-slate-300 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4",
        className
      )}
    >
      {children}
    </div>
  );
}
