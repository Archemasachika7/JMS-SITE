import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader, Card } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

type LogRow = {
  id: string;
  actor_email: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  details: string | null;
  created_at: string;
};

/** Colour the verb chip by the kind of action. */
function actionClass(action: string): string {
  const a = action.toLowerCase();
  if (a.includes("approv") || a.includes("issued") || a.includes("open"))
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  if (a.includes("reject") || a.includes("delete") || a.includes("revok") || a.includes("clos"))
    return "bg-red-500/15 text-red-300 border-red-500/30";
  if (a.includes("upload") || a.includes("creat"))
    return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
  return "bg-white/10 text-gray-300 border-white/15";
}

export default async function AdminLogsPage() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_logs")
    .select("id, actor_email, action, entity, entity_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const logs = (data ?? []) as LogRow[];

  return (
    <div>
      <AdminHeader
        title="Activity Logs"
        subtitle="A permanent, append-only record of every admin action. Entries can never be edited or deleted — not even by an admin."
      />

      {error && (
        <Card className="mb-4 border-amber-500/30">
          <p className="text-sm text-amber-300">
            Could not load logs: {error.message}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            If the <code>admin_logs</code> table does not exist yet, run
            <code> supabase/07_admin_logs.sql</code> in the Supabase SQL editor.
          </p>
        </Card>
      )}

      {logs.length === 0 && !error ? (
        <p className="text-sm text-gray-500">No activity recorded yet.</p>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Admin</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Area</th>
                <th className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((l) => (
                <tr key={l.id} className="align-top hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                    {new Date(l.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">
                    {l.actor_email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${actionClass(
                        l.action
                      )}`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {l.entity || "—"}
                    {l.entity_id && (
                      <span className="block font-mono text-[10px] text-gray-600">
                        {l.entity_id}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">
                    {l.details || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
