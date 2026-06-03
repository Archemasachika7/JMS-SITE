import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import SubscriptionsManager, {
  type MemberRow,
} from "@/components/admin/SubscriptionsManager";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, name, department, year, plan, role, created_at")
    .order("created_at", { ascending: false });

  // The profiles table has no email column; emails live in auth.users which is
  // not exposed via the anon client, so we display name + department instead.
  const members: MemberRow[] = (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    email: null,
    department: m.department,
    year: m.year,
    plan: m.plan ?? "free",
    role: m.role ?? "member",
    created_at: m.created_at,
  }));

  return (
    <div>
      <AdminHeader
        title="Student Subscriptions"
        subtitle="View every registered member and adjust their subscription plan or role. Set role = admin to grant access to this dashboard."
      />
      <SubscriptionsManager members={members} />
    </div>
  );
}
