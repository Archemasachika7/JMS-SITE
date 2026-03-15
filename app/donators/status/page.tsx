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

  const { data } = await supabase
    .from("donators")
    .select(
      "id, full_name, email, amount, transaction_ref, status, certificate_issued, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const donations: DonationRecord[] = data ?? [];

  return (
    <StatusPageContent
      user={{ id: user.id, email: user.email ?? "" }}
      donations={donations}
      sponsorships={[]}
    />
  );
}
