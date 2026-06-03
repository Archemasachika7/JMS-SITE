"use client";

import {
  ActionForm,
  ActionButton,
  Card,
  Field,
  inputCls,
} from "@/components/admin/AdminUI";
import { addGalleryImage, addPotw, addMagazine, deleteRow } from "@/app/actions/admin";

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

const CONFIG: Record<
  Kind,
  {
    heading: string;
    action: (fd: FormData) => Promise<{ success: boolean; error?: string }>;
    submit: string;
  }
> = {
  gallery: { heading: "Upload an image", action: addGalleryImage, submit: "Upload image" },
  potw: { heading: "Add Problem/Photo of the Week", action: addPotw, submit: "Add POTW" },
  magazines: { heading: "Add magazine issue", action: addMagazine, submit: "Add issue" },
};

function CreateForm({ kind }: { kind: Kind }) {
  const c = CONFIG[kind];
  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        {c.heading}
      </h2>
      <ActionForm action={c.action} submitLabel={c.submit}>
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
      </ActionForm>
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
