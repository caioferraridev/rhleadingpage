import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
}

export function BrandLogo({ className, variant = "dark" }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/images/logo.png"
        alt="Academia RH"
        width={1536}
        height={1024}
        priority
        className={cn("h-9 w-auto object-contain", variant === "light" && "brightness-0 invert")}
      />
    </span>
  );
}
