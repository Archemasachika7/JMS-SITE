import { createSupabaseServerClient } from "@/lib/supabase/server";
import SponsorsPageContent, { type VerifiedSponsor } from "@/components/SponsorsPageContent";

export const dynamic = "force-dynamic";

export default async function SponsorsPage() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("sponsors")
    .select("organization_name, logo_url, website_url")
    .eq("status", "verified")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return <SponsorsPageContent verifiedSponsors={[]} />;
  }

  const verifiedSponsors: VerifiedSponsor[] = data.map((sponsor) => ({
    name: sponsor.organization_name,
    logo: sponsor.logo_url ?? "",
    website: sponsor.website_url ?? "",
  }));

  return <SponsorsPageContent verifiedSponsors={verifiedSponsors} />;
}
