import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isConfigured = Boolean(
  supabaseUrl?.includes("http") &&
  !supabaseUrl.includes("your-project-url") &&
  supabaseServiceKey &&
  !supabaseServiceKey.includes("your-service-role")
);

export const supabaseAdmin = isConfigured
  ? createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export function getAdminClient() {
  if (!isConfigured || !supabaseAdmin) {
    throw new Error(
      "Supabase não configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env.local"
    );
  }
  return supabaseAdmin;
}
