"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Only ever uses the public URL + publishable
 * key — these are safe to expose and are the only credentials available
 * in client bundles. Used solely for the admin login form's auth calls;
 * all data reads/writes go through server-only code.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
