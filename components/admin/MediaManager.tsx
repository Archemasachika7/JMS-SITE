"use client";

import { useState } from "react";
import {
  ActionButton,
  Card,
  Field,
  inputCls,
  SubmitButton,
} from "@/components/admin/AdminUI";
import {
  createGalleryRow,
  createPotwRow,
  createMagazineRow,
  updateGalleryRow,
  updatePotwRow,
  updateMagazineRow,
  deleteRow,
} from "@/app/actions/admin";
import { uploadToBucket } from "@/lib/clientUpload";

export type MediaRow = {
  id: string;
  image_url?: string | null;
  cover_image?: string | null;
  caption?: string | null;
  title?: string | null;
  photographer?: string | null;
  issue?: string | null;
  pdf_url?: string | null;
};

type Kind = "gallery" | "potw" | "magazines";

const HEADINGS: Record<Kind, { heading: string; submit: string }> = {
  gallery: { heading: "Upload an image", submit: "Upload image" },
  potw: { heading: "Add Problem/Photo of the Week", submit: "Add POTW" },
  magazines: { heading: "Add magazine issue", submit: "Add issue" },
};

function CreateForm({ kind }: { kind: Kind }) {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setPending(true);
    setMsg(null);
    try {
      if (kind === "gallery") {
        const file = fd.get("image") as File | null;
        if (!file || file.size === 0) throw new Error("An image is required.");
        const imageUrl = await uploadToBucket("gallery", "gallery", file);
        const res = await createGalleryRow({
          imageUrl,
          caption: (fd.get("caption") as string) || null,
        });
        if (!res.success) throw new Error(res.error);
      } else if (kind === "potw") {
        const file = fd.get("image") as File | null;
        if (!file || file.size === 0) throw new Error("An image is required.");
        const imageUrl = await uploadToBucket("potw", "potw", file);
        const res = await createPotwRow({
          imageUrl,
          title: (fd.get("title") as string) || null,
          photographer: (fd.get("photographer") as string) || null,
        });
        if (!res.success) throw new Error(res.error);
      } else {
        const cover = fd.get("cover") as File | null;
        const pdf = fd.get("pdf") as File | null;
        let coverImage: string | null = null;
        let pdfUrl: string | null = null;
        if (cover && cover.size > 0) {
          try {
            coverImage = await uploadToBucket("magazines", "covers", cover);
          } catch (e) {
            throw new Error(
              `Cover upload failed (${(cover.size / 1048576).toFixed(1)} MB): ${
                e instanceof Error ? e.message : e
              }`
            );
          }
        }
        if (pdf && pdf.size > 0) {
          try {
            pdfUrl = await uploadToBucket("magazines", "pdfs", pdf);
          } catch (e) {
            throw new Error(
              `PDF upload failed (${(pdf.size / 1048576).toFixed(1)} MB): ${
                e instanceof Error ? e.message : e
              }`
            );
          }
        }
        const res = await createMagazineRow({
          title: (fd.get("title") as string)?.trim() || null,
          issue: (fd.get("issue") as string) || null,
          coverImage,
          pdfUrl,
        });
        if (!res.success) throw new Error(`Saving record failed: ${res.error}`);
      }
      setMsg({ ok: true, text: "Saved successfully." });
      form.reset();
    } catch (err) {
      // Surface the full error so it can be read and diagnosed.
      console.error("[admin media save] failed:", err);
      const text =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : JSON.stringify(err);
      setMsg({ ok: false, text });
    } finally {
      setPending(false);
    }
  }

  const c = HEADINGS[kind];
  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        {c.heading}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {kind === "gallery" && (
          <>
            <Field label="Image">
              <input type="file" name="image" accept="image/*" required className={inputCls} />
            </Field>
            <Field label="Caption">
              <input name="caption" className={inputCls} placeholder="Fractal art night" />
            </Field>
          </>
        )}
        {kind === "potw" && (
          <>
            <Field label="Image">
              <input type="file" name="image" accept="image/*" required className={inputCls} />
            </Field>
            <Field label="Title">
              <input name="title" className={inputCls} placeholder="Week 12 — The Mandelbrot set" />
            </Field>
            <Field label="Credit">
              <input name="photographer" className={inputCls} placeholder="Submitted by …" />
            </Field>
          </>
        )}
        {kind === "magazines" && (
          <>
            <Field label="Title">
              <input name="title" className={inputCls} placeholder="Aleph — Issue 4" />
            </Field>
            <Field label="Issue label">
              <input name="issue" className={inputCls} placeholder="Vol. 1, No. 4" />
            </Field>
            <Field label="Cover image">
              <input type="file" name="cover" accept="image/*" className={inputCls} />
            </Field>
            <Field label="PDF">
              <input type="file" name="pdf" accept="application/pdf" className={inputCls} />
            </Field>
          </>
        )}
        <div className="flex items-center gap-3">
          <SubmitButton pending={pending}>{c.submit}</SubmitButton>
          {pending && <span className="text-xs text-gray-400">Uploading…</span>}
          {msg?.ok && <span className="text-sm text-emerald-400">{msg.text}</span>}
        </div>
        {msg && !msg.ok && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            <p className="mb-1 font-semibold text-red-300">Upload failed</p>
            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
            <p className="mt-2 text-xs text-red-300/70">
              Full details are also in the browser console (F12 → Console).
            </p>
          </div>
        )}
      </form>
    </Card>
  );
}

/** Inline edit form for an existing media row. */
function EditForm({ kind, row }: { kind: Kind; row: MediaRow }) {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setMsg(null);
    try {
      if (kind === "gallery") {
        const file = fd.get("image") as File | null;
        const imageUrl =
          file && file.size > 0
            ? await uploadToBucket("gallery", "gallery", file)
            : undefined;
        const res = await updateGalleryRow({
          id: row.id,
          caption: (fd.get("caption") as string) || null,
          imageUrl,
        });
        if (!res.success) throw new Error(res.error);
      } else if (kind === "potw") {
        const file = fd.get("image") as File | null;
        const imageUrl =
          file && file.size > 0
            ? await uploadToBucket("potw", "potw", file)
            : undefined;
        const res = await updatePotwRow({
          id: row.id,
          title: (fd.get("title") as string) || null,
          photographer: (fd.get("photographer") as string) || null,
          imageUrl,
        });
        if (!res.success) throw new Error(res.error);
      } else {
        const cover = fd.get("cover") as File | null;
        const pdf = fd.get("pdf") as File | null;
        const coverImage =
          cover && cover.size > 0
            ? await uploadToBucket("magazines", "covers", cover)
            : undefined;
        const pdfUrl =
          pdf && pdf.size > 0
            ? await uploadToBucket("magazines", "pdfs", pdf)
            : undefined;
        const res = await updateMagazineRow({
          id: row.id,
          title: (fd.get("title") as string)?.trim() || null,
          issue: (fd.get("issue") as string) || null,
          coverImage,
          pdfUrl,
        });
        if (!res.success) throw new Error(res.error);
      }
      setMsg({ ok: true, text: "Saved." });
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Update failed.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 border-t border-white/5 pt-3">
      {kind === "gallery" && (
        <>
          <Field label="Caption">
            <input name="caption" defaultValue={row.caption ?? ""} className={inputCls} />
          </Field>
          <Field label="Replace image (optional)">
            <input type="file" name="image" accept="image/*" className={inputCls} />
          </Field>
        </>
      )}
      {kind === "potw" && (
        <>
          <Field label="Title">
            <input name="title" defaultValue={row.title ?? ""} className={inputCls} />
          </Field>
          <Field label="Credit">
            <input name="photographer" defaultValue={row.photographer ?? ""} className={inputCls} />
          </Field>
          <Field label="Replace image (optional)">
            <input type="file" name="image" accept="image/*" className={inputCls} />
          </Field>
        </>
      )}
      {kind === "magazines" && (
        <>
          <Field label="Title">
            <input name="title" defaultValue={row.title ?? ""} className={inputCls} />
          </Field>
          <Field label="Issue label">
            <input name="issue" defaultValue={row.issue ?? ""} className={inputCls} />
          </Field>
          <Field label="Replace cover (optional)">
            <input type="file" name="cover" accept="image/*" className={inputCls} />
          </Field>
          <Field label="Replace PDF (optional)">
            <input type="file" name="pdf" accept="application/pdf" className={inputCls} />
          </Field>
        </>
      )}
      <div className="flex items-center gap-3">
        <SubmitButton pending={pending}>Save changes</SubmitButton>
        {pending && <span className="text-xs text-gray-400">Uploading…</span>}
        {msg && (
          <span className={`text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`}>
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}

export default function MediaManager({
  kind,
  rows,
}: {
  kind: Kind;
  rows: MediaRow[];
}) {
  const isGrid = kind !== "magazines";
  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <CreateForm kind={kind} />
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Existing ({rows.length})
        </h2>
        {rows.length === 0 && <p className="text-sm text-gray-500">Nothing yet.</p>}
        <div className={isGrid ? "grid grid-cols-2 gap-3 sm:grid-cols-3" : "space-y-3"}>
          {rows.map((r) => {
            const img = r.image_url || r.cover_image;
            return (
              <Card key={r.id} className="relative overflow-hidden p-3">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="mb-2 aspect-square w-full rounded-lg object-cover" />
                )}
                <p className="truncate text-xs font-medium text-white">
                  {r.title || r.caption || r.issue || "Untitled"}
                </p>
                {r.photographer && (
                  <p className="truncate text-[11px] text-gray-500">{r.photographer}</p>
                )}
                {r.pdf_url && (
                  <a
                    href={r.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#f43f5e] hover:underline"
                  >
                    View PDF ↗
                  </a>
                )}
                <div className="mt-2">
                  <ActionButton
                    label="Delete"
                    variant="danger"
                    confirm="Delete this item?"
                    onAction={() => deleteRow(kind, r.id)}
                  />
                </div>
                <details className="group mt-2">
                  <summary className="cursor-pointer text-[11px] text-[#f43f5e] hover:underline">
                    Edit
                  </summary>
                  <EditForm kind={kind} row={r} />
                </details>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
