"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConstellationMap2D from "@/components/ConstellationMap2D";

const legendItems = [
  { color: "#ADD8E6", label: "Free Member" },
  { color: "#FFD700", label: "Monthly Subscriber" },
  { color: "#FF8C00", label: "Annual Subscriber" },
  { color: "#FF00FF", label: "Core Team" },
];

export default function MembersPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      {/* Intro Section */}
      <section className="pt-28 pb-6 px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p
            className="text-xs tracking-[0.4em] text-[#22d3ee] mb-3 uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            — Explore Our Community —
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-[#22d3ee] to-[#7c3aed] bg-clip-text text-transparent"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            AstroSci Constellation Map
          </h1>
          <p
            className="text-gray-400 mt-3 text-sm md:text-base max-w-xl mx-auto"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Each member is a star in our constellation map. Hover over stars
            to discover member identities.
          </p>
        </motion.div>
      </section>

      {/* Constellation Map + Legend */}
      <section className="relative px-4 md:px-6 pb-10">
        <div className="max-w-7xl mx-auto relative">
          {/* Legend Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute top-4 right-4 z-20 rounded-xl border border-white/10 bg-[#07091a]/80 backdrop-blur-md p-4"
          >
            <p
              className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-3"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Star Legend
            </p>
            <div className="flex flex-col gap-2">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 6px ${item.color}80`,
                    }}
                  />
                  <span
                    className="text-gray-300 text-xs"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Star Map Canvas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full rounded-2xl border border-white/10 bg-[#020617]/60 backdrop-blur-sm overflow-hidden"
            style={{ height: "calc(100vh - 260px)", minHeight: 400 }}
          >
            <ConstellationMap2D />
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
