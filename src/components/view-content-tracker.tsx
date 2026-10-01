"use client";

import { useEffect } from "react";
import { fireViewContent } from "@/lib/meta-pixel-client";

/**
 * Dispara ViewContent uma única vez quando a landing page é montada.
 * Usa o mesmo Meta Pixel já instalado em `layout.tsx` — nenhuma
 * biblioteca ou segunda implementação de tracking foi adicionada.
 */
export function ViewContentTracker({
  valueBRL,
  contentId,
}: {
  valueBRL: number;
  contentId: string;
}) {
  useEffect(() => {
    fireViewContent({ valueBRL, contentIds: [contentId] });
  }, [valueBRL, contentId]);

  return null;
}