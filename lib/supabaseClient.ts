import { createClient, SupabaseClient, User } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/**
 * Returns true when both env vars are present and the anon key
 * looks like a real Supabase JWT (starts with "eyJ").
 * This does not validate self-hosted URLs — only the key format.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseAnonKey.startsWith("eyJ")
  )
}

if (process.env.NODE_ENV === "production" && !isSupabaseConfigured()) {
  console.error(
    "[supabase] Missing or invalid Supabase credentials. " +
      "Copy .env.example to .env.local and fill in your project URL and anon key."
  )
}

// Create the client even when credentials are placeholders so the app can
// render and show a helpful configuration warning instead of crashing.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
)

/**
 * Ensures a row exists in the `profiles` table for the given user.
 * Uses upsert so it is safe to call multiple times (idempotent).
 * This acts as a client-side fallback in case the database trigger
 * `on_auth_user_created` was not set up or failed.
 */
export async function ensureProfile(user: User): Promise<void> {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()

    if (fetchError) {
      console.error("[supabase] Failed to check existing profile row.", fetchError)
      return
    }

    if (!existing) {
      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        "New User"

      // Use insert (not upsert) so this mirrors the fallback flow used after login.
      // A duplicate-key conflict means another path (trigger/parallel client) already created it.
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          name,
        })

      if (insertError && insertError.code !== "23505") {
        console.error(
          "[supabase] Failed to insert missing profile row (duplicate-key conflicts are ignored).",
          insertError
        )
      }
    }
  } catch (err) {
    // Non-critical: profile creation failure is logged but does not
    // block the auth flow. The profiles table may not exist yet.
    console.warn(
      "[supabase] Could not ensure profile row exists.",
      err instanceof Error ? err.message : err
    )
  }
}

// Listen for auth state changes (e.g. OAuth redirects) and ensure a
// profile row exists for the signed-in user.
if (typeof window !== "undefined" && isSupabaseConfigured()) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      ensureProfile(session.user)
    }
  })
}
