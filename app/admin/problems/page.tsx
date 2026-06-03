import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import ProblemsManager, { type ProblemRow } from "@/components/admin/ProblemsManager";

export const dynamic = "force-dynamic";

export default async function AdminProblemsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("problems")
    .select("id, title, statement, difficulty, topic, source, is_published, problem_date")
    .order("problem_date", { ascending: false });

  return (
    <div>
      <AdminHeader
        title="Problems"
        subtitle="Curate the Problem of the Day / Week. LaTeX in statements renders on the public Problems page."
      />
      <ProblemsManager problems={(data ?? []) as ProblemRow[]} />
    </div>
  );
}
