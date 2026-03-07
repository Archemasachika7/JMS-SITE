"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface AstronomyEvent {
  id: string;
  title: string;
  date: string;
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

  useEffect(() => {
    async function fetchEvents() {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const { data } = await supabase
          .from("astronomy_events")
          .select("*")
          .gte("date", startOfMonth)
          .lte("date", endOfMonth)
          .order("date", { ascending: true });

        if (data && data.length > 0) {
          setEvents(data);
          const upcoming = data.find((e) => new Date(e.date) > now);
          if (upcoming) setNearestEvent(upcoming);
        }
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!nearestEvent) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(nearestEvent.date));
    }, 1000);
    setCountdown(getCountdown(nearestEvent.date));
    return () => clearInterval(interval);
  }, [nearestEvent]);

  const placeholderEvents: AstronomyEvent[] = [
    { id: "1", title: "Total Lunar Eclipse", date: new Date(Date.now() + 5 * 86400000).toISOString(), description: "Visible across South Asia", location: "Visible worldwide" },
    { id: "2", title: "Eta Aquariid Meteor Shower", date: new Date(Date.now() + 12 * 86400000).toISOString(), description: "Peak activity expected", location: "Northern Hemisphere" },
    { id: "3", title: "Jupiter Opposition", date: new Date(Date.now() + 20 * 86400000).toISOString(), description: "Best time to observe Jupiter", location: "Everywhere" },
  ];

  const displayEvents = events.length > 0 ? events : placeholderEvents;
  const displayNearest = nearestEvent || placeholderEvents[0];
  const displayCountdown = nearestEvent ? countdown : getCountdown(placeholderEvents[0].date);

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#22d3ee]/3 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <p
            className="text-xs tracking-[0.4em] text-[#22d3ee] mb-2 uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            — Celestial Events —
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            ASTRONOMY CALENDAR
          </h2>
          <p
            className="text-gray-500 text-sm mt-1"
            style={{ fontFamily: "'Space Mono', monospace" }}
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
          className="rounded-2xl border border-[#22d3ee]/20 bg-[#07091a]/80 backdrop-blur-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
                <span
                  className="text-[#22d3ee] text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  Next Astronomical Event
                </span>
              </div>
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                {displayNearest.title}
              </h3>
              <p
                className="text-gray-400 text-sm mt-1"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {displayNearest.location}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {[
                { val: displayCountdown.days, label: "D" },
                { val: displayCountdown.hours, label: "H" },
                { val: displayCountdown.minutes, label: "M" },
                { val: displayCountdown.seconds, label: "S" },
              ].map((t) => (
                <div key={t.label} className="text-center">
                  <div className="w-14 h-14 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center">
                    <span
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Orbitron', monospace" }}
                    >
                      {String(t.val).padStart(2, "0")}
                    </span>
                  </div>
                  <span
                    className="text-[10px] text-gray-500 mt-1"
                    style={{ fontFamily: "'Space Mono', monospace" }}
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
              className="rounded-xl border border-white/10 bg-[#07091a]/60 backdrop-blur-sm p-5 hover:border-[#22d3ee]/30 transition-all"
            >
              <p
                className="text-[#22d3ee] text-xs mb-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {new Date(event.date).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h4
                className="text-white font-bold text-sm mb-1"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                {event.title}
              </h4>
              <p
                className="text-gray-500 text-xs"
                style={{ fontFamily: "'Space Mono', monospace" }}
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
