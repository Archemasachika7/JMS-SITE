"use client";

import {
  ActionForm,
  ActionButton,
  Card,
  Field,
  inputCls,
} from "@/components/admin/AdminUI";
import { saveProblem, deleteRow } from "@/app/actions/admin";

export type ProblemRow = {
  id: string;
  title: string;
  statement: string | null;
  difficulty: string | null;
  topic: string | null;
  source: string | null;
  is_published: boolean | null;
  problem_date: string | null;
};

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function ProblemsManager({ problems }: { problems: ProblemRow[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      {/* Create form */}
      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Add a problem
        </h2>
        <ActionForm action={saveProblem} submitLabel="Publish problem">
          <Field label="Title">
            <input name="title" required className={inputCls} placeholder="A clever counting problem" />
          </Field>
          <Field label="Statement (LaTeX supported)">
            <textarea
              name="statement"
              rows={4}
              className={inputCls}
              placeholder="Find the number of ways to ... \\( \\binom{n}{k} \\)"
            />
          </Field>
          <Field label="Solution (optional, LaTeX)">
            <textarea name="solution" rows={3} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Difficulty">
              <select name="difficulty" defaultValue="medium" className={inputCls}>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="Topic">
              <input name="topic" className={inputCls} placeholder="Combinatorics" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source">
              <input name="source" className={inputCls} placeholder="Putnam 2019" />
            </Field>
            <Field label="Date">
              <input type="date" name="problem_date" className={inputCls} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="is_published" defaultChecked className="accent-[#22d3ee]" />
            Published (visible on the public site)
          </label>
        </ActionForm>
      </Card>

      {/* List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Existing problems ({problems.length})
        </h2>
        {problems.length === 0 && (
          <p className="text-sm text-gray-500">No problems yet.</p>
        )}
        {problems.map((p) => (
          <Card key={p.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-white">{p.title}</p>
                {!p.is_published && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                    draft
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {p.difficulty} {p.topic ? `· ${p.topic}` : ""}{" "}
                {p.problem_date ? `· ${p.problem_date}` : ""}
              </p>
              {p.statement && (
                <p className="mt-1 line-clamp-2 text-xs text-gray-400">{p.statement}</p>
              )}
            </div>
            <ActionButton
              label="Delete"
              variant="danger"
              confirm={`Delete "${p.title}"?`}
              onAction={() => deleteRow("problems", p.id)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
