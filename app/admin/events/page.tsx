import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminUI";
import EventsManager, { type EventRow } from "@/components/admin/EventsManager";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("club_events")
    .select("id, title, description, location, poster_url, event_date")
    .order("event_date", { ascending: false });

  return (
    <div>
      <AdminHeader title="Events" subtitle="Create and manage club events shown on the public Events page." />
      <EventsManager events={(data ?? []) as EventRow[]} />
    </div>
  );
}
