"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoonPhaseWidget from "@/components/MoonPhaseWidget";
import ISSTrackerWidget from "@/components/ISSTrackerWidget";
import AstronomicalCalendarWidget from "@/components/AstronomicalCalendarWidget";
import { motion } from "framer-motion";

export default function AstronomyPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-xs tracking-[0.4em] text-[#38bdf8] mb-3 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Live Data —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              ASTRONOMY TOOLS
            </h1>
            <p
              className="text-[#e5e7eb]/60 mt-4 max-w-lg mx-auto"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              Real-time celestial data, moon phases, and astronomical events — all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Widgets */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Moon Phase & ISS Tracker side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MoonPhaseWidget />
            <ISSTrackerWidget />
          </div>

          {/* Astronomical Calendar full width */}
          <AstronomicalCalendarWidget />
        </div>
      </section>

      <Footer />
    </main>
  );
}
