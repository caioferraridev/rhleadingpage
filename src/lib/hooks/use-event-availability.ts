"use client";

import { useEffect, useState, useCallback } from "react";
import type { EventAvailability } from "@/types/database";

export function useEventAvailability() {
  const [data, setData] = useState<EventAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
