import { createSupabaseServerClient } from "@/lib/supabase/server";
import DonatorsPageContent, { type Donor } from "@/components/DonatorsPageContent";

export const dynamic = "force-dynamic";

export default async function DonatorsPage() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("donators")
    .select("id, full_name, profile_pic_url, amount, is_anonymous")
    .eq("status", "verified")
    .order("amount", { ascending: false });

  if (error || !data) {
    return <DonatorsPageContent topDonors={[]} allDonors={[]} />;
  }

  const allDonors: Donor[] = data.map((donor) => ({
    id: donor.id,
    name: donor.full_name,
    avatar: donor.profile_pic_url ?? "",
    amount: `₹${Number(donor.amount).toLocaleString("en-IN")}`,
    anonymous: donor.is_anonymous ?? false,
  }));

  return <DonatorsPageContent topDonors={allDonors.slice(0, 5)} allDonors={allDonors} />;
}
