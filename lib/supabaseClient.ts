import { createClient, SupabaseClient } from "@supabase/supabase-js"

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
