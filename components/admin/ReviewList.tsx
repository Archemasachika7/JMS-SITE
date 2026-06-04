"use client";

import { useState } from "react";
import { Card, ActionButton, SubmitButton } from "@/components/admin/AdminUI";
import {
  moderateSubmission,
  issueCertificate,
  revokeCertificate,
} from "@/app/actions/admin";
import { uploadToBucket } from "@/lib/clientUpload";

export type ReviewRow = {
  id: string;
  status: string;
  amount: number;
  email: string;
  phone: string;
  transaction_ref: string;
  created_at: string;
  proofUrl: string | null;
  certificate_issued?: boolean;
  certificate_url?: string | null;
  access_token?: string;
  // donor
  full_name?: string;
  is_anonymous?: boolean;
  // sponsor
  organization_name?: string;
  contact_name?: string;
  plan_type?: string;
};

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    verified: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-300 border-red-500/30",
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${map[status] ?? map.pending}`}>
      {status}
    </span>
  );
}

/** Upload + attach (or revoke) a certificate PDF for one submission. */
function CertificateBlock({
  row,
  table,
}: {
  row: ReviewRow;
  table: "donators" | "sponsors";
}) {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("certificate") as File | null;
    if (!file || file.size === 0) {
      setMsg({ ok: false, text: "Choose a PDF first." });
      return;
    }
    if (file.type !== "application/pdf") {
      setMsg({ ok: false, text: "Certificate must be a PDF." });
      return;
    }
    setPending(true);
    setMsg(null);
    try {
      const url = await uploadToBucket("certificates", table, file);
      const res = await issueCertificate(table, row.id, url);
      if (!res.success) throw new Error(res.error);
      setMsg({ ok: true, text: "Certificate issued." });
      form.reset();
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Upload failed.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2 border-t border-white/5 pt-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Certificate
        </span>
        {row.certificate_issued && row.certificate_url ? (
          <span className="text-[11px] text-emerald-300">Issued ✓</span>
        ) : (
          <span className="text-[11px] text-gray-500">Not issued</span>
        )}
      </div>

      {row.certificate_issued && row.certificate_url && (
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={row.certificate_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-[#f43f5e] hover:bg-white/5"
          >
            View certificate ↗
          </a>
          <ActionButton
            label="Revoke"
            variant="danger"
            confirm="Remove this certificate?"
            onAction={() => revokeCertificate(table, row.id)}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          name="certificate"
          accept="application/pdf"
          className="text-xs text-gray-300 file:mr-2 file:rounded-md file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-xs file:text-white"
        />
        <SubmitButton pending={pending}>
          {row.certificate_issued ? "Replace PDF" : "Upload PDF"}
        </SubmitButton>
        {msg && (
          <span className={`text-xs ${msg.ok ? "text-emerald-400" : "text-red-400"}`}>
            {msg.text}
          </span>
        )}
      </form>

      {row.access_token && (
        <p className="text-[11px] text-gray-500">
          Tracking token:{" "}
          <span className="font-mono text-gray-300">{row.access_token}</span>
        </p>
      )}
    </div>
  );
}

function Row({ row, table }: { row: ReviewRow; table: "donators" | "sponsors" }) {
  const name =
    table === "donators"
      ? row.is_anonymous
        ? "Anonymous"
        : row.full_name
      : row.organization_name;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{name}</p>
          <p className="text-xs text-gray-400">
            {table === "sponsors" && row.contact_name ? `${row.contact_name} · ` : ""}
            {row.email} · {row.phone}
          </p>
        </div>
        <Badge status={row.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 sm:grid-cols-3">
        <span>
          <span className="text-gray-500">Amount:</span> ₹
          {Number(row.amount).toLocaleString("en-IN")}
        </span>
        {row.plan_type && (
          <span>
            <span className="text-gray-500">Plan:</span> {row.plan_type}
          </span>
        )}
        <span className="truncate">
          <span className="text-gray-500">Txn:</span> {row.transaction_ref}
        </span>
        <span>
          <span className="text-gray-500">Date:</span>{" "}
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {row.proofUrl ? (
          <a
            href={row.proofUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-[#f43f5e] hover:bg-white/5"
          >
            View payment proof ↗
          </a>
        ) : (
          <span className="text-xs text-gray-500">No proof on file</span>
        )}
        {row.status !== "verified" && (
          <ActionButton
            label="Approve"
            variant="success"
            onAction={() => moderateSubmission(table, row.id, "verified")}
          />
        )}
        {row.status !== "rejected" && (
          <ActionButton
            label="Reject"
            variant="danger"
            confirm="Reject this submission? It will be hidden from public pages."
            onAction={() => moderateSubmission(table, row.id, "rejected")}
          />
        )}
        {row.status !== "pending" && (
          <ActionButton
            label="Reset to pending"
            onAction={() => moderateSubmission(table, row.id, "pending")}
          />
        )}
      </div>

      {row.status === "verified" && <CertificateBlock row={row} table={table} />}
    </Card>
  );
}

export default function ReviewList({
  donators,
  sponsors,
}: {
  donators: ReviewRow[];
  sponsors: ReviewRow[];
}) {
  const [tab, setTab] = useState<"donators" | "sponsors">("donators");
  const rows = tab === "donators" ? donators : sponsors;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["donators", "sponsors"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t === "donators" ? "Donors" : "Sponsors"} (
            {t === "donators" ? donators.length : sponsors.length})
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No submissions.</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((r) => (
            <Row key={r.id} row={r} table={tab} />
          ))}
        </div>
      )}
    </div>
  );
}
