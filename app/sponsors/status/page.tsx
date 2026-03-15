import { createSupabaseServerClient } from "@/lib/supabase/server";
import StatusPageContent from "@/components/StatusPageContent";
import type { SponsorRecord } from "@/app/dashboard/status/page";

export const dynamic = "force-dynamic";

export default async function SponsorshipStatusPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <StatusPageContent user={null} donations={[]} sponsorships={[]} />;
  }

  const { data } = await supabase
    .from("sponsors")
    .select(
      "id, organization_name, contact_name, email, plan_type, amount, transaction_ref, status, certificate_issued, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const sponsorships: SponsorRecord[] = data ?? [];

  return (
    <StatusPageContent
      user={{ id: user.id, email: user.email ?? "" }}
      donations={[]}
      sponsorships={sponsorships}
    />
  );
}
