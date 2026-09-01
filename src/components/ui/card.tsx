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
        "bg-white rounded-[1.25rem] border border-navy-100 p-6 md:p-8",
        hover && "card-brand",
        !hover && "shadow-[0_10px_30px_-18px_rgba(1,33,74,0.2)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardIcon({
  children,
  className,
  tone = "teal",
}: {
  children: ReactNode;
  className?: string;
  tone?: "teal" | "navy";
}) {
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 border",
        tone === "teal"
          ? "bg-teal-50 border-teal-100 text-teal-600"
          : "bg-navy-50 border-navy-100 text-navy",
        className
      )}
    >
      {children}
    </div>
  );
}
