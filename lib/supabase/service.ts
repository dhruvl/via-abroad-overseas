import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Secret-key Supabase client. Bypasses Row Level Security entirely, so
 * it must NEVER be imported into a Client Component and must never leak
 * into a response. It exists only for:
 *   - inserting public form submissions (contact / consultation) after
 *     the Route Handler has already validated + rate-limited + verified
 *     the bot challenge, and
 *   - server-side admin operations that legitimately need to read/write
 *     beyond a single admin's RLS-scoped session (e.g. CSV export).
 *
 * The `import "server-only"` guard above makes any accidental client
 * import a build-time error.
 */
let cachedClient: SupabaseClient | null = null;

export function getServiceSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase service credentials are not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY)."
    );
  }

  cachedClient = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cachedClient;
}
