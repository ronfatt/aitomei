import { createClient } from "@supabase/supabase-js";

import { hasSupabaseAdminEnv, supabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  return createClient<Database>(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
