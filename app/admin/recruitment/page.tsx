import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import RecruitmentManager, {
  type RecruitmentRow,
} from "@/components/admin/RecruitmentManager";

export const dynamic = "force-dynamic";

export default async function AdminRecruitmentPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("recruitments")
    .select("id, title, session_label, subtitle, deadline, form_action, is_open, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminHeader
        title="Recruitment"
        subtitle="Start new recruitment drives with deadlines. The homepage banner and the public recruitment page update automatically from the latest open drive."
      />
      <RecruitmentManager recruitments={(data ?? []) as RecruitmentRow[]} />
    </div>
  );
}
