import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import MediaManager, { type MediaRow } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminPotwPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("potw")
    .select("id, image_url, title, photographer")
    .order("date", { ascending: false });

  return (
    <div>
      <AdminHeader title="Problem / Photo of the Week" subtitle="Highlight a weekly entry on the public site." />
      <MediaManager kind="potw" rows={(data ?? []) as MediaRow[]} />
    </div>
  );
}
