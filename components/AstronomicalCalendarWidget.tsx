"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface AstronomicalCalendarWidgetProps {
  preview?: boolean;
}

interface AstronomyEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
}

function getCountdown(eventDate: string): string {
  const now = new Date();
  const target = new Date(eventDate);
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return "Ongoing";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AstronomicalCalendarWidget({ preview = false }: AstronomicalCalendarWidgetProps) {
  const [events, setEvents] = useState<AstronomyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    async function fetchEvents() {
      let fetched = false;

      // Try fetching from the astronomy-events API first
      try {
        const res = await fetch("/api/astronomy-events");
        if (res.ok) {
          const json = await res.json();
          if (json.events && json.events.length > 0) {
            setEvents(json.events);
            fetched = true;
          }
        }
      } catch {
        // API fetch failed, will try Supabase
      }

      // Fallback to Supabase if API returned no events
      if (!fetched) {
        try {
          const { data } = await supabase
            .from("astronomy_events")
            .select("id, title, description, event_date")
            .order("event_date", { ascending: true });
          if (data) setEvents(data);
        } catch {
          // Supabase fetch failed silently
        }
      }

      setLoading(false);
    }
    fetchEvents();
  }, []);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.event_date) >= now).slice(0, 3);
  const pastEvents = events.filter((e) => new Date(e.event_date) < now);
  const nextEvent = upcomingEvents[0] || null;

  if (loading) {
    return (
      <div className={`rounded-xl border border-[#1f2937] bg-[#0f172a] ${preview ? "p-4" : "p-6"} animate-pulse`}>
        <div className="h-4 bg-[#1f2937] rounded w-1/3 mb-3" />
        <div className="h-6 bg-[#1f2937] rounded w-2/3 mb-4" />
        {!preview && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-[#1f2937] rounded" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-xl border border-[#1f2937] bg-[#0f172a]/80 p-5 hover:border-[#38bdf8]/30 transition-all"
      >
        <p
          className="text-xs tracking-[0.3em] text-[#38bdf8] mb-2 uppercase"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
        >
          Next Event
        </p>
        {nextEvent ? (
          <div>
            <h3
              className="text-lg font-bold text-white truncate"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              {nextEvent.title}
            </h3>
            <p
              className="text-sm text-[#e5e7eb]/70 mt-1"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              {formatEventDate(nextEvent.event_date)}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span
                className="text-sm font-semibold text-[#10b981]"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {getCountdown(nextEvent.event_date)}
              </span>
            </div>
          </div>
        ) : (
          <p
            className="text-sm text-[#e5e7eb]/50"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            No astronomical events scheduled.
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="rounded-xl border border-[#1f2937] bg-[#0f172a]/80 p-8"
    >
      <p
        className="text-xs tracking-[0.4em] text-[#38bdf8] mb-2 uppercase"
        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
      >
        — Astronomical Calendar —
      </p>
      <h2
        className="text-2xl md:text-3xl font-bold text-white mb-8"
        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
      >
        UPCOMING EVENTS
      </h2>

      {events.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#07091a]/60 py-16 text-center">
          <p
            className="text-gray-500 text-sm"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            No astronomical events scheduled.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[#38bdf8]/60 via-[#38bdf8]/30 to-transparent" />

          <div className="space-y-4">
            {/* Upcoming events */}
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex gap-4 items-start"
              >
                {/* Timeline dot */}
                <div className="relative z-10 mt-2 flex-shrink-0">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#38bdf8] border-2 border-[#0f172a] shadow-[0_0_8px_2px_rgba(56,189,248,0.4)]" />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#38bdf8]/40"
                    style={{ width: 14, height: 14, top: -2, left: -2 }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Event card */}
                <div className="flex-1 rounded-lg bg-[#020617]/60 border border-[#1f2937] hover:border-[#38bdf8]/30 transition-all p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-base font-bold text-white"
                        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                      >
                        {event.title}
                      </h3>
                      <p
                        className="text-xs text-[#38bdf8] mt-1"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        {formatEventDate(event.event_date)}
                      </p>
                      {event.description && (
                        <p
                          className="text-sm text-[#e5e7eb]/60 mt-2 line-clamp-2"
                          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                        >
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span
                        className="inline-block text-xs font-semibold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-3 py-1"
                        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                      >
                        {getCountdown(event.event_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Past events */}
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (upcomingEvents.length + i) * 0.1 }}
                className="relative flex gap-4 items-start opacity-40"
              >
                {/* Timeline dot (dimmed) */}
                <div className="relative z-10 mt-2 flex-shrink-0">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#1f2937] border-2 border-[#0f172a]" />
                </div>

                {/* Event card (dimmed) */}
                <div className="flex-1 rounded-lg bg-[#020617]/30 border border-[#1f2937]/50 p-4">
                  <h3
                    className="text-base font-bold text-[#e5e7eb]/50"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="text-xs text-[#e5e7eb]/30 mt-1"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    {formatEventDate(event.event_date)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
