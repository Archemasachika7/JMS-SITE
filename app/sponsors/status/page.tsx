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

  const [byUserIdRes, legacyByEmailRes] = await Promise.all([
    supabase
      .from("sponsors")
      .select(
        "id, organization_name, contact_name, email, plan_type, amount, transaction_ref, status, certificate_issued, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    user.email
      ? supabase
          .from("sponsors")
          .select(
            "id, organization_name, contact_name, email, plan_type, amount, transaction_ref, status, certificate_issued, created_at"
          )
          .is("user_id", null)
          .eq("email", user.email)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  const sponsorshipMap = new Map<string, SponsorRecord>();
  for (const sponsorship of byUserIdRes.data ?? []) {
    sponsorshipMap.set(sponsorship.id, sponsorship);
  }
  for (const sponsorship of legacyByEmailRes.data ?? []) {
    sponsorshipMap.set(sponsorship.id, sponsorship);
  }

  const sponsorships: SponsorRecord[] = Array.from(sponsorshipMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <StatusPageContent
      user={{ id: user.id, email: user.email ?? "" }}
      donations={[]}
      sponsorships={sponsorships}
    />
  );
}
