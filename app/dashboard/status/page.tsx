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

  const [donationsRes, sponsorshipsRes, legacyDonationsRes, legacySponsorshipsRes] =
    await Promise.all([
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

  const donationMap = new Map<string, DonationRecord>();
  for (const donation of donationsRes.data ?? []) {
    donationMap.set(donation.id, donation);
  }
  for (const donation of legacyDonationsRes.data ?? []) {
    donationMap.set(donation.id, donation);
  }

  const sponsorMap = new Map<string, SponsorRecord>();
  for (const sponsor of sponsorshipsRes.data ?? []) {
    sponsorMap.set(sponsor.id, sponsor);
  }
  for (const sponsor of legacySponsorshipsRes.data ?? []) {
    sponsorMap.set(sponsor.id, sponsor);
  }

  const donations: DonationRecord[] = Array.from(donationMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const sponsorships: SponsorRecord[] = Array.from(sponsorMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <StatusPageContent
      user={{ id: user.id, email: user.email ?? "" }}
      donations={donations}
      sponsorships={sponsorships}
    />
  );
}
