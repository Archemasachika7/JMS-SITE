"use server";

import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase credentials are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(supabaseUrl, supabaseKey);
}

type SubmissionResult = {
  success: boolean;
  error?: string;
};

/**
 * Returns the currently authenticated user via cookie-based server client,
 * or a SubmissionResult error if not logged in.
 */
async function getAuthenticatedUser(): Promise<
  | { user: { id: string }; error?: never }
  | { user?: never; error: SubmissionResult }
> {
  const supabaseServer = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  if (!user) {
    return {
      error: { success: false, error: "You must be logged in to perform this action." },
    };
  }
  return { user };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_PROOF_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

function validateFile(
  file: File,
  allowedTypes: string[],
  label: string
): string | null {
  if (!allowedTypes.includes(file.type)) {
    return `${label}: unsupported file type (${file.type})`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `${label}: file exceeds 5 MB limit`;
  }
  return null;
}

// ── Donation ────────────────────────────────────────────────────────────────

export async function submitDonation(
  formData: FormData
): Promise<SubmissionResult> {
  try {
    const supabase = getSupabase();

    // ── Retrieve the authenticated user ─────────────────────────────────
    const auth = await getAuthenticatedUser();
    if (auth.error) return auth.error;
    const { user } = auth;

    const fullName = (formData.get("full_name") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const phone = (formData.get("phone") as string) ?? "";
    const amount = parseFloat((formData.get("amount") as string) ?? "0");
    const isAnonymous = formData.get("is_anonymous") === "true";
    const transactionRef = (formData.get("transaction_ref") as string) ?? "";
    const paymentProof = formData.get("payment_proof") as File | null;
    const profilePic = formData.get("profile_pic") as File | null;

    // ── Validation ──────────────────────────────────────────────────────
    if (!email || !transactionRef) {
      return { success: false, error: "Email and Transaction ID are required." };
    }
    if (!isAnonymous && !fullName) {
      return { success: false, error: "Full name is required for non-anonymous donations." };
    }
    if (!/^\d{10}$/.test(phone)) {
      return { success: false, error: "Phone number must be exactly 10 digits." };
    }
    if (!amount || amount <= 0) {
      return { success: false, error: "A valid donation amount is required." };
    }
    if (!paymentProof || paymentProof.size === 0) {
      return { success: false, error: "Payment proof is required." };
    }

    const proofErr = validateFile(paymentProof, ALLOWED_PROOF_TYPES, "Payment proof");
    if (proofErr) return { success: false, error: proofErr };

    // ── Upload payment proof → payment_proofs (PRIVATE) ─────────────────
    const proofPath = `donations/${Date.now()}_${paymentProof.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: proofUploadErr } = await supabase.storage
      .from("payment_proofs")
      .upload(proofPath, paymentProof, { contentType: paymentProof.type });

    if (proofUploadErr) {
      return { success: false, error: `Payment proof upload failed: ${proofUploadErr.message}` };
    }

    // ── Upload profile picture (optional) → profiles (PUBLIC) ───────────
    let profilePicUrl: string | null = null;
    if (profilePic && profilePic.size > 0) {
      const picErr = validateFile(profilePic, ALLOWED_IMAGE_TYPES, "Profile picture");
      if (picErr) return { success: false, error: picErr };

      const picPath = `donators/${Date.now()}_${profilePic.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: picUploadErr } = await supabase.storage
        .from("profiles")
        .upload(picPath, profilePic, { contentType: profilePic.type });

      if (picUploadErr) {
        return { success: false, error: `Profile picture upload failed: ${picUploadErr.message}` };
      }

      const { data: publicUrlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(picPath);
      profilePicUrl = publicUrlData.publicUrl;
    }

    // ── Insert row into donators ────────────────────────────────────────
    const { error: insertErr } = await supabase.from("donators").insert({
      user_id: user.id,
      full_name: isAnonymous ? "Anonymous" : fullName,
      email,
      phone,
      amount,
      is_anonymous: isAnonymous,
      profile_pic_url: profilePicUrl,
      transaction_ref: transactionRef,
      payment_proof_url: proofPath,
    });

    if (insertErr) {
      return { success: false, error: `Submission failed: ${insertErr.message}` };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

// ── Sponsorship ─────────────────────────────────────────────────────────────

const PLAN_AMOUNTS: Record<string, number> = {
  community: 599,
  merchandise: 1499,
  event: 2000,
  major: 7499,
};

export async function submitSponsorship(
  formData: FormData
): Promise<SubmissionResult> {
  try {
    const supabase = getSupabase();

    // ── Retrieve the authenticated user ─────────────────────────────────
    const auth = await getAuthenticatedUser();
    if (auth.error) return auth.error;
    const { user } = auth;

    const organizationName = (formData.get("organization_name") as string) ?? "";
    const contactName = (formData.get("contact_name") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const phone = (formData.get("phone") as string) ?? "";
    const websiteUrl = (formData.get("website_url") as string) || null;
    const planType = (formData.get("plan_type") as string) ?? "";
    const transactionRef = (formData.get("transaction_ref") as string) ?? "";
    const paymentProof = formData.get("payment_proof") as File | null;
    const logoFile = formData.get("logo") as File | null;

    // ── Validation ──────────────────────────────────────────────────────
    if (!organizationName || !contactName || !email || !transactionRef || !planType) {
      return { success: false, error: "All required fields must be filled in." };
    }
    if (!/^\d{10}$/.test(phone)) {
      return { success: false, error: "Phone number must be exactly 10 digits." };
    }
    if (!PLAN_AMOUNTS[planType]) {
      return { success: false, error: "Invalid sponsorship plan selected." };
    }
    if (!paymentProof || paymentProof.size === 0) {
      return { success: false, error: "Payment proof is required." };
    }

    const proofErr = validateFile(paymentProof, ALLOWED_PROOF_TYPES, "Payment proof");
    if (proofErr) return { success: false, error: proofErr };

    // ── Upload payment proof → payment_proofs (PRIVATE) ─────────────────
    const proofPath = `sponsors/${Date.now()}_${paymentProof.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: proofUploadErr } = await supabase.storage
      .from("payment_proofs")
      .upload(proofPath, paymentProof, { contentType: paymentProof.type });

    if (proofUploadErr) {
      return { success: false, error: `Payment proof upload failed: ${proofUploadErr.message}` };
    }

    // ── Upload logo (optional) → logos (PUBLIC) ─────────────────────────
    let logoUrl: string | null = null;
    if (logoFile && logoFile.size > 0) {
      const logoErr = validateFile(logoFile, ALLOWED_IMAGE_TYPES, "Logo");
      if (logoErr) return { success: false, error: logoErr };

      const logoPath = `sponsors/${Date.now()}_${logoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: logoUploadErr } = await supabase.storage
        .from("logos")
        .upload(logoPath, logoFile, { contentType: logoFile.type });

      if (logoUploadErr) {
        return { success: false, error: `Logo upload failed: ${logoUploadErr.message}` };
      }

      const { data: publicUrlData } = supabase.storage
        .from("logos")
        .getPublicUrl(logoPath);
      logoUrl = publicUrlData.publicUrl;
    }

    const amount = PLAN_AMOUNTS[planType];

    // ── Insert row into sponsors ────────────────────────────────────────
    const { error: insertErr } = await supabase.from("sponsors").insert({
      user_id: user.id,
      organization_name: organizationName,
      contact_name: contactName,
      email,
      phone,
      website_url: websiteUrl,
      logo_url: logoUrl,
      plan_type: planType,
      amount,
      transaction_ref: transactionRef,
      payment_proof_url: proofPath,
    });

    if (insertErr) {
      return { success: false, error: `Submission failed: ${insertErr.message}` };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
