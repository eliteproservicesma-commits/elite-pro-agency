import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

export function getSupabaseClient() {
  if (client) return client;

  const url = (
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
    import.meta.env.VITE_SUPABASE_URL
  )?.trim();
  const key = (
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )?.trim();
  if (!url || !key) throw new Error('Supabase environment variables are not configured.');

  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}
