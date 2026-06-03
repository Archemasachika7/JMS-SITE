"use client";

import { useState } from "react";
import {
  ActionButton,
  Card,
  Field,
  inputCls,
  SubmitButton,
} from "@/components/admin/AdminUI";
import { createEventRow, deleteRow } from "@/app/actions/admin";
import { uploadToBucket } from "@/lib/clientUpload";

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  poster_url: string | null;
  event_date: string | null;
};

function CreateEventForm() {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setPending(true);
    setMsg(null);
    try {
      const poster = fd.get("poster") as File | null;
      const posterUrl =
        poster && poster.size > 0
          ? await uploadToBucket("events", "events", poster)
          : null;
      const res = await createEventRow({
        title: (fd.get("title") as string)?.trim(),
        description: (fd.get("description") as string) || null,
        location: (fd.get("location") as string) || null,
        eventDate: (fd.get("event_date") as string) || null,
        posterUrl,
      });
      if (!res.success) throw new Error(res.error);
      setMsg({ ok: true, text: "Event created." });
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

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Add an event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title">
          <input name="title" required className={inputCls} placeholder="Math Olympiad Bootcamp" />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={3} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Location">
            <input name="location" className={inputCls} placeholder="Lecture Hall 3" />
          </Field>
          <Field label="Date & time">
            <input type="datetime-local" name="event_date" className={inputCls} />
          </Field>
        </div>
        <Field label="Poster image (optional)">
          <input type="file" name="poster" accept="image/*" className={inputCls} />
        </Field>
        <div className="flex items-center gap-3">
          <SubmitButton pending={pending}>Create event</SubmitButton>
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

export default function EventsManager({ events }: { events: EventRow[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <CreateEventForm />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Existing events ({events.length})
        </h2>
        {events.length === 0 && <p className="text-sm text-gray-500">No events yet.</p>}
        {events.map((e) => (
          <Card key={e.id} className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3">
              {e.poster_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.poster_url} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              )}
              <div className="min-w-0">
                <p className="font-semibold text-white">{e.title}</p>
                <p className="text-xs text-gray-500">
                  {e.location || "—"}
                  {e.event_date ? ` · ${new Date(e.event_date).toLocaleString()}` : ""}
                </p>
                {e.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-gray-400">{e.description}</p>
                )}
              </div>
            </div>
            <ActionButton
              label="Delete"
              variant="danger"
              confirm={`Delete "${e.title}"?`}
              onAction={() => deleteRow("club_events", e.id)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
