"use client";

import { supabase } from "@/lib/supabaseClient";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB — direct-to-storage, no Vercel body limit

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Uploads a file straight from the browser to a public Supabase Storage bucket
 * and returns its public URL. This bypasses Next.js server actions (and the
 * ~4.5 MB Vercel serverless request-body limit), so large magazine PDFs and
 * high-res images upload reliably. Storage RLS still requires an authenticated
 * (admin) session.
 */
export async function uploadToBucket(
  bucket: string,
  folder: string,
  file: File
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds the 25 MB limit.");
  }
  const path = `${folder}/${Date.now()}_${sanitize(file.name)}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
