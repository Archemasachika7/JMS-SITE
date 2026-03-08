"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface ClubEvent {
  id: string;
  title: string;
  event_date: string;
  description: string;
  location: string;
  poster: string;
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

export default function ClubEventsSection() {
  const [nextEvent, setNextEvent] = useState<ClubEvent | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const placeholder = useMemo<ClubEvent>(() => ({
    id: "1",
    title: "Lyrid Meteor Shower Night",
    event_date: new Date(Date.now() + 10 * MS_PER_DAY).toISOString(),
    description: "Join us for an unforgettable night of meteor watching from the JU campus rooftop.",
    location: "JU Campus Rooftop Observatory",
    poster: "",
  }), []);

  useEffect(() => {
    async function fetchNextEvent() {
      try {
        const { data } = await supabase
          .from("club_events")
          .select("*")
          .gte("event_date", new Date().toISOString())
          .order("event_date", { ascending: true })
          .limit(1)
          .single();
        if (data) setNextEvent(data);
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchNextEvent();
  }, []);

  const displayEvent = nextEvent || placeholder;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(displayEvent.event_date));
    }, 1000);
    setCountdown(getCountdown(displayEvent.event_date));
    return () => clearInterval(interval);
  }, [displayEvent.event_date]);

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563eb]/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[#2563eb]/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p
              className="text-xs tracking-[0.4em] text-[#38bdf8] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Club Activities —
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              CLUB EVENTS
            </h2>
          </div>
          <div className="flex gap-3">
            <Link href="/events">
              <motion.span
                className="text-sm text-[#38bdf8] border border-[#38bdf8]/30 px-5 py-2 rounded-full hover:bg-[#38bdf8]/10 transition-all cursor-pointer"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                whileHover={{ scale: 1.05 }}
              >
                View Events
              </motion.span>
            </Link>
            <Link href="/events">
              <motion.span
                className="text-sm text-gray-400 border border-white/10 px-5 py-2 rounded-full hover:bg-white/5 transition-all cursor-pointer hidden md:inline-block"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                whileHover={{ scale: 1.05 }}
              >
                Past Activities
              </motion.span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl border border-[#2563eb]/20 bg-[#07091a]/80 backdrop-blur-sm p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                <span
                  className="text-[#38bdf8] text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  Next Club Event
                </span>
              </div>
              <h3
                className="text-xl md:text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {displayEvent.title}
              </h3>
              <p
                className="text-gray-400 text-sm mb-1"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                📍 {displayEvent.location}
              </p>
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                {displayEvent.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-gray-500 text-xs mb-1"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                Event Date
              </p>
              <p
                className="text-white font-semibold"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {new Date(displayEvent.event_date).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            {[
              { val: countdown.days, label: "Days" },
              { val: countdown.hours, label: "Hours" },
              { val: countdown.minutes, label: "Min" },
              { val: countdown.seconds, label: "Sec" },
            ].map((t, i) => (
              <div key={t.label} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-b from-[#2563eb]/20 to-[#020617] border border-[#2563eb]/30 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                    <motion.span
                      key={t.val}
                      initial={{ opacity: 0.5, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-2xl md:text-3xl font-black text-white"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                    >
                      {String(t.val).padStart(2, "0")}
                    </motion.span>
                  </div>
                  <span
                    className="text-xs text-gray-500 mt-1 block"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    {t.label}
                  </span>
                </div>
                {i < 3 && (
                  <span className="text-2xl font-light text-[#2563eb] -mt-4">:</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
