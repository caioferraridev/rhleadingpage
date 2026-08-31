"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

export function SectionTitle({
  children,
  subtitle,
  className,
}: {
  children: ReactNode;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center mb-12 md:mb-16", className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
        {children}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
