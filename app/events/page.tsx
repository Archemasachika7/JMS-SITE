"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  poster: string;
}

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<ClubEvent[]>([]);
  const [past, setPast] = useState<ClubEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const now = new Date().toISOString();

        const { data: upcomingData } = await supabase
          .from("club_events")
          .select("*")
          .gte("date", now)
          .order("date", { ascending: true });

        const { data: pastData } = await supabase
          .from("club_events")
          .select("*")
          .lt("date", now)
          .order("date", { ascending: false });

        if (upcomingData) setUpcoming(upcomingData);
        if (pastData) setPast(pastData);
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchEvents();
  }, []);

  const placeholderUpcoming: (ClubEvent & { gradient: string })[] = [
    { id: "1", title: "Lyrid Meteor Shower Night", date: new Date(Date.now() + 10 * 86400000).toISOString(), description: "Observe the annual Lyrid meteor shower from campus.", location: "JU Rooftop Observatory", poster: "", gradient: "radial-gradient(ellipse at 50% 50%, #4c1d95 0%, #020617 100%)" },
    { id: "2", title: "Solar Observation Day", date: new Date(Date.now() + 20 * 86400000).toISOString(), description: "Safe solar viewing with H-alpha filters.", location: "JU Main Ground", poster: "", gradient: "radial-gradient(ellipse at 50% 50%, #78350f 0%, #020617 100%)" },
  ];

  const placeholderPast: (ClubEvent & { gradient: string })[] = [
    { id: "3", title: "Winter Stargazing Camp", date: "2025-01-15T19:00:00", description: "A night under the winter skies with hot chocolate.", location: "JU Campus", poster: "", gradient: "radial-gradient(ellipse at 50% 50%, #164e63 0%, #020617 100%)" },
    { id: "4", title: "Telescope Workshop", date: "2024-12-10T15:00:00", description: "Hands-on workshop on telescope assembly and usage.", location: "Physics Lab", poster: "", gradient: "radial-gradient(ellipse at 50% 50%, #065f46 0%, #020617 100%)" },
  ];

  const displayUpcoming = upcoming.length > 0 ? upcoming : placeholderUpcoming;
  const displayPast = past.length > 0 ? past : placeholderPast;

  const gradients = [
    "radial-gradient(ellipse at 50% 50%, #4c1d95 0%, #020617 100%)",
    "radial-gradient(ellipse at 50% 50%, #78350f 0%, #020617 100%)",
    "radial-gradient(ellipse at 50% 50%, #164e63 0%, #020617 100%)",
    "radial-gradient(ellipse at 50% 50%, #065f46 0%, #020617 100%)",
  ];

  function renderEventCard(event: ClubEvent | (ClubEvent & { gradient: string }), i: number, isPlaceholder: boolean) {
    const gradient = isPlaceholder
      ? (event as ClubEvent & { gradient: string }).gradient
      : gradients[i % gradients.length];

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.1 }}
        whileHover={{ y: -4 }}
        className="group rounded-2xl overflow-hidden border border-white/10 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#7c3aed]/40 transition-all"
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {event.poster ? (
            <img
              src={event.poster}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full" style={{ background: gradient }}>
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
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            {event.title}
          </h3>
          <p
            className="text-[#22d3ee] text-xs mb-2"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {new Date(event.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            📍 {event.location}
          </p>
          <p
            className="text-gray-500 text-sm"
            style={{ fontFamily: "'Space Mono', monospace" }}
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
              className="text-xs tracking-[0.4em] text-[#22d3ee] mb-2 uppercase"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              — Club Activities —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              EVENTS
            </h1>
          </motion.div>

          {/* Upcoming */}
          <div className="mb-16">
            <h2
              className="text-xl font-bold text-white mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayUpcoming.map((event, i) =>
                renderEventCard(event, i, upcoming.length === 0)
              )}
            </div>
          </div>

          {/* Past */}
          <div>
            <h2
              className="text-xl font-bold text-gray-400 mb-6"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
              {displayPast.map((event, i) =>
                renderEventCard(event, i, past.length === 0)
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
