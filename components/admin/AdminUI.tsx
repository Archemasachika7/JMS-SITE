"use client";

import { useState, useTransition } from "react";

type Result = { success: boolean; error?: string };

/* ── Section heading ──────────────────────────────────────────────────── */
export function AdminHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}

/* ── Card wrapper ─────────────────────────────────────────────────────── */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#0f172a]/70 p-5 ${className}`}>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#f43f5e]/60 focus:outline-none";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export { inputCls };

/* ── Submit button with built-in pending state ────────────────────────── */
export function SubmitButton({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#f43f5e] to-[#fb7185] px-4 py-2 text-sm font-semibold text-[#02040a] transition hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

/**
 * A form wrapper that calls a server action, shows success / error feedback,
 * and optionally resets on success. Children receive the pending flag.
 */
export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  resetOnSuccess = true,
  onDone,
}: {
  action: (fd: FormData) => Promise<Result>;
  children: React.ReactNode;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  onDone?: () => void;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        start(async () => {
          const res = await action(fd);
          if (res.success) {
            setMsg({ ok: true, text: "Saved successfully." });
            if (resetOnSuccess) form.reset();
            onDone?.();
          } else {
            setMsg({ ok: false, text: res.error ?? "Something went wrong." });
          }
        });
      }}
      className="space-y-4"
    >
      {children}
      <div className="flex items-center gap-3">
        <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
        {msg && (
          <span
            className={`text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`}
          >
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}

/* ── Generic action button (delete / approve / reject) ────────────────── */
export function ActionButton({
  onAction,
  label,
  confirm,
  variant = "default",
}: {
  onAction: () => Promise<Result>;
  label: string;
  confirm?: string;
  variant?: "default" | "danger" | "success";
}) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const cls =
    variant === "danger"
      ? "border-red-500/40 text-red-300 hover:bg-red-500/10"
      : variant === "success"
      ? "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
      : "border-white/15 text-gray-300 hover:bg-white/5";

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          start(async () => {
            const res = await onAction();
            if (!res.success) setErr(res.error ?? "Failed");
          });
        }}
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${cls}`}
      >
        {pending ? "…" : label}
      </button>
      {err && <span className="text-xs text-red-400">{err}</span>}
    </span>
  );
}
