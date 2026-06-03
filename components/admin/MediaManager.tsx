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
        const coverImage =
          cover && cover.size > 0
            ? await uploadToBucket("magazines", "covers", cover)
            : null;
        const pdfUrl =
          pdf && pdf.size > 0
            ? await uploadToBucket("magazines", "pdfs", pdf)
            : null;
        const res = await createMagazineRow({
          title: (fd.get("title") as string)?.trim() || null,
          issue: (fd.get("issue") as string) || null,
          coverImage,
          pdfUrl,
        });
        if (!res.success) throw new Error(res.error);
      }
      setMsg({ ok: true, text: "Saved successfully." });
      form.reset();
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
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
          {msg && (
            <span className={`text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`}>
              {msg.text}
            </span>
          )}
        </div>
      </form>
    </Card>
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
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
