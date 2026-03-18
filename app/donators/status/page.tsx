import { createSupabaseServerClient } from "@/lib/supabase/server";
import StatusPageContent from "@/components/StatusPageContent";
import type { DonationRecord } from "@/app/dashboard/status/page";

export const dynamic = "force-dynamic";

export default async function DonationStatusPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <StatusPageContent user={null} donations={[]} sponsorships={[]} />;
  }

  const [byUserIdRes, legacyByEmailRes] = await Promise.all([
    supabase
      .from("donators")
      .select(
        "id, full_name, email, amount, transaction_ref, status, certificate_issued, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    user.email
      ? supabase
          .from("donators")
          .select(
            "id, full_name, email, amount, transaction_ref, status, certificate_issued, created_at"
          )
          .is("user_id", null)
          .eq("email", user.email)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  const donationMap = new Map<string, DonationRecord>();
  for (const donation of byUserIdRes.data ?? []) {
    donationMap.set(donation.id, donation);
  }
  for (const donation of legacyByEmailRes.data ?? []) {
    donationMap.set(donation.id, donation);
  }

  const donations: DonationRecord[] = Array.from(donationMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <StatusPageContent
      user={{ id: user.id, email: user.email ?? "" }}
      donations={donations}
      sponsorships={[]}
    />
  );
}
