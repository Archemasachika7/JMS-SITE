"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface ClubEvent {
  id: string;
  title: string;
  event_date: string;
  description: string;
  location: string;
  poster_url: string;
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
  const [loading, setLoading] = useState(true);
  const [posterExpanded, setPosterExpanded] = useState(false);

  const defaultGradient = "radial-gradient(ellipse at 50% 50%, #1e3a5f 0%, #020617 100%)";

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
        // fetch failed silently
      }
      setLoading(false);
    }
    fetchNextEvent();
  }, []);

  useEffect(() => {
    if (!nextEvent) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(nextEvent.event_date));
    }, 1000);
    setCountdown(getCountdown(nextEvent.event_date));
    return () => clearInterval(interval);
  }, [nextEvent]);

  const eventDateObj = nextEvent ? new Date(nextEvent.event_date) : null;
  const isExpired = eventDateObj ? eventDateObj.getTime() <= Date.now() : false;

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e11d48]/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#e11d48]/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div>
            <p
              className="text-xs tracking-[0.4em] text-[#fb7185] mb-2 uppercase"
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
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/events">
              <motion.span
                className="text-xs sm:text-sm text-[#fb7185] border border-[#fb7185]/30 px-4 sm:px-5 py-2 rounded-full hover:bg-[#fb7185]/10 transition-all cursor-pointer whitespace-nowrap"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                whileHover={{ scale: 1.05 }}
              >
                View All Events
              </motion.span>
            </Link>
            <Link href="/events">
              <motion.span
                className="text-xs sm:text-sm text-gray-400 border border-white/10 px-4 sm:px-5 py-2 rounded-full hover:bg-white/5 transition-all cursor-pointer hidden md:inline-block whitespace-nowrap"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                whileHover={{ scale: 1.05 }}
              >
                Past Activities
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="rounded-2xl border border-[#e11d48]/20 bg-[#07091a]/80 backdrop-blur-sm p-6 md:p-8 animate-pulse">
            <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
              <div className="w-full rounded-xl bg-[#0f172a]" style={{ aspectRatio: "3/4" }} />
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex-1 w-full">
                    <div className="h-3 bg-[#0f172a] rounded w-1/4 mb-3" />
                    <div className="h-6 bg-[#0f172a] rounded w-2/3 mb-3" />
                    <div className="h-3 bg-[#0f172a] rounded w-1/3 mb-2" />
                    <div className="h-3 bg-[#0f172a] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#0f172a] rounded w-1/2" />
                  </div>
                  <div className="h-10 bg-[#0f172a] rounded w-32 shrink-0" />
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#0f172a]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : !nextEvent ? (
          <div className="rounded-2xl border border-white/10 bg-[#07091a]/60 py-16 text-center">
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              No upcoming events — stay tuned!
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-[#e11d48]/20 bg-[#07091a]/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
              {/* Event Poster */}
              <div
                className="relative overflow-hidden bg-[#020617] border-r border-[#e11d48]/10 cursor-pointer group"
                style={{ aspectRatio: "3/4", minHeight: "280px" }}
                onClick={() => setPosterExpanded(true)}
              >
                {nextEvent.poster_url ? (
                  <>
                    <img
                      src={nextEvent.poster_url}
                      alt={`${nextEvent.title} poster`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span
                        className="text-white text-xs bg-[#e11d48]/80 px-3 py-1 rounded-full"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        Click to enlarge
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center" style={{ background: defaultGradient }}>
                    {[...Array(30)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute rounded-full bg-white"
                        style={{
                          width: `${Math.random() * 2 + 0.5}px`,
                          height: `${Math.random() * 2 + 0.5}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.7 + 0.3,
                        }}
                      />
                    ))}
                    <span className="text-[#fb7185]/40 text-3xl">🔭</span>
                  </div>
                )}
              </div>

              {/* Event Details + Countdown */}
              <div className="flex flex-col gap-6 p-6 md:p-8">
                {/* Title & metadata */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#fb7185] animate-pulse" />
                      <span
                        className="text-[#fb7185] text-xs tracking-widest uppercase"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        {isExpired ? "Recent Event" : "Next Club Event"}
                      </span>
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-bold text-white mb-3"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                    >
                      {nextEvent.title}
                    </h3>
                    <div className="flex items-start gap-1.5 mb-2">
                      <span className="text-sm mt-0.5">📍</span>
                      <p
                        className="text-gray-300 text-sm"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        {nextEvent.location}
                      </p>
                    </div>
                    {nextEvent.description && (
                      <p
                        className="text-gray-400 text-sm leading-relaxed mt-2"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        {nextEvent.description}
                      </p>
                    )}
                  </div>

                  {/* Date badge */}
                  <div className="shrink-0 text-left md:text-right bg-[#0f172a]/80 border border-[#e11d48]/20 rounded-xl px-4 py-3">
                    <p
                      className="text-gray-500 text-xs mb-1"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      Event Date
                    </p>
                    <p
                      className="text-white font-bold text-base"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                    >
                      {new Date(nextEvent.event_date).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p
                      className="text-[#fb7185] text-xs mt-1"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      {new Date(nextEvent.event_date).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                      IST
                    </p>
                  </div>
                </div>

                {/* Countdown */}
                <div>
                  <p
                    className="text-xs text-gray-600 uppercase tracking-widest mb-3"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    {isExpired ? "Event has passed" : "Countdown"}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4">
                    {[
                      { val: countdown.days, label: "Days" },
                      { val: countdown.hours, label: "Hours" },
                      { val: countdown.minutes, label: "Min" },
                      { val: countdown.seconds, label: "Sec" },
                    ].map((t, i) => (
                      <div key={t.label} className="flex items-center gap-3 md:gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-b from-[#e11d48]/20 to-[#020617] border border-[#e11d48]/30 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.2)]">
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
                          <span className="text-2xl font-light text-[#e11d48] -mt-4">:</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto pt-2">
                  <Link href="/events">
                    <motion.button
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#e11d48]/30 to-[#fb7185]/20 border border-[#e11d48]/50 text-white text-sm font-medium hover:from-[#e11d48]/50 hover:to-[#fb7185]/30 hover:shadow-[0_0_24px_rgba(225,29,72,0.35)] transition-all duration-300"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Event Details →
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Poster lightbox */}
      {posterExpanded && nextEvent?.poster_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setPosterExpanded(false)}
        >
          <motion.img
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={nextEvent.poster_url}
            alt={nextEvent.title}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl font-light transition-colors"
            onClick={() => setPosterExpanded(false)}
          >
            ✕
          </button>
        </motion.div>
      )}
    </section>
  );
}
