"use client";

import {
  ActionForm,
  ActionButton,
  Card,
  Field,
  inputCls,
} from "@/components/admin/AdminUI";
import { saveRecruitment, setRecruitmentOpen, deleteRow } from "@/app/actions/admin";

export type RecruitmentRow = {
  id: string;
  title: string;
  session_label: string | null;
  subtitle: string | null;
  deadline: string;
  form_action: string | null;
  is_open: boolean;
  created_at: string;
};

/** Format an ISO timestamp into the value a datetime-local input expects. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export default function RecruitmentManager({
  recruitments,
}: {
  recruitments: RecruitmentRow[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
      <Card>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Start a new recruitment
        </h2>
        <p className="mb-4 text-xs text-gray-500">
          The banner on the homepage and the public recruitment page read the
          most recent <span className="text-gray-300">open</span> drive. Set a
          deadline and toggle it open to go live.
        </p>
        <ActionForm action={saveRecruitment} submitLabel="Create recruitment">
          <Field label="Title">
            <input name="title" required className={inputCls} placeholder="Recruitment" defaultValue="Recruitment" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Session label">
              <input name="session_label" className={inputCls} placeholder="2025–26" />
            </Field>
            <Field label="Deadline (IST shown to users)">
              <input type="datetime-local" name="deadline" required className={inputCls} />
            </Field>
          </div>
          <Field label="Subtitle / tagline">
            <input
              name="subtitle"
              className={inputCls}
              placeholder="Select your team · Fill the form · Solve · Prove · Create"
            />
          </Field>
          <Field label="Formspree endpoint (where applications are sent)">
            <input
              name="form_action"
              className={inputCls}
              placeholder="https://formspree.io/f/xxxxxxx"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="is_open" defaultChecked className="h-4 w-4 accent-[#f43f5e]" />
            Open immediately (visible on the site)
          </label>
        </ActionForm>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Recruitment drives ({recruitments.length})
        </h2>
        {recruitments.length === 0 && (
          <p className="text-sm text-gray-500">No recruitment drives yet.</p>
        )}
        {recruitments.map((r) => {
          const expired = new Date(r.deadline).getTime() <= Date.now();
          const live = r.is_open && !expired;
          return (
            <Card key={r.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">
                      {r.title} {r.session_label && <span className="text-gray-400">· {r.session_label}</span>}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        live
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-gray-500/15 text-gray-400"
                      }`}
                    >
                      {live ? "Live" : expired ? "Expired" : "Closed"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Deadline:{" "}
                    {new Date(r.deadline).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    })}{" "}
                    IST
                  </p>
                  {r.form_action && (
                    <p className="mt-0.5 truncate text-xs text-gray-600">{r.form_action}</p>
                  )}
                </div>
                <ActionButton
                  label="Delete"
                  variant="danger"
                  confirm={`Delete the "${r.title}" recruitment?`}
                  onAction={() => deleteRow("recruitments", r.id)}
                />
              </div>

              {/* Edit form (collapsed feel via details) */}
              <details className="group">
                <summary className="cursor-pointer text-xs text-[#f43f5e] hover:underline">
                  Edit details
                </summary>
                <div className="mt-3 border-t border-white/5 pt-3">
                  <ActionForm action={saveRecruitment} submitLabel="Save changes" resetOnSuccess={false}>
                    <input type="hidden" name="id" value={r.id} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Title">
                        <input name="title" required className={inputCls} defaultValue={r.title} />
                      </Field>
                      <Field label="Session label">
                        <input name="session_label" className={inputCls} defaultValue={r.session_label ?? ""} />
                      </Field>
                    </div>
                    <Field label="Deadline">
                      <input
                        type="datetime-local"
                        name="deadline"
                        required
                        className={inputCls}
                        defaultValue={toLocalInput(r.deadline)}
                      />
                    </Field>
                    <Field label="Subtitle">
                      <input name="subtitle" className={inputCls} defaultValue={r.subtitle ?? ""} />
                    </Field>
                    <Field label="Formspree endpoint">
                      <input name="form_action" className={inputCls} defaultValue={r.form_action ?? ""} />
                    </Field>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="checkbox" name="is_open" defaultChecked={r.is_open} className="h-4 w-4 accent-[#f43f5e]" />
                      Open (visible on the site)
                    </label>
                  </ActionForm>
                </div>
              </details>

              <div className="flex gap-2 border-t border-white/5 pt-3">
                <ActionButton
                  label={r.is_open ? "Close now" : "Reopen"}
                  variant={r.is_open ? "default" : "success"}
                  onAction={() => setRecruitmentOpen(r.id, !r.is_open)}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
