"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

interface ClubEvent {
  id: string;
  title: string;
  event_date: string;
  description: string;
  location: string;
  poster: string;
}

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<ClubEvent[]>([]);
  const [past, setPast] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultGradient = "radial-gradient(ellipse at 50% 50%, #1e3a5f 0%, #020617 100%)";

  useEffect(() => {
    async function fetchEvents() {
      try {
        const now = new Date().toISOString();

        const { data: upcomingData } = await supabase
          .from("club_events")
          .select("*")
          .gte("event_date", now)
          .order("event_date", { ascending: true });

        const { data: pastData } = await supabase
          .from("club_events")
          .select("*")
          .lt("event_date", now)
          .order("event_date", { ascending: false });

        if (upcomingData) setUpcoming(upcomingData);
        if (pastData) setPast(pastData);
      } catch {
        // Supabase fetch failed silently
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  function renderEventCard(event: ClubEvent, i: number) {
    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.1 }}
        whileHover={{ y: -4 }}
        className="group rounded-2xl overflow-hidden border border-white/10 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#2563eb]/40 transition-all"
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {event.poster ? (
            <img
              src={event.poster}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full" style={{ background: defaultGradient }}>
              {[...Array(20)].map((_, j) => (
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
            </div>
          )}
        </div>
        <div className="p-5">
          <h3
            className="text-white font-bold text-base mb-1"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            {event.title}
          </h3>
          <p
            className="text-[#38bdf8] text-xs mb-2"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            {new Date(event.event_date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            📍 {event.location}
          </p>
          <p
            className="text-gray-500 text-sm"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            {event.description}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs tracking-[0.4em] text-[#38bdf8] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Club Activities —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              EVENTS
            </h1>
          </motion.div>

          {/* Upcoming */}
          <div className="mb-16">
            <h2
              className="text-xl font-bold text-white mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
              Upcoming Events
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-[#07091a]/80 animate-pulse">
                    <div className="w-full bg-[#0f172a]" style={{ aspectRatio: "16/9" }} />
                    <div className="p-5">
                      <div className="h-4 bg-[#0f172a] rounded w-3/4 mb-2" />
                      <div className="h-3 bg-[#0f172a] rounded w-1/2 mb-2" />
                      <div className="h-3 bg-[#0f172a] rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#07091a]/60 py-16 text-center">
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  No upcoming events — stay tuned!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map((event, i) => renderEventCard(event, i))}
              </div>
            )}
          </div>

          {/* Past */}
          <div>
            <h2
              className="text-xl font-bold text-gray-400 mb-6"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Past Events
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-[#07091a]/80 animate-pulse">
                    <div className="w-full bg-[#0f172a]" style={{ aspectRatio: "16/9" }} />
                    <div className="p-5">
                      <div className="h-4 bg-[#0f172a] rounded w-3/4 mb-2" />
                      <div className="h-3 bg-[#0f172a] rounded w-1/2 mb-2" />
                      <div className="h-3 bg-[#0f172a] rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : past.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#07091a]/60 py-16 text-center opacity-80">
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  No past events yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                {past.map((event, i) => renderEventCard(event, i))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
