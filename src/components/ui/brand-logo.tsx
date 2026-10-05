import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  /** Acima da dobra (header). Fora da dobra (rodapé), fica lazy. */
  eager?: boolean;
}

/**
 * Logo exibida com `h-9` (36px) de altura e largura automática. A proporção é
 * 3:2, então ~54px de largura renderizada.
 *
 * Antes o componente usava srcset 640/1080 sem `sizes`, então o browser
 * baixava o arquivo de 1080px (34KB) para um slot de 36px. O `sizes` abaixo
 * faz o srcset correto ser escolhido.
 *
 * Não usamos `preload`: com ~54px a logo nunca é candidata a LCP, e preload
 * competiria banda com a foto do hero, que é. No header ela apenas carrega
 * eager (é o que `priority` fazia antes, agora com a API do Next 16).
 */
export function BrandLogo({ className, variant = "dark", eager = false }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/images/logo.webp"
        alt="Academia RH"
        width={54}
        height={36}
        sizes="54px"
        className={cn("h-9 w-auto object-contain", variant === "light" && "brightness-0 invert")}
        loading={eager ? "eager" : "lazy"}
      />
    </span>
  );
}