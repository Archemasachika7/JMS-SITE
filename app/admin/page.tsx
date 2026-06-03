import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader, Card } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

async function count(table: string, filter?: { col: string; val: string }) {
  const supabase = createSupabaseServerClient();
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) q = q.eq(filter.col, filter.val);
  const { count: c } = await q;
  return c ?? 0;
}

export default async function AdminOverview() {
  const [pendingDonors, pendingSponsors, problems, events, gallery, members] =
    await Promise.all([
      count("donators", { col: "status", val: "pending" }),
      count("sponsors", { col: "status", val: "pending" }),
      count("problems"),
      count("club_events"),
      count("gallery"),
      count("profiles"),
    ]);

  const stats = [
    { label: "Donors awaiting review", value: pendingDonors, href: "/admin/review", accent: "text-amber-300" },
    { label: "Sponsors awaiting review", value: pendingSponsors, href: "/admin/review", accent: "text-amber-300" },
    { label: "Problems published", value: problems, href: "/admin/problems", accent: "text-[#f43f5e]" },
    { label: "Events", value: events, href: "/admin/events", accent: "text-[#f43f5e]" },
    { label: "Gallery images", value: gallery, href: "/admin/gallery", accent: "text-[#f43f5e]" },
    { label: "Registered members", value: members, href: "/admin/subscriptions", accent: "text-[#fb7185]" },
  ];

  return (
    <div>
      <AdminHeader
        title="Admin Overview"
        subtitle="Manage everything that appears on the JU Maths Society site. This area is hidden and only reachable by manually-promoted admins."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition hover:border-white/25">
              <p className={`text-3xl font-bold ${s.accent}`}>{s.value}</p>
              <p className="mt-1 text-sm text-gray-400">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          How to promote an admin
        </h2>
        <p className="text-sm text-gray-400">
          Admin access is granted manually for security. In the Supabase SQL
          editor, run:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-[#0b1220] p-3 text-xs text-emerald-300">
{`update profiles set role = 'admin'
where id = (select id from auth.users where email = 'person@example.com');`}
        </pre>
      </Card>
    </div>
  );
}
