import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProblemsPageContent, { type PublicProblem } from "@/components/ProblemsPageContent";

export const dynamic = "force-dynamic";

export default async function ProblemsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("problems")
    .select("id, title, statement, difficulty, topic, source, problem_date, is_published")
    .eq("is_published", true)
    .order("problem_date", { ascending: false });

  return <ProblemsPageContent problems={(data ?? []) as PublicProblem[]} />;
}
