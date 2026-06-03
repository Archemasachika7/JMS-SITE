"use client";

import {
  ActionForm,
  ActionButton,
  Card,
  Field,
  inputCls,
} from "@/components/admin/AdminUI";
import { saveEvent, deleteRow } from "@/app/actions/admin";

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  poster_url: string | null;
  event_date: string | null;
};

export default function EventsManager({ events }: { events: EventRow[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Add an event
        </h2>
        <ActionForm action={saveEvent} submitLabel="Create event">
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
        </ActionForm>
      </Card>

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
