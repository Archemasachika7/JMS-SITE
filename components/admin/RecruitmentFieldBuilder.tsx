"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_SCHEMA,
  FIELD_TYPES,
  FIELDS_WITH_OPTIONS,
  slugify,
  uid,
  type FieldType,
  type RecruitField,
  type RecruitmentSchema,
} from "@/lib/recruitmentSchema";

const inputSm =
  "w-full rounded-md border border-white/10 bg-[#0b1220] px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:border-[#00F0FF]/60 focus:outline-none";

/**
 * A self-contained team/field builder. It keeps the schema in local state
 * and mirrors it into a hidden <input name="..."> so the surrounding
 * ActionForm submits the JSON to saveRecruitment.
 */
export default function RecruitmentFieldBuilder({
  name = "fields",
  initial,
}: {
  name?: string;
  initial?: RecruitmentSchema | null;
}) {
  const seed = initial && initial.length ? initial : DEFAULT_SCHEMA;
  const [schema, setSchema] = useState<RecruitmentSchema>(() =>
    // deep clone so editing never mutates the shared default
    JSON.parse(JSON.stringify(seed))
  );
  const [activeId, setActiveId] = useState(schema[0]?.id ?? "");

  const json = useMemo(() => JSON.stringify(schema), [schema]);
  const active = schema.find((t) => t.id === activeId) ?? schema[0];

  // ── mutators ──────────────────────────────────────────────────────────
  function patchTeam(id: string, patch: Partial<RecruitmentSchema[number]>) {
    setSchema((s) => s.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function patchField(teamId: string, fieldId: string, patch: Partial<RecruitField>) {
    setSchema((s) =>
      s.map((t) =>
        t.id !== teamId
          ? t
          : { ...t, fields: t.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)) }
      )
    );
  }
  function addField(teamId: string) {
    const f: RecruitField = { id: uid(), name: "new_field", label: "New question", type: "text" };
    setSchema((s) => s.map((t) => (t.id === teamId ? { ...t, fields: [...t.fields, f] } : t)));
  }
  function removeField(teamId: string, fieldId: string) {
    setSchema((s) =>
      s.map((t) => (t.id === teamId ? { ...t, fields: t.fields.filter((f) => f.id !== fieldId) } : t))
    );
  }
  function moveField(teamId: string, idx: number, dir: -1 | 1) {
    setSchema((s) =>
      s.map((t) => {
        if (t.id !== teamId) return t;
        const fields = [...t.fields];
        const j = idx + dir;
        if (j < 0 || j >= fields.length) return t;
        [fields[idx], fields[j]] = [fields[j], fields[idx]];
        return { ...t, fields };
      })
    );
  }
  function addTeam() {
    const id = uid("team");
    setSchema((s) => [...s, { id, label: "New team", emoji: "🧩", blurb: "", fields: [] }]);
    setActiveId(id);
  }
  function removeTeam(id: string) {
    setSchema((s) => {
      const next = s.filter((t) => t.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? "");
      return next;
    });
  }
  function resetToDefault() {
    const fresh: RecruitmentSchema = JSON.parse(JSON.stringify(DEFAULT_SCHEMA));
    setSchema(fresh);
    setActiveId(fresh[0]?.id ?? "");
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
      <input type="hidden" name={name} value={json} readOnly />

      {/* Team tabs */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {schema.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
              t.id === active?.id
                ? "border border-[#00F0FF]/50 bg-[#00F0FF]/10 text-[#00F0FF]"
                : "border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {t.emoji} {t.label}{" "}
            <span className="opacity-50">({t.fields.length})</span>
          </button>
        ))}
        <button
          type="button"
          onClick={addTeam}
          className="rounded-full border border-dashed border-white/20 px-2.5 py-1 text-xs text-gray-400 hover:text-white"
        >
          + Team
        </button>
        <button
          type="button"
          onClick={resetToDefault}
          className="ml-auto text-[11px] text-gray-500 hover:text-gray-300"
          title="Reset all teams & fields to the built-in default"
        >
          ↺ Reset to default
        </button>
      </div>

      {active && (
        <div className="space-y-3">
          {/* Team meta */}
          <div className="grid grid-cols-[64px_1fr] gap-2">
            <input
              className={inputSm}
              value={active.emoji ?? ""}
              onChange={(e) => patchTeam(active.id, { emoji: e.target.value })}
              placeholder="emoji"
              aria-label="Team emoji"
            />
            <input
              className={inputSm}
              value={active.label}
              onChange={(e) => patchTeam(active.id, { label: e.target.value })}
              placeholder="Team name"
              aria-label="Team name"
            />
          </div>
          <input
            className={inputSm}
            value={active.blurb ?? ""}
            onChange={(e) => patchTeam(active.id, { blurb: e.target.value })}
            placeholder="One-line description shown under the team name"
            aria-label="Team blurb"
          />

          {/* Fields */}
          <div className="space-y-2">
            {active.fields.map((f, idx) => (
              <FieldEditor
                key={f.id}
                field={f}
                onChange={(patch) => patchField(active.id, f.id, patch)}
                onRemove={() => removeField(active.id, f.id)}
                onUp={() => moveField(active.id, idx, -1)}
                onDown={() => moveField(active.id, idx, 1)}
                isFirst={idx === 0}
                isLast={idx === active.fields.length - 1}
              />
            ))}
            {active.fields.length === 0 && (
              <p className="py-2 text-center text-xs text-gray-600">
                No fields yet — add the first question below.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => addField(active.id)}
              className="rounded-md border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-3 py-1.5 text-xs font-medium text-[#00F0FF] hover:bg-[#00F0FF]/20"
            >
              + Add field
            </button>
            {schema.length > 1 && (
              <button
                type="button"
                onClick={() => removeTeam(active.id)}
                className="text-[11px] text-rose-400/80 hover:text-rose-300"
              >
                Delete “{active.label}” team
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── A single field row ──────────────────────────────────────────────────────
function FieldEditor({
  field,
  onChange,
  onRemove,
  onUp,
  onDown,
  isFirst,
  isLast,
}: {
  field: RecruitField;
  onChange: (patch: Partial<RecruitField>) => void;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const hasOptions = FIELDS_WITH_OPTIONS.includes(field.type);
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.02] p-2.5">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-0.5 pt-1">
          <button type="button" onClick={onUp} disabled={isFirst} className="text-gray-500 hover:text-white disabled:opacity-20" aria-label="Move up">▲</button>
          <button type="button" onClick={onDown} disabled={isLast} className="text-gray-500 hover:text-white disabled:opacity-20" aria-label="Move down">▼</button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-gray-500">Question label</span>
            <input
              className={inputSm}
              value={field.label}
              onChange={(e) => {
                const label = e.target.value;
                // keep the submitted name in sync until the admin hand-edits it
                const autoName = slugify(field.label) === field.name;
                onChange(autoName ? { label, name: slugify(label) } : { label });
              }}
            />
          </label>
          <label className="block">
            <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-gray-500">Field name (submitted)</span>
            <input
              className={`${inputSm} font-mono`}
              value={field.name}
              onChange={(e) => onChange({ name: slugify(e.target.value) })}
            />
          </label>

          <label className="block">
            <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-gray-500">Type</span>
            <select
              className={inputSm}
              value={field.type}
              onChange={(e) => onChange({ type: e.target.value as FieldType })}
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#0b1220]">{t}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-gray-500">Placeholder</span>
            <input
              className={inputSm}
              value={field.placeholder ?? ""}
              onChange={(e) => onChange({ placeholder: e.target.value })}
            />
          </label>

          {hasOptions && (
            <label className="block sm:col-span-2">
              <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-gray-500">Options (one per line)</span>
              <textarea
                className={`${inputSm} min-h-[60px] resize-y`}
                value={(field.options ?? []).join("\n")}
                onChange={(e) =>
                  onChange({ options: e.target.value.split("\n").map((o) => o.trim()).filter(Boolean) })
                }
              />
            </label>
          )}

          <label className="block sm:col-span-2">
            <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-gray-500">Help text (optional)</span>
            <input
              className={inputSm}
              value={field.help ?? ""}
              onChange={(e) => onChange({ help: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2">
        <label className="flex items-center gap-1.5 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={Boolean(field.required)}
            onChange={(e) => onChange({ required: e.target.checked })}
            className="h-3.5 w-3.5 accent-[#00F0FF]"
          />
          Required
        </label>
        <button type="button" onClick={onRemove} className="text-[11px] text-rose-400/80 hover:text-rose-300">
          Remove field
        </button>
      </div>
    </div>
  );
}
