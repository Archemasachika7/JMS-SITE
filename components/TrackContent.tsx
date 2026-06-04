"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  Clock,
  XCircle,
  CheckCircle,
  Award,
  Download,
  Heart,
  Handshake,
} from "lucide-react";
import { lookupSubmissions, type LookupRow } from "@/app/actions/lookup";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" },
    rejected: { label: "Rejected", cls: "bg-red-500/20 text-red-300 border-red-500/40" },
    verified: { label: "Verified", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

function ResultCard({ row, index }: { row: LookupRow; index: number }) {
  const isDonation = row.kind === "donation";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-[#0a0f2c]/80 p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDonation ? "bg-pink-500/20 text-pink-400" : "bg-blue-500/20 text-blue-400"}`}>
            {isDonation ? <Heart className="h-5 w-5" /> : <Handshake className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              {isDonation ? "Donation" : "Sponsorship"}
            </p>
            <h3 className="text-lg font-semibold text-white">{row.name}</h3>
          </div>
        </div>
        <StatusBadge status={row.status} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-slate-500">Amount</span>
          <p className="font-semibold text-white">₹{Number(row.amount).toLocaleString("en-IN")}</p>
        </div>
        <div>
          <span className="text-slate-500">Transaction ID</span>
          <p className="truncate font-mono text-xs text-slate-300">{row.transaction_ref}</p>
        </div>
      </div>

      {row.status === "pending" && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
          <p className="text-sm text-yellow-200/80">
            Verification in progress (usually within 24 hours).
          </p>
        </div>
      )}
      {row.status === "rejected" && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <p className="text-sm text-red-200/80">
            Verification failed. Please contact the admin team with your Transaction ID.
          </p>
        </div>
      )}
      {row.status === "verified" && (!row.certificate_issued || !row.certificate_url) && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-200/80">
            Payment verified! Your official certificate is being generated.
          </p>
        </div>
      )}
      {row.status === "verified" && row.certificate_issued && row.certificate_url && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-yellow-500/10 p-6">
          <Award className="h-10 w-10 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
          <p className="text-center font-semibold text-cyan-200">Your certificate is ready!</p>
          <a
            href={row.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-yellow-500 px-8 py-3.5 text-sm font-bold text-[#020617] shadow-[0_0_24px_rgba(225,29,72,0.4)] transition-shadow hover:shadow-[0_0_40px_rgba(225,29,72,0.6)]"
          >
            <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            Download Official Certificate
          </a>
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-slate-500">
        Tracking token: <span className="font-mono text-slate-300">{row.access_token}</span>
      </p>
    </motion.div>
  );
}

export default function TrackContent() {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<LookupRow[] | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setRows(null);
    const res = await lookupSubmissions(query);
    if (res.success) {
      setRows(res.rows);
    } else {
      setError(res.error);
    }
    setPending(false);
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen px-4 pb-24 pt-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300">
              <Search className="h-3.5 w-3.5" />
              Track Your Submission
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Check Status &amp; Download Certificate
            </h1>
            <p className="mt-2 text-slate-400">
              Enter the tracking token you received, or the email you applied with.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mb-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tracking token or email"
              className="flex-1 rounded-xl border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              {pending ? "Searching…" : "Search"}
            </button>
          </form>

          {error && (
            <p className="mb-6 text-center text-sm text-red-400">{error}</p>
          )}

          {rows && rows.length === 0 && (
            <p className="text-center text-sm text-slate-400">
              No submissions found for that token or email.
            </p>
          )}

          {rows && rows.length > 0 && (
            <div className="flex flex-col gap-6">
              {rows.map((r, i) => (
                <ResultCard key={`${r.kind}-${r.access_token}`} row={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
