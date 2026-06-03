import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import ReviewList, { type ReviewRow } from "@/components/admin/ReviewList";

export const dynamic = "force-dynamic";

/** Turn a private payment_proofs path into a short-lived signed URL. */
async function signProof(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  path: string | null
): Promise<string | null> {
  if (!path) return null;
  // Some legacy rows stored a full URL — pass those through unchanged.
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage
    .from("payment_proofs")
    .createSignedUrl(path, 60 * 30);
  return data?.signedUrl ?? null;
}

export default async function ReviewPage() {
  const supabase = createSupabaseServerClient();

  const [donRes, spoRes] = await Promise.all([
    supabase
      .from("donators")
      .select(
        "id, full_name, is_anonymous, email, phone, amount, transaction_ref, payment_proof_url, status, created_at"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("sponsors")
      .select(
        "id, organization_name, contact_name, email, phone, amount, plan_type, transaction_ref, payment_proof_url, status, created_at"
      )
      .order("created_at", { ascending: false }),
  ]);

  const donators: ReviewRow[] = await Promise.all(
    (donRes.data ?? []).map(async (d) => ({
      ...d,
      status: d.status ?? "pending",
      proofUrl: await signProof(supabase, d.payment_proof_url),
    }))
  );

  const sponsors: ReviewRow[] = await Promise.all(
    (spoRes.data ?? []).map(async (s) => ({
      ...s,
      status: s.status ?? "pending",
      proofUrl: await signProof(supabase, s.payment_proof_url),
    }))
  );

  return (
    <div>
      <AdminHeader
        title="Donor & Sponsor Review"
        subtitle="Approve or reject applications. Only verified entries appear on the public Donators and Sponsors pages."
      />
      <ReviewList donators={donators} sponsors={sponsors} />
    </div>
  );
}
