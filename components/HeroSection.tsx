"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/siteConfig";

const SolarSystem3D = dynamic(() => import("@/components/SolarSystem3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#f59e0b]/30 to-[#0c1e3d] animate-pulse" />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 60%, #0a1628 0%, #020617 60%)" }}
    >
      {/* Nebula glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563eb]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#38bdf8]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2563eb]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content - Left/Right Split */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-24 lg:pt-0">
        {/* Left side: Text content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center lg:justify-start gap-3 mb-6"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#2563eb]" />
            <span className="text-xs tracking-[0.4em] text-[#38bdf8] uppercase" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>
              {siteConfig.university}
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#2563eb]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-6 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            <span className="bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">ASTRO</span>
            <span className="bg-gradient-to-br from-[#2563eb] to-[#10b981] bg-clip-text text-transparent">SCI</span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 tracking-widest">CLUB</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-gray-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            A community exploring the universe through observation, research, and curiosity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <motion.a
              href="#events"
              className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-semibold text-xs sm:text-sm tracking-wider overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.7)] transition-all duration-300 whitespace-nowrap"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">Explore Events</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.a>

            <motion.a
              href="#join"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-[#38bdf8]/40 text-[#38bdf8] font-semibold text-xs sm:text-sm tracking-wider hover:bg-[#38bdf8]/10 hover:border-[#38bdf8] hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300 whitespace-nowrap"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Join the Club
            </motion.a>
          </motion.div>
        </div>

        {/* Right side: 3D Planet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative h-[300px] sm:h-[400px] lg:h-[500px]"
        >
          {/* Floating particles around planet */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { top: 25, left: 30, opacity: 0.5, dur: 3.5, delay: 0.2 },
              { top: 40, left: 65, opacity: 0.7, dur: 4.2, delay: 0.8 },
              { top: 55, left: 45, opacity: 0.6, dur: 5.0, delay: 1.5 },
              { top: 30, left: 70, opacity: 0.4, dur: 3.8, delay: 0.4 },
              { top: 60, left: 35, opacity: 0.8, dur: 6.0, delay: 1.0 },
              { top: 45, left: 55, opacity: 0.5, dur: 4.5, delay: 1.8 },
              { top: 35, left: 50, opacity: 0.6, dur: 5.5, delay: 0.6 },
              { top: 70, left: 60, opacity: 0.4, dur: 3.2, delay: 1.2 },
              { top: 28, left: 42, opacity: 0.7, dur: 4.8, delay: 0.3 },
              { top: 50, left: 75, opacity: 0.5, dur: 5.8, delay: 1.6 },
              { top: 65, left: 28, opacity: 0.6, dur: 3.6, delay: 0.9 },
              { top: 38, left: 68, opacity: 0.4, dur: 4.0, delay: 1.4 },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#93c5fd]"
                style={{
                  top: `${p.top}%`,
                  left: `${p.left}%`,
                  opacity: p.opacity,
                  animation: `float ${p.dur}s ease-in-out infinite ${p.delay}s`,
                }}
              />
            ))}
          </div>
          <SolarSystem3D />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-gray-600 tracking-widest uppercase" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent" style={{ animation: "pulse 2s ease-in-out infinite" }} />
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
