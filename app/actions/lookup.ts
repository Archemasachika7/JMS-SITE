"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LookupRow = {
  kind: "donation" | "sponsorship";
  name: string;
  amount: number;
  status: string;
  certificate_issued: boolean;
  certificate_url: string | null;
  transaction_ref: string;
  access_token: string;
  created_at: string;
};

export type LookupResult =
  | { success: true; rows: LookupRow[] }
  | { success: false; error: string };

/**
 * Public, no-login lookup of a donor / sponsor's own submissions by their
 * access token OR email. Backed by the SECURITY DEFINER `lookup_submissions`
 * SQL function, which only ever returns rows matching the exact value given.
 */
export async function lookupSubmissions(query: string): Promise<LookupResult> {
  const q = query.trim();
  if (!q) return { success: false, error: "Enter your access token or email." };

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.rpc("lookup_submissions", {
      p_query: q,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, rows: (data ?? []) as LookupRow[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lookup failed.",
    };
  }
}
