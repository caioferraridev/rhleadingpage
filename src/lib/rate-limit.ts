import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";

const RATE_LIMIT_TABLE = "api_rate_limits";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

export function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function failOpen(): RateLimitResult {
  console.warn("[rate-limit] check failed, allowing request (fail-open)");
  return { allowed: true, remaining: 1 };
}

/**
 * Rate limit persistido no banco (funciona em serverless/Vercel,
 * independente de instância). O limite é best-effort: sob concorrência
 * extrema o contador pode ultrapassar levemente, nunca bloqueia o tráfego
 * legítimo por erro de armazenamento (fail-open).
 */
export async function enforceRateLimit(opts: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const { key, limit, windowMs } = opts;
  const supabase = getAdminClient();
  const now = Date.now();

  try {
    const { data: row } = await supabase
      .from(RATE_LIMIT_TABLE)
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (!row) {
      const { error } = await supabase.from(RATE_LIMIT_TABLE).upsert(
        {
          key,
          count: 1,
          window_start: new Date(now).toISOString(),
          updated_at: new Date(now).toISOString(),
        },
        { onConflict: "key", ignoreDuplicates: true }
      );
      if (error && /duplicate key/i.test(error.message ?? "")) return failOpen();
      return { allowed: true, remaining: Math.max(0, limit - 1) };
    }

    const windowStart = new Date(row.window_start).getTime();
    const currentCount = Number(row.count ?? 0);

    if (now - windowStart >= windowMs) {
      const { error } = await supabase
        .from(RATE_LIMIT_TABLE)
        .update({
          count: 1,
          window_start: new Date(now).toISOString(),
          updated_at: new Date(now).toISOString(),
        })
        .eq("key", key)
        .eq("window_start", row.window_start);
      if (error) return failOpen();
      return { allowed: true, remaining: Math.max(0, limit - 1) };
    }

    if (currentCount >= limit) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowStart + windowMs - now) / 1000)
      );
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    const { error: incError } = await supabase
      .from(RATE_LIMIT_TABLE)
      .update({
        count: currentCount + 1,
        updated_at: new Date(now).toISOString(),
      })
      .eq("key", key)
      .eq("window_start", row.window_start);
    if (incError) return failOpen();
    return { allowed: true, remaining: Math.max(0, limit - currentCount - 1) };
  } catch (err) {
    console.warn("[rate-limit] unexpected error (fail-open):", err);
    return failOpen();
  }
}

export async function resetRateLimit(key: string): Promise<void> {
  try {
    await getAdminClient().from(RATE_LIMIT_TABLE).delete().eq("key", key);
  } catch {
    // limpeza é best-effort
  }
}