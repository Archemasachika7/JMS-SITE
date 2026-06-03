"use client";

import { useState, useTransition } from "react";
import { updateMemberStatus } from "@/app/actions/admin";

export type MemberRow = {
  id: string;
  name: string | null;
  email: string | null;
  department: string | null;
  year: string | null;
  plan: string;
  role: string;
  created_at: string;
};

const PLANS = ["free", "monthly", "annual"];
const ROLES = ["member", "core", "admin"];

function MemberRowItem({ m }: { m: MemberRow }) {
  const [plan, setPlan] = useState(m.plan);
  const [role, setRole] = useState(m.role);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState<null | boolean>(null);

  const dirty = plan !== m.plan || role !== m.role;
  const selCls =
    "rounded-md border border-white/10 bg-[#0b1220] px-2 py-1 text-xs text-white focus:border-[#f43f5e]/60 focus:outline-none";

  return (
    <tr className="border-b border-white/5">
      <td className="px-3 py-2">
        <p className="font-medium text-white">{m.name || "—"}</p>
        <p className="text-xs text-gray-500">{m.email}</p>
      </td>
      <td className="px-3 py-2 text-xs text-gray-400">
        {m.department || "—"}
        {m.year ? ` · ${m.year}` : ""}
      </td>
      <td className="px-3 py-2">
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className={selCls}>
          {PLANS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2">
        <select value={role} onChange={(e) => setRole(e.target.value)} className={selCls}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2">
        <button
          disabled={!dirty || pending}
          onClick={() =>
            start(async () => {
              const res = await updateMemberStatus(m.id, plan, role);
              setSaved(res.success);
              setTimeout(() => setSaved(null), 2500);
            })
          }
          className="rounded-md bg-gradient-to-r from-[#f43f5e] to-[#fb7185] px-3 py-1 text-xs font-semibold text-[#02040a] disabled:opacity-30"
        >
          {pending ? "…" : "Save"}
        </button>
        {saved === true && <span className="ml-2 text-xs text-emerald-400">✓</span>}
        {saved === false && <span className="ml-2 text-xs text-red-400">!</span>}
      </td>
    </tr>
  );
}

export default function SubscriptionsManager({ members }: { members: MemberRow[] }) {
  const [q, setQ] = useState("");
  const filtered = members.filter((m) =>
    `${m.name ?? ""} ${m.email ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or email…"
        className="mb-4 w-full max-w-sm rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#f43f5e]/60 focus:outline-none"
      />
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[#0b1220] text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">Member</th>
              <th className="px-3 py-2 font-medium">Dept / Year</th>
              <th className="px-3 py-2 font-medium">Plan</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <MemberRowItem key={m.id} m={m} />
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No members found.</p>
      )}
    </div>
  );
}
