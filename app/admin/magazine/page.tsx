import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import MediaManager, { type MediaRow } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMagazinePage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("magazines")
    .select("id, title, issue, cover_image, pdf_url")
    .order("published_at", { ascending: false });

  return (
    <div>
      <AdminHeader title="Magazine" subtitle="Publish magazine issues with a cover and PDF." />
      <MediaManager kind="magazines" rows={(data ?? []) as MediaRow[]} />
    </div>
  );
}
