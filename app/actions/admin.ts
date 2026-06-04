"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/admin";
import { coerceSchema } from "@/lib/recruitmentSchema";

type Result = { success: boolean; error?: string };

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const PDF_TYPES = ["application/pdf"];

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Uploads a file to a public storage bucket and returns its public URL.
 * Returns null when no file was provided. Throws on validation / upload error.
 */
async function uploadPublic(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  bucket: string,
  folder: string,
  file: File | null,
  allowed: string[]
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!allowed.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds 10 MB limit");
  }
  const path = `${folder}/${Date.now()}_${sanitize(file.name)}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Guard helper — returns the supabase client + admin, or throws. */
async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error("Not authorized. Admin access required.");
  }
  return { supabase: createSupabaseServerClient(), admin };
}

function ok(): Result {
  return { success: true };
}

function fail(err: unknown): Result {
  return {
    success: false,
    error: err instanceof Error ? err.message : "Unknown error",
  };
}

// ── PROBLEMS ────────────────────────────────────────────────────────────────

export async function saveProblem(formData: FormData): Promise<Result> {
  try {
    const { supabase, admin } = await requireAdmin();
    const id = (formData.get("id") as string) || null;

    const row = {
      title: (formData.get("title") as string)?.trim(),
      statement: (formData.get("statement") as string) ?? null,
      solution: (formData.get("solution") as string) ?? null,
      difficulty: (formData.get("difficulty") as string) || "medium",
      topic: (formData.get("topic") as string) || null,
      source: (formData.get("source") as string) || null,
      is_published: formData.get("is_published") === "on",
      problem_date:
        (formData.get("problem_date") as string) ||
        new Date().toISOString().slice(0, 10),
    };

    if (!row.title) return { success: false, error: "Title is required." };

    if (id) {
      const { error } = await supabase.from("problems").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("problems")
        .insert({ ...row, created_by: admin.id });
      if (error) throw error;
    }
    revalidatePath("/admin/problems");
    revalidatePath("/problems");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

// ── EVENTS ──────────────────────────────────────────────────────────────────

export async function saveEvent(formData: FormData): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    const id = (formData.get("id") as string) || null;
    const poster = await uploadPublic(
      supabase,
      "events",
      "events",
      formData.get("poster") as File | null,
      IMAGE_TYPES
    );

    const row: Record<string, unknown> = {
      title: (formData.get("title") as string)?.trim(),
      description: (formData.get("description") as string) ?? null,
      location: (formData.get("location") as string) ?? null,
      event_date: (formData.get("event_date") as string) || null,
    };
    if (poster) row.poster_url = poster;
    if (!row.title) return { success: false, error: "Title is required." };

    if (id) {
      const { error } = await supabase.from("club_events").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("club_events").insert(row);
      if (error) throw error;
    }
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

// ── GALLERY ─────────────────────────────────────────────────────────────────

export async function addGalleryImage(formData: FormData): Promise<Result> {
  try {
    const { supabase, admin } = await requireAdmin();
    const url = await uploadPublic(
      supabase,
      "gallery",
      "gallery",
      formData.get("image") as File | null,
      IMAGE_TYPES
    );
    if (!url) return { success: false, error: "An image file is required." };

    const { error } = await supabase.from("gallery").insert({
      image_url: url,
      caption: (formData.get("caption") as string) ?? null,
      uploaded_by: admin.id,
    });
    if (error) throw error;
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

// ── POTW ────────────────────────────────────────────────────────────────────

export async function addPotw(formData: FormData): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    const url = await uploadPublic(
      supabase,
      "potw",
      "potw",
      formData.get("image") as File | null,
      IMAGE_TYPES
    );
    if (!url) return { success: false, error: "An image file is required." };

    const { error } = await supabase.from("potw").insert({
      image_url: url,
      title: (formData.get("title") as string) ?? null,
      photographer: (formData.get("photographer") as string) ?? null,
    });
    if (error) throw error;
    revalidatePath("/admin/potw");
    revalidatePath("/potw");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

// ── MAGAZINE ────────────────────────────────────────────────────────────────

export async function addMagazine(formData: FormData): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    const cover = await uploadPublic(
      supabase,
      "magazines",
      "covers",
      formData.get("cover") as File | null,
      IMAGE_TYPES
    );
    const pdf = await uploadPublic(
      supabase,
      "magazines",
      "pdfs",
      formData.get("pdf") as File | null,
      PDF_TYPES
    );

    const { error } = await supabase.from("magazines").insert({
      title: (formData.get("title") as string)?.trim() || null,
      issue: (formData.get("issue") as string) || null,
      cover_image: cover,
      pdf_url: pdf,
    });
    if (error) throw error;
    revalidatePath("/admin/magazine");
    revalidatePath("/magazine");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

// ── METADATA-ONLY CREATE (files uploaded client-side, only URLs sent) ────────
// These avoid posting file bytes through the server action (and Vercel's
// ~4.5 MB request-body limit). The browser uploads to Supabase Storage first,
// then calls these with the resulting public URLs.

export async function createGalleryRow(input: {
  imageUrl: string;
  caption: string | null;
}): Promise<Result> {
  try {
    const { supabase, admin } = await requireAdmin();
    if (!input.imageUrl) return { success: false, error: "Image is required." };
    const { error } = await supabase.from("gallery").insert({
      image_url: input.imageUrl,
      caption: input.caption,
      uploaded_by: admin.id,
    });
    if (error) throw error;
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function createPotwRow(input: {
  imageUrl: string;
  title: string | null;
  photographer: string | null;
}): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    if (!input.imageUrl) return { success: false, error: "Image is required." };
    const { error } = await supabase.from("potw").insert({
      image_url: input.imageUrl,
      title: input.title,
      photographer: input.photographer,
    });
    if (error) throw error;
    revalidatePath("/admin/potw");
    revalidatePath("/potw");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function createMagazineRow(input: {
  title: string | null;
  issue: string | null;
  coverImage: string | null;
  pdfUrl: string | null;
}): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("magazines").insert({
      title: input.title,
      issue: input.issue,
      cover_image: input.coverImage,
      pdf_url: input.pdfUrl,
    });
    if (error) throw error;
    revalidatePath("/admin/magazine");
    revalidatePath("/magazine");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function createEventRow(input: {
  title: string;
  description: string | null;
  location: string | null;
  eventDate: string | null;
  posterUrl: string | null;
}): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    if (!input.title) return { success: false, error: "Title is required." };
    const row: Record<string, unknown> = {
      title: input.title,
      description: input.description,
      location: input.location,
      event_date: input.eventDate || null,
    };
    if (input.posterUrl) row.poster_url = input.posterUrl;
    const { error } = await supabase.from("club_events").insert(row);
    if (error) throw error;
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return ok();
  } catch (err) {
    return fail(err);
  }
}

// ── GENERIC DELETE ──────────────────────────────────────────────────────────

const DELETABLE = new Set([
  "problems",
  "club_events",
  "gallery",
  "potw",
  "magazines",
  "recruitments",
]);

export async function deleteRow(table: string, id: string): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    if (!DELETABLE.has(table)) {
      return { success: false, error: "Table not deletable." };
    }
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
    revalidatePath(`/admin/${table}`);
    return ok();
  } catch (err) {
    return fail(err);
  }
}

// ── REVIEW QUEUE (donators / sponsors) ───────────────────────────────────────

export async function moderateSubmission(
  table: "donators" | "sponsors",
  id: string,
  status: "verified" | "rejected" | "pending"
): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    if (table !== "donators" && table !== "sponsors") {
      return { success: false, error: "Invalid table." };
    }
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/review");
    revalidatePath(`/${table}`);
    return ok();
  } catch (err) {
    return fail(err);
  }
}

// ── STUDENT SUBSCRIPTIONS (profiles) ─────────────────────────────────────────

const ALLOWED_PLANS = new Set(["free", "monthly", "annual"]);
const ALLOWED_ROLES = new Set(["member", "core", "admin"]);

export async function updateMemberStatus(
  id: string,
  plan: string,
  role: string
): Promise<Result> {
  try {
    const { supabase } = await requireAdmin();
    if (!ALLOWED_PLANS.has(plan) || !ALLOWED_ROLES.has(role)) {
      return { success: false, error: "Invalid plan or role." };
    }
    const { error } = await supabase
      .from("profiles")
      .update({ plan, role })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/subscriptions");
    return ok();
  } catch (err) {
    return fail(err);
  }
}
