"use client";

import { useState } from "react";
import { Card, ActionButton } from "@/components/admin/AdminUI";
import { moderateSubmission } from "@/app/actions/admin";

export type ReviewRow = {
  id: string;
  status: string;
  amount: number;
  email: string;
  phone: string;
  transaction_ref: string;
  created_at: string;
  proofUrl: string | null;
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
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-[#22d3ee] hover:bg-white/5"
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
