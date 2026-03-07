import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/**
 * Returns true when both env vars are present and the anon key
 * looks like a real Supabase JWT (starts with "eyJ").
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl.includes(".supabase.co") &&
      supabaseAnonKey.startsWith("eyJ")
  )
}

// Create the client even when credentials are placeholders so the app can
// render and show a helpful configuration warning instead of crashing.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
)
