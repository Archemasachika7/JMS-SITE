import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/logs", label: "Activity Logs" },
  { href: "/admin/review", label: "Donor / Sponsor Review" },
  { href: "/admin/subscriptions", label: "Student Subscriptions" },
  { href: "/admin/recruitment", label: "Recruitment" },
  { href: "/admin/problems", label: "Problems" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/potw", label: "POTW" },
  { href: "/admin/magazine", label: "Magazine" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  // Hidden section: anyone who is not a manually-promoted admin is bounced
  // back to the homepage. There is no link to /admin anywhere in the public UI.
  if (!admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#0b1220] p-5 sticky top-0 h-screen">
          <Link href="/" className="mb-6 block">
            <span
              className="text-lg font-bold bg-gradient-to-r from-[#f43f5e] to-[#fb7185] bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              JMS Admin
            </span>
            <p className="text-[11px] text-gray-500">JU Maths Society</p>
          </Link>
          <nav className="flex flex-col gap-1 text-sm">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-lg px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-6 text-xs text-gray-500">
            <p className="truncate">Signed in as</p>
            <p className="truncate text-gray-300">{admin.email}</p>
            <Link href="/" className="mt-3 inline-block text-[#f43f5e] hover:underline">
              ← Back to site
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Mobile top nav */}
          <div className="md:hidden flex gap-2 overflow-x-auto border-b border-white/10 bg-[#0b1220] p-3 text-xs">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 text-gray-300"
              >
                {s.label}
              </Link>
            ))}
          </div>
          <div className="p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
