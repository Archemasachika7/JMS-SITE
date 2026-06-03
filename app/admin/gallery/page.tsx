import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import MediaManager, { type MediaRow } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("gallery")
    .select("id, image_url, caption")
    .order("uploaded_at", { ascending: false });

  return (
    <div>
      <AdminHeader title="Gallery" subtitle="Upload and manage gallery images." />
      <MediaManager kind="gallery" rows={(data ?? []) as MediaRow[]} />
    </div>
  );
}
