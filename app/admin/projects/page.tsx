import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import ProjectsManager, { type ProjectRow } from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("projects")
    .select("id, title, description, author, thumbnail_url, pdf_url, video_url, link_url")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminHeader
        title="Projects"
        subtitle="Showcase member projects with a photo, PDF, video and/or external link."
      />
      <ProjectsManager projects={(data ?? []) as ProjectRow[]} />
    </div>
  );
}
