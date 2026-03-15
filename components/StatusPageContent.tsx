"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Clock,
  XCircle,
  CheckCircle,
  Award,
  Download,
  Heart,
  Handshake,
  Rocket,
  UserPlus,
  LogIn,
} from "lucide-react";
import type {
  DonationRecord,
  SponsorRecord,
} from "@/app/dashboard/status/page";

interface StatusPageContentProps {
  user: { id: string; email: string } | null;
  donations: DonationRecord[];
  sponsorships: SponsorRecord[];
}

/* ── animation helpers ──────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

/* ── status badge ───────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: {
      label: "Pending",
      cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    },
    rejected: {
      label: "Rejected",
      cls: "bg-red-500/20 text-red-300 border-red-500/40",
    },
    verified: {
      label: "Verified",
      cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

/* ── individual status card ─────────────────────────────────────────── */
function RecordCard({
  type,
  title,
  subtitle,
  amount,
  transactionRef,
  status,
  certificateIssued,
  createdAt,
  index,
}: {
  type: "donation" | "sponsorship";
  title: string;
  subtitle?: string;
  amount: number;
  transactionRef: string;
  status: string;
  certificateIssued: boolean;
  createdAt: string;
  index: number;
}) {
  const borderColor =
    status === "verified"
      ? "border-emerald-500/40"
      : status === "rejected"
      ? "border-red-500/40"
      : "border-yellow-500/40";

  const glowColor =
    status === "verified"
      ? "shadow-emerald-500/10"
      : status === "rejected"
      ? "shadow-red-500/10"
      : "shadow-yellow-500/10";

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`relative overflow-hidden rounded-2xl border ${borderColor} bg-[#0a0f2c]/80 p-6 shadow-lg ${glowColor} backdrop-blur-md`}
    >
      {/* header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              type === "donation"
                ? "bg-pink-500/20 text-pink-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {type === "donation" ? (
              <Heart className="h-5 w-5" />
            ) : (
              <Handshake className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              {type === "donation" ? "Donation" : "Sponsorship"}
            </p>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* details */}
      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-slate-500">Amount</span>
          <p className="font-semibold text-white">₹{amount.toLocaleString("en-IN")}</p>
        </div>
        <div>
          <span className="text-slate-500">Transaction ID</span>
          <p className="truncate font-mono text-xs text-slate-300">
            {transactionRef}
          </p>
        </div>
        <div className="col-span-2">
          <span className="text-slate-500">Submitted</span>
          <p className="text-slate-300">
            {new Date(createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* status-specific message */}
      {status === "pending" && <PendingMessage />}
      {status === "rejected" && (
        <RejectedMessage transactionRef={transactionRef} />
      )}
      {status === "verified" && (
        <VerifiedMessage certificateIssued={certificateIssued} />
      )}
    </motion.div>
  );
}

/* ── STATE B — pending ──────────────────────────────────────────────── */
function PendingMessage() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
      <div>
        <p className="font-medium text-yellow-300">
          Verification in Progress
        </p>
        <p className="text-sm text-yellow-200/70">
          We are reviewing your payment. This usually takes up to 24 hours.
        </p>
      </div>
    </div>
  );
}

/* ── STATE C — rejected ─────────────────────────────────────────────── */
function RejectedMessage({ transactionRef }: { transactionRef: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      <div>
        <p className="font-medium text-red-300">Verification Failed</p>
        <p className="text-sm text-red-200/70">
          Please contact the admin team with your Transaction&nbsp;ID{" "}
          <span className="font-mono text-red-300">{transactionRef}</span>.
        </p>
      </div>
    </div>
  );
}

/* ── STATE D — verified ─────────────────────────────────────────────── */
function VerifiedMessage({
  certificateIssued,
}: {
  certificateIssued: boolean;
}) {
  if (!certificateIssued) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        <div>
          <p className="font-medium text-emerald-300">Payment Verified!</p>
          <p className="text-sm text-emerald-200/70">
            Your official AstroSci certificate is currently being generated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-yellow-500/10 p-6">
      <Award className="h-10 w-10 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
      <p className="text-center font-semibold text-cyan-200">
        Your certificate is ready!
      </p>
      <button
        aria-label="Download Official Certificate"
        className="group relative mt-1 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-yellow-500 px-8 py-3.5 text-sm font-bold text-[#020617] shadow-[0_0_24px_rgba(6,182,212,0.4)] transition-shadow hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
      >
        <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
        Download Official Certificate
      </button>
    </div>
  );
}

/* ── main component ─────────────────────────────────────────────────── */
export default function StatusPageContent({
  user,
  donations,
  sponsorships,
}: StatusPageContentProps) {
  const isEmpty = donations.length === 0 && sponsorships.length === 0;

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen px-4 pb-24 pt-28">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          {/* page heading */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300">
              <Rocket className="h-3.5 w-3.5" />
              Status Tracker
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Application Status
            </h1>
            <p className="mt-2 text-slate-400">
              Track the progress of your donations &amp; sponsorships.
            </p>
          </motion.div>

          {/* ── not logged in ──────────────────────────────────────── */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-md rounded-2xl border border-blue-500/20 bg-[#0a0f2c]/80 p-8 text-center backdrop-blur-md"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
                <LogIn className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">
                Sign in to view your status
              </h2>
              <p className="mb-6 text-sm text-slate-400">
                Log in or create an account to track your donation and
                sponsorship applications.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/auth?tab=login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
                <Link
                  href="/auth?tab=signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700/80"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── STATE A — empty ────────────────────────────────────── */}
          {user && isEmpty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-md rounded-2xl border border-slate-700/60 bg-[#0a0f2c]/80 p-8 text-center backdrop-blur-md"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
                <Rocket className="h-8 w-8 text-slate-500" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">
                No records found
              </h2>
              <p className="mb-6 text-sm text-slate-400">
                No sponsorship or donation attempts found for this account.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/donators/payment"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-500"
                >
                  <Heart className="h-4 w-4" />
                  Make a Donation
                </Link>
                <Link
                  href="/sponsors"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700/80"
                >
                  <Handshake className="h-4 w-4" />
                  View Sponsorship Plans
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── cards ──────────────────────────────────────────────── */}
          {user && !isEmpty && (
            <div className="flex flex-col gap-6">
              {donations.map((d, i) => (
                <RecordCard
                  key={d.id}
                  type="donation"
                  title={d.full_name}
                  amount={d.amount}
                  transactionRef={d.transaction_ref}
                  status={d.status}
                  certificateIssued={d.certificate_issued}
                  createdAt={d.created_at}
                  index={i}
                />
              ))}
              {sponsorships.map((s, i) => (
                <RecordCard
                  key={s.id}
                  type="sponsorship"
                  title={s.organization_name}
                  subtitle={s.contact_name}
                  amount={s.amount}
                  transactionRef={s.transaction_ref}
                  status={s.status}
                  certificateIssued={s.certificate_issued}
                  createdAt={s.created_at}
                  index={donations.length + i}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
