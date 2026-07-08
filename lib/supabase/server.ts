import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Server-side Supabase client bound to the current request's auth cookies.
 * Uses the publishable key + the user's session (not the secret key), so
 * every query made through this client is still subject to RLS — this is
 * the client used for admin dashboard reads/writes, giving us RLS as a
 * second layer of defense behind our own server-side role checks.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component with no request context to
            // write cookies to — safe to ignore when middleware also
            // refreshes the session.
          }
        },
      },
    }
  );
}
