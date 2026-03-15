import { createSupabaseServerClient } from "@/lib/supabase/server";
import StatusPageContent from "@/components/StatusPageContent";

export const dynamic = "force-dynamic";

export interface DonationRecord {
  id: string;
  full_name: string;
  email: string;
  amount: number;
  transaction_ref: string;
  status: string;
  certificate_issued: boolean;
  created_at: string;
}

export interface SponsorRecord {
  id: string;
  organization_name: string;
  contact_name: string;
  email: string;
  plan_type: string;
  amount: number;
  transaction_ref: string;
  status: string;
  certificate_issued: boolean;
  created_at: string;
}

export default async function StatusPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <StatusPageContent user={null} donations={[]} sponsorships={[]} />;
  }

  const [donationsRes, sponsorshipsRes] = await Promise.all([
    supabase
      .from("donators")
      .select(
        "id, full_name, email, amount, transaction_ref, status, certificate_issued, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("sponsors")
      .select(
        "id, organization_name, contact_name, email, plan_type, amount, transaction_ref, status, certificate_issued, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const donations: DonationRecord[] = donationsRes.data ?? [];
  const sponsorships: SponsorRecord[] = sponsorshipsRes.data ?? [];

  return (
    <StatusPageContent
      user={{ id: user.id, email: user.email ?? "" }}
      donations={donations}
      sponsorships={sponsorships}
    />
  );
}
