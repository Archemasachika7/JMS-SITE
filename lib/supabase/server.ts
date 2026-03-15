import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. It reads (and optionally writes) auth tokens stored
 * in HTTP-only cookies set by the browser client.
 *
 * Falls back to a plain (unauthenticated) client when Supabase credentials
 * are not configured, so the app can still render without crashing.
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Return a plain client so callers can still call `.auth.getUser()` —
    // it will simply return `{ data: { user: null } }`.
    return createClient(
      url || "https://placeholder.supabase.co",
      anonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
    );
  }

  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
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
          // setAll is called from a Server Component where cookies
          // cannot be set — this is expected and can safely be ignored.
        }
      },
    },
  });
}
