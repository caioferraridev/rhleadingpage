"use client";

import { useEffect, useState, useCallback } from "react";
import type { EventAvailability } from "@/types/database";

/**
 * Disponibilidade do evento.
 *
 * `initialData` recebe o que a página já buscou no servidor. Isso existe para
 * que o primeiro paint (HTML) já mostre o estado real — antes, o componente
 * renderizava um skeleton e só trocava pelo conteúdo depois da hidratação e do
 * fetch no cliente, o que atrasava o LCP em segundos.
 *
 * A revalidação no cliente continua rodando: se as vagas acabarem enquanto a
 * aba estiver aberta, `data` é atualizado normalmente.
 *
 * Nada aqui inventa dado. Se `initialData` não vier, o estado segue `loading`
 * e o chamador decide o que exibir — nunca uma contagem ou condição comercial
 * presumida.
 */
export function useEventAvailability(initialData?: EventAvailability | null) {
  const hasInitial = initialData != null;
  const [data, setData] = useState<EventAvailability | null>(initialData ?? null);
  const [loading, setLoading] = useState(!hasInitial);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Só mostra "carregando" quando ainda não existe dado nenhum. Depois que
      // há dado do servidor, a revalidação acontece em segundo plano para não
      // trocar o CTA por um skeleton e gerar salto de layout.
      setLoading((current) => current && data === null);
      setError(null);
      const res = await fetch("/api/availability", {
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao consultar vagas.");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao consultar vagas.");
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}