"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface AstronomyEvent {
  id: string;
  title: string;
  event_date: string;
  description: string;
  location: string;
}

function getCountdown(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function AstronomyCalendar() {
  const [events, setEvents] = useState<AstronomyEvent[]>([]);
  const [nearestEvent, setNearestEvent] = useState<AstronomyEvent | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const placeholderEvents = useMemo<AstronomyEvent[]>(() => [
    { id: "1", title: "Total Lunar Eclipse", event_date: new Date(Date.now() + 5 * MS_PER_DAY).toISOString(), description: "Visible across South Asia", location: "Visible worldwide" },
    { id: "2", title: "Eta Aquariid Meteor Shower", event_date: new Date(Date.now() + 12 * MS_PER_DAY).toISOString(), description: "Peak activity expected", location: "Northern Hemisphere" },
    { id: "3", title: "Jupiter Opposition", event_date: new Date(Date.now() + 20 * MS_PER_DAY).toISOString(), description: "Best time to observe Jupiter", location: "Everywhere" },
  ], []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const { data } = await supabase
          .from("astronomy_events")
          .select("*")
          .gte("event_date", startOfMonth)
          .lte("event_date", endOfMonth)
          .order("event_date", { ascending: true });

        if (data && data.length > 0) {
          setEvents(data);
          const upcoming = data.find((e) => new Date(e.event_date) > now);
          if (upcoming) setNearestEvent(upcoming);
        }
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchEvents();
  }, []);

  const displayNearest = nearestEvent || placeholderEvents[0];

  useEffect(() => {
    const target = displayNearest;
    const interval = setInterval(() => {
      setCountdown(getCountdown(target.event_date));
    }, 1000);
    setCountdown(getCountdown(target.event_date));
    return () => clearInterval(interval);
  }, [displayNearest]);

  const displayEvents = events.length > 0 ? events : placeholderEvents;

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#38bdf8]/3 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <p
            className="text-xs tracking-[0.4em] text-[#38bdf8] mb-2 uppercase"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            — Celestial Events —
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            ASTRONOMY CALENDAR
          </h2>
          <p
            className="text-gray-500 text-sm mt-1"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            Events this month
          </p>
        </motion.div>

        {/* Nearest Event Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-[#38bdf8]/20 bg-[#07091a]/80 backdrop-blur-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                <span
                  className="text-[#38bdf8] text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  Next Astronomical Event
                </span>
              </div>
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {displayNearest.title}
              </h3>
              <p
                className="text-gray-400 text-sm mt-1"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                {displayNearest.location}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {[
                { val: countdown.days, label: "D" },
                { val: countdown.hours, label: "H" },
                { val: countdown.minutes, label: "M" },
                { val: countdown.seconds, label: "S" },
              ].map((t) => (
                <div key={t.label} className="text-center">
                  <div className="w-14 h-14 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center">
                    <span
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                    >
                      {String(t.val).padStart(2, "0")}
                    </span>
                  </div>
                  <span
                    className="text-[10px] text-gray-500 mt-1"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayEvents.slice(0, 3).map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-[#07091a]/60 backdrop-blur-sm p-5 hover:border-[#38bdf8]/30 transition-all"
            >
              <p
                className="text-[#38bdf8] text-xs mb-2"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                {new Date(event.event_date).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h4
                className="text-white font-bold text-sm mb-1"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {event.title}
              </h4>
              <p
                className="text-gray-500 text-xs"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                {event.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
