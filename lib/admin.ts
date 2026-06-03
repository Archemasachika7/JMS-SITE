import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

/**
 * Returns the current user IF they are a promoted admin (profiles.role = 'admin'),
 * otherwise null. Admins are promoted manually in the database — there is no UI
 * to grant admin access. Use this in every /admin server component / action to
 * gate access.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") return null;

  return {
    id: user.id,
    email: user.email ?? "",
    name: profile.name ?? null,
    role: profile.role,
  };
}

/** Convenience boolean check. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  return (await getAdminUser()) !== null;
}
