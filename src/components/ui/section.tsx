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

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
  eyebrow?: string;
}

export function SectionTitle({
  children,
  subtitle,
  className,
  align = "center",
  eyebrow,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div className={cn("mb-3", align === "center" ? "flex justify-center" : "")}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600">
            <span className="w-8 h-px bg-teal-400" aria-hidden />
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-black text-navy leading-tight mb-4 tracking-tight">
        {children}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-navy-600/75 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      {align === "center" && <div className="divider-brand mx-auto mt-5" aria-hidden />}
    </div>
  );
}
