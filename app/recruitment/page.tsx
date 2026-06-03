"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  coerceSchema,
  type RecruitField,
  type RecruitTeam,
  type RecruitmentSchema,
} from "@/lib/recruitmentSchema";

// ── Fallbacks when no drive is configured in the DB ──────────────────────────
// June 6, 2026, 5:00 PM IST (UTC+5:30 → UTC 11:30)
const FALLBACK_DEADLINE = "2026-06-06T11:30:00Z";
const FALLBACK_FORM = "https://formspree.io/f/xkoeejyk";

const ACCENTS = ["#00F0FF", "#00FF66", "#7B61FF", "#f43f5e", "#fb923c", "#facc15"];

type Recruitment = {
  title: string;
  session_label: string | null;
  subtitle: string | null;
  deadline: string;
  form_action: string | null;
  is_open: boolean;
  fields: RecruitmentSchema | null;
};

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; expired: boolean };
type Answer = string | string[];

function getTimeLeft(deadline: string): TimeLeft {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

function isFilled(field: RecruitField, v: Answer | undefined): boolean {
  if (field.type === "checkbox") return Array.isArray(v) && v.length > 0;
  return typeof v === "string" && v.trim() !== "";
}

// ── A single field control ───────────────────────────────────────────────────
function FieldInput({
  field,
  value,
  onChange,
  accent,
  onEnter,
}: {
  field: RecruitField;
  value: Answer | undefined;
  onChange: (v: Answer) => void;
  accent: string;
  onEnter?: () => void;
}) {
  const base =
    "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-all";
  const focusOn = (e: { currentTarget: HTMLElement }) =>
    (e.currentTarget.style.borderColor = `${accent}80`);
  const focusOff = (e: { currentTarget: HTMLElement }) =>
    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)");

  if (field.type === "textarea") {
    return (
      <textarea
        className={`${base} min-h-[130px] resize-y leading-relaxed`}
        placeholder={field.placeholder}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={focusOn}
        onBlur={focusOff}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        className={base}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={focusOn}
        onBlur={focusOff}
      >
        <option value="" className="bg-[#0b1220]">
          Choose…
        </option>
        {(field.options ?? []).map((o) => (
          <option key={o} value={o} className="bg-[#0b1220]">
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "radio" || field.type === "checkbox") {
    const multi = field.type === "checkbox";
    const selected: string[] = multi
      ? (Array.isArray(value) ? value : [])
      : value
      ? [value as string]
      : [];
    const toggle = (opt: string) => {
      if (multi) {
        onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
      } else {
        onChange(opt);
      }
    };
    return (
      <div className="flex flex-wrap gap-2">
        {(field.options ?? []).map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{
                border: `1px solid ${on ? accent : "rgba(255,255,255,0.12)"}`,
                background: on ? `${accent}1f` : "rgba(255,255,255,0.03)",
                color: on ? accent : "#cbd5e1",
                boxShadow: on ? `0 0 16px ${accent}33` : "none",
              }}
            >
              {multi ? (on ? "✓ " : "") : on ? "● " : "○ "}
              {opt}
            </button>
          );
        })}
      </div>
    );
  }

  // text | email | tel | url | number
  return (
    <input
      type={field.type}
      className={`${base} font-mono`}
      placeholder={field.placeholder}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onFocus={focusOn}
      onBlur={focusOff}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter) {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  );
}

export default function RecruitmentPage() {
  const [rec, setRec] = useState<Recruitment | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(FALLBACK_DEADLINE));
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // form flow
  const [team, setTeam] = useState<RecruitTeam | null>(null);
  const [step, setStep] = useState(0); // === fields.length → review
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [expandAll, setExpandAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);

  const deadline = rec?.deadline ?? FALLBACK_DEADLINE;
  const formAction = rec?.form_action || FALLBACK_FORM;
  const sessionLabel = rec?.session_label ?? "2025–26";
  const title = rec?.title ?? "Recruitment";
  const subtitle = rec?.subtitle ?? "Pick a domain · Answer · Prove you belong";
  const closedByAdmin = rec ? !rec.is_open : false;
  const closed = closedByAdmin || timeLeft.expired;

  const schema = useMemo(() => coerceSchema(rec?.fields), [rec]);
  const teamIndex = team ? schema.findIndex((t) => t.id === team.id) : 0;
  const accent = ACCENTS[(teamIndex < 0 ? 0 : teamIndex) % ACCENTS.length];

  // ── Data ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("recruitments")
          .select("title, session_label, subtitle, deadline, form_action, is_open, fields")
          .order("is_open", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) setRec(data as Recruitment);
      } catch {
        /* fall back */
      }
    })();
  }, []);

  useEffect(() => {
    setTimeLeft(getTimeLeft(deadline));
    const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  // ── Flow helpers ──────────────────────────────────────────────────────────
  const pickTeam = useCallback((t: RecruitTeam) => {
    setTeam(t);
    setStep(0);
    setAnswers({});
    setExpandAll(false);
    setDone(false);
    setHint(false);
  }, []);

  const setAnswer = useCallback((name: string, v: Answer) => {
    setAnswers((p) => ({ ...p, [name]: v }));
    setHint(false);
  }, []);

  const fields = team?.fields ?? [];
  const atReview = step >= fields.length;
  const current = !atReview ? fields[step] : null;
  const progress = fields.length ? Math.round((Math.min(step, fields.length) / fields.length) * 100) : 100;

  const next = useCallback(() => {
    if (current && current.required && !isFilled(current, answers[current.name])) {
      setHint(true);
      return;
    }
    setStep((s) => Math.min(s + 1, fields.length));
  }, [current, answers, fields.length]);

  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const missingRequired = useMemo(
    () => fields.filter((f) => f.required && !isFilled(f, answers[f.name])),
    [fields, answers]
  );

  const submit = useCallback(async () => {
    if (!team) return;
    if (missingRequired.length) {
      setToast({ msg: `Please complete: ${missingRequired[0].label}`, type: "error" });
      return;
    }
    if (formAction.includes("YOUR_FORM_ID")) {
      setToast({ msg: "⚠ Formspree endpoint not set by admin yet.", type: "error" });
      return;
    }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("_subject", `${title} — ${team.label} application`);
      fd.append("team", team.label);
      for (const f of team.fields) {
        const v = answers[f.name];
        if (Array.isArray(v)) v.forEach((x) => fd.append(f.name, x));
        else if (v != null) fd.append(f.name, String(v));
      }
      const res = await fetch(formAction, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      setDone(true);
      setToast({ msg: `✓ ${team.label} application received!`, type: "success" });
    } catch {
      setToast({ msg: "✗ Transmission failed — try again in a moment.", type: "error" });
    } finally {
      setSending(false);
    }
  }, [team, missingRequired, formAction, title, answers]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      {/* Void & Neon backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-0 h-[460px] w-[460px] rounded-full blur-[150px]" style={{ background: "rgba(0,240,255,0.05)" }} />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full blur-[140px]" style={{ background: "rgba(123,97,255,0.06)" }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,240,255,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-28 pt-32">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${accent})` }} />
            <span className="text-[11px] uppercase tracking-[0.4em]" style={{ color: accent }}>
              {sessionLabel} · Applications
            </span>
            <span className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${accent})` }} />
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">{title}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">{subtitle}</p>

          {/* Countdown */}
          {!closed && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: accent }} />
              <span className="text-gray-400">Closes in</span>
              <span className="font-semibold text-white tabular-nums">
                {timeLeft.days}d {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
              </span>
            </div>
          )}
        </div>

        {/* ── Closed state ─────────────────────────────────────────────── */}
        {closed ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 text-3xl">∎</div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Applications are closed
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-400">
              {closedByAdmin
                ? "This drive isn't accepting submissions right now. Follow us to catch the next one."
                : "The deadline has passed. Thank you to everyone who applied — watch this space for the next cycle."}
            </p>
          </div>
        ) : done ? (
          /* ── Success / QED ───────────────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border p-10 text-center backdrop-blur-xl"
            style={{ borderColor: `${accent}40`, background: `${accent}0a`, boxShadow: `0 0 50px ${accent}22` }}
          >
            <motion.div
              initial={{ rotate: -12, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl font-black"
              style={{ border: `2px solid ${accent}`, color: accent, boxShadow: `0 0 30px ${accent}44` }}
            >
              ∎
            </motion.div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              QED — application submitted
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-400">
              Your <span style={{ color: accent }}>{team?.label}</span> application has been transmitted. We read every
              single one — expect to hear from us before the deadline.
            </p>
            <button
              onClick={() => {
                setTeam(null);
                setDone(false);
              }}
              className="mt-6 rounded-full border border-white/15 px-5 py-2 text-sm text-gray-300 transition-colors hover:text-white"
            >
              ← Apply to another team
            </button>
          </motion.div>
        ) : !team ? (
          /* ── Team picker ─────────────────────────────────────────────── */
          <div>
            <p className="mb-4 text-center text-xs uppercase tracking-[0.3em] text-gray-500">Choose your domain</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {schema.map((t, i) => {
                const a = ACCENTS[i % ACCENTS.length];
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => pickTeam(t)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-md transition-colors"
                    style={{ ["--a" as string]: a }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${a}66`;
                      e.currentTarget.style.boxShadow = `0 0 30px ${a}1f`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {t.label}
                      </span>
                    </div>
                    {t.blurb && <p className="text-sm text-gray-400">{t.blurb}</p>}
                    <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px]" style={{ color: a }}>
                      {t.fields.length} questions
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Application: stepper or expanded ─────────────────────────── */
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl md:p-8" style={{ boxShadow: `0 0 40px ${accent}14` }}>
            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <button onClick={() => setTeam(null)} className="text-sm text-gray-400 transition-colors hover:text-white">
                ← Teams
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">{team.emoji}</span>
                <span className="font-semibold" style={{ color: accent }}>
                  {team.label}
                </span>
              </div>
              <button
                onClick={() => setExpandAll((v) => !v)}
                className="text-xs text-gray-500 transition-colors hover:text-gray-300"
              >
                {expandAll ? "Focus mode" : "Show all"}
              </button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="mb-1.5 flex justify-between font-mono text-[11px] text-gray-500">
                <span>{expandAll ? "All questions" : `Question ${Math.min(step + 1, fields.length)} / ${fields.length}`}</span>
                <span style={{ color: accent }}>{expandAll ? `${fields.length - missingRequired.length}/${fields.length} done` : `${progress}%`}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
                  animate={{ width: `${expandAll ? Math.round(((fields.length - missingRequired.length) / Math.max(fields.length, 1)) * 100) : progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            {expandAll ? (
              /* Expanded: every field at once */
              <div className="space-y-6">
                {fields.map((f, i) => (
                  <div key={f.id}>
                    <Label field={f} index={i} accent={accent} />
                    <FieldInput field={f} value={answers[f.name]} onChange={(v) => setAnswer(f.name, v)} accent={accent} />
                  </div>
                ))}
                <SubmitBar accent={accent} sending={sending} onSubmit={submit} label={`Submit ${team.label} application`} />
              </div>
            ) : atReview ? (
              /* Review step */
              <div>
                <h3 className="mb-1 text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Review &amp; submit
                </h3>
                <p className="mb-5 text-sm text-gray-400">One last look before we send it off.</p>
                <div className="space-y-2.5">
                  {fields.map((f) => {
                    const v = answers[f.name];
                    const shown = Array.isArray(v) ? v.join(", ") : (v as string) || "—";
                    const empty = !isFilled(f, v);
                    return (
                      <button
                        key={f.id}
                        onClick={() => setStep(fields.indexOf(f))}
                        className="flex w-full items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-white/20"
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">{f.label}{f.required && <span style={{ color: accent }}> *</span>}</p>
                          <p className={`truncate text-sm ${empty ? "text-rose-400/70 italic" : "text-gray-200"}`}>
                            {empty ? (f.required ? "Required — tap to fill" : "Skipped") : shown}
                          </p>
                        </div>
                        <span className="mt-0.5 shrink-0 text-xs text-gray-600">edit</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={back} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-gray-300 hover:text-white">
                    ← Back
                  </button>
                  <SubmitBar inline accent={accent} sending={sending} onSubmit={submit} label={`Submit ${team.label} application`} />
                </div>
              </div>
            ) : current ? (
              /* Focus: one question */
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                >
                  <Label field={current} index={step} accent={accent} />
                  <FieldInput
                    field={current}
                    value={answers[current.name]}
                    onChange={(v) => setAnswer(current.name, v)}
                    accent={accent}
                    onEnter={next}
                  />
                  {hint && current.required && !isFilled(current, answers[current.name]) && (
                    <p className="mt-2 text-xs text-rose-400">This one&apos;s required to continue.</p>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={back}
                      disabled={step === 0}
                      className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-gray-300 transition-colors hover:text-white disabled:opacity-30"
                    >
                      ← Back
                    </button>
                    <div className="flex items-center gap-2">
                      {!current.required && (
                        <button onClick={next} className="px-3 py-2.5 text-sm text-gray-500 hover:text-gray-300">
                          Skip
                        </button>
                      )}
                      <button
                        onClick={next}
                        className="rounded-full px-6 py-2.5 text-sm font-semibold transition-all"
                        style={{ background: `${accent}1f`, border: `1px solid ${accent}55`, color: accent }}
                      >
                        {step === fields.length - 1 ? "Review →" : "Next →"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">This team has no questions yet.</p>
            )}
          </div>
        )}
      </section>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl border px-5 py-3 text-sm backdrop-blur-xl"
            style={{
              borderColor: toast.type === "success" ? "rgba(0,255,102,0.4)" : "rgba(244,63,94,0.4)",
              background: toast.type === "success" ? "rgba(0,255,102,0.08)" : "rgba(244,63,94,0.08)",
              color: toast.type === "success" ? "#86efac" : "#fda4af",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

// ── Question label (mono "lemma" code + label + help) ─────────────────────────
function Label({ field, index, accent }: { field: RecruitField; index: number; accent: string }) {
  return (
    <div className="mb-3">
      <span className="font-mono text-[11px] tracking-wider" style={{ color: accent }}>
        {String(index + 1).padStart(2, "0")} ·{" "}
      </span>
      <label className="text-lg font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {field.label}
        {field.required && <span style={{ color: accent }}> *</span>}
      </label>
      {field.help && <p className="mt-1 text-sm text-gray-500">{field.help}</p>}
    </div>
  );
}

// ── Submit button ─────────────────────────────────────────────────────────────
function SubmitBar({
  accent,
  sending,
  onSubmit,
  label,
  inline,
}: {
  accent: string;
  sending: boolean;
  onSubmit: () => void;
  label: string;
  inline?: boolean;
}) {
  return (
    <button
      onClick={onSubmit}
      disabled={sending}
      className={`${inline ? "" : "mt-2 w-full"} rounded-full px-6 py-3 text-sm font-bold transition-all disabled:opacity-50`}
      style={{ background: accent, color: "#020617", boxShadow: `0 0 28px ${accent}55` }}
    >
      {sending ? "Transmitting…" : label}
    </button>
  );
}
