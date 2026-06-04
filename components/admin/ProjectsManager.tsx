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
  createProjectRow,
  updateProjectRow,
  deleteRow,
} from "@/app/actions/admin";
import { uploadToBucket } from "@/lib/clientUpload";

export type ProjectRow = {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  thumbnail_url: string | null;
  pdf_url: string | null;
  video_url: string | null;
  link_url: string | null;
};

/** Shared fields for the create / edit forms. */
function ProjectFields({ row }: { row?: ProjectRow }) {
  return (
    <>
      <Field label="Title">
        <input name="title" required className={inputCls} defaultValue={row?.title ?? ""} placeholder="Modelling planetary orbits" />
      </Field>
      <Field label="Description">
        <textarea name="description" rows={3} className={inputCls} defaultValue={row?.description ?? ""} />
      </Field>
      <Field label="Author / team">
        <input name="author" className={inputCls} defaultValue={row?.author ?? ""} placeholder="Submitted by …" />
      </Field>
      <Field label={row ? "Replace photo / thumbnail (optional)" : "Photo / thumbnail (optional)"}>
        <input type="file" name="thumbnail" accept="image/*" className={inputCls} />
      </Field>
      <Field label={row ? "Replace PDF (optional)" : "PDF (optional)"}>
        <input type="file" name="pdf" accept="application/pdf" className={inputCls} />
      </Field>
      <Field label="Video link (optional)">
        <input name="video_url" className={inputCls} defaultValue={row?.video_url ?? ""} placeholder="https://youtube.com/watch?v=…" />
      </Field>
      <Field label="External link (optional)">
        <input name="link_url" className={inputCls} defaultValue={row?.link_url ?? ""} placeholder="https://github.com/…" />
      </Field>
    </>
  );
}

async function uploadFiles(fd: FormData) {
  const thumb = fd.get("thumbnail") as File | null;
  const pdf = fd.get("pdf") as File | null;
  const thumbnailUrl =
    thumb && thumb.size > 0
      ? await uploadToBucket("projects", "thumbnails", thumb)
      : undefined;
  const pdfUrl =
    pdf && pdf.size > 0 ? await uploadToBucket("projects", "pdfs", pdf) : undefined;
  return { thumbnailUrl, pdfUrl };
}

function CreateProjectForm() {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setPending(true);
    setMsg(null);
    try {
      const { thumbnailUrl, pdfUrl } = await uploadFiles(fd);
      const res = await createProjectRow({
        title: (fd.get("title") as string)?.trim(),
        description: (fd.get("description") as string) || null,
        author: (fd.get("author") as string) || null,
        thumbnailUrl,
        pdfUrl,
        videoUrl: (fd.get("video_url") as string)?.trim() || null,
        linkUrl: (fd.get("link_url") as string)?.trim() || null,
      });
      if (!res.success) throw new Error(res.error);
      setMsg({ ok: true, text: "Project added." });
      form.reset();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Failed." });
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Add a project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProjectFields />
        <div className="flex items-center gap-3">
          <SubmitButton pending={pending}>Add project</SubmitButton>
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

function EditProjectForm({ project }: { project: ProjectRow }) {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setMsg(null);
    try {
      const { thumbnailUrl, pdfUrl } = await uploadFiles(fd);
      const res = await updateProjectRow({
        id: project.id,
        title: (fd.get("title") as string)?.trim(),
        description: (fd.get("description") as string) || null,
        author: (fd.get("author") as string) || null,
        thumbnailUrl,
        pdfUrl,
        videoUrl: (fd.get("video_url") as string)?.trim() || null,
        linkUrl: (fd.get("link_url") as string)?.trim() || null,
      });
      if (!res.success) throw new Error(res.error);
      setMsg({ ok: true, text: "Saved." });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Failed." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 border-t border-white/5 pt-3">
      <ProjectFields row={project} />
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

export default function ProjectsManager({ projects }: { projects: ProjectRow[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
      <CreateProjectForm />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Existing projects ({projects.length})
        </h2>
        {projects.length === 0 && (
          <p className="text-sm text-gray-500">No projects yet.</p>
        )}
        {projects.map((p) => (
          <Card key={p.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                {p.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnail_url} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-white">{p.title}</p>
                  {p.author && <p className="text-xs text-gray-500">by {p.author}</p>}
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                    {p.pdf_url && (
                      <a href={p.pdf_url} target="_blank" rel="noreferrer" className="text-[#f43f5e] hover:underline">PDF ↗</a>
                    )}
                    {p.video_url && (
                      <a href={p.video_url} target="_blank" rel="noreferrer" className="text-[#f43f5e] hover:underline">Video ↗</a>
                    )}
                    {p.link_url && (
                      <a href={p.link_url} target="_blank" rel="noreferrer" className="text-[#f43f5e] hover:underline">Link ↗</a>
                    )}
                  </div>
                </div>
              </div>
              <ActionButton
                label="Delete"
                variant="danger"
                confirm={`Delete "${p.title}"?`}
                onAction={() => deleteRow("projects", p.id)}
              />
            </div>
            <details className="group">
              <summary className="cursor-pointer text-xs text-[#f43f5e] hover:underline">
                Edit
              </summary>
              <EditProjectForm project={p} />
            </details>
          </Card>
        ))}
      </div>
    </div>
  );
}
