"use client";
import { motion } from "framer-motion";

function MoonWidget() {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-2xl border border-[#7c3aed]/20 bg-[#07091a]/80 p-6 hover:border-[#7c3aed]/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.15)] transition-all duration-400 cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
        <p className="text-xs text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>Live Data</p>
      </div>
      <div className="flex flex-col items-center gap-4 mb-5">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-[#7c3aed]/10 blur-xl" />
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden"
            style={{ background: "radial-gradient(circle at 35% 35%, #d1d5db, #6b7280, #374151)" }}
          >
            <div className="absolute top-6 left-8 w-4 h-4 rounded-full bg-black/20" />
            <div className="absolute bottom-8 right-6 w-3 h-3 rounded-full bg-black/15" />
            <div className="absolute top-12 right-8 w-2 h-2 rounded-full bg-black/20" />
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(ellipse at 70% 50%, transparent 40%, rgba(2,6,23,0.7) 70%)" }}
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg" style={{ fontFamily: "'Orbitron', monospace" }}>Waxing Gibbous</p>
          <p className="text-[#22d3ee] text-sm mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>78% Illuminated</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
        <div>
          <p className="text-gray-600 text-xs mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Moonrise</p>
          <p className="text-white text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>14:32 IST</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Moonset</p>
          <p className="text-white text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>03:18 IST</p>
        </div>
      </div>
      <h3 className="text-center text-lg font-bold text-white mt-4" style={{ fontFamily: "'Orbitron', monospace" }}>Moon Phase</h3>
    </motion.div>
  );
}

function ISSWidget() {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-2xl border border-[#22d3ee]/20 bg-[#07091a]/80 p-6 hover:border-[#22d3ee]/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] transition-all duration-400 cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[#22d3ee] animate-ping absolute" />
        <div className="w-2 h-2 rounded-full bg-[#22d3ee]" />
        <p className="text-xs text-gray-500 tracking-widest uppercase ml-3" style={{ fontFamily: "'Space Mono', monospace" }}>Tracking Active</p>
      </div>
      <div
        className="w-full h-32 rounded-xl mb-4 relative overflow-hidden border border-[#22d3ee]/10"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #051a2e 0%, #020617 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(34,211,238,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 border border-[#22d3ee]/30 rounded-full" style={{ transform: "translate(-50%, -50%) rotate(-30deg)" }} />
        <div className="absolute top-1/3 left-2/3 w-3 h-3 rounded-full bg-[#22d3ee] shadow-[0_0_10px_#22d3ee]" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
        <div className="absolute bottom-2 left-3 text-[#22d3ee]/50 text-[9px]" style={{ fontFamily: "'Space Mono', monospace" }}>LIVE ORBIT TRACKER</div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-gray-600 text-xs mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Altitude</p>
          <p className="text-white text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>408 km</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Speed</p>
          <p className="text-white text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>27,600 km/h</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Over</p>
          <p className="text-[#22d3ee] text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>Indian Ocean</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Next Pass</p>
          <p className="text-white text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>21:14 IST</p>
        </div>
      </div>
      <h3 className="text-center text-lg font-bold text-white" style={{ fontFamily: "'Orbitron', monospace" }}>ISS Tracker</h3>
    </motion.div>
  );
}

function MeteorWidget() {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-2xl border border-[#f59e0b]/20 bg-[#07091a]/80 p-6 hover:border-[#f59e0b]/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-400 cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
        <p className="text-xs text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>Upcoming Event</p>
      </div>
      <div
        className="w-full h-28 rounded-xl mb-4 relative overflow-hidden border border-[#f59e0b]/10 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a0800 0%, #020617 100%)" }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-[#f59e0b] to-transparent rounded-full opacity-70"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 60}%`,
              transform: `rotate(${-30 + Math.random() * 20}deg)`,
            }}
          />
        ))}
        <span className="text-4xl relative z-10">☄️</span>
      </div>
      <div className="text-center mb-4">
        <p className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'Orbitron', monospace" }}>ETA AQUARIIDS</p>
        <p className="text-[#f59e0b] text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>Peak: May 6, 2025</p>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
        <div>
          <p className="text-gray-600 text-xs mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Rate</p>
          <p className="text-white text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>~50/hour</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>In</p>
          <p className="text-[#f59e0b] text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>29 days</p>
        </div>
      </div>
      <h3 className="text-center text-lg font-bold text-white mt-4" style={{ fontFamily: "'Orbitron', monospace" }}>Meteor Shower</h3>
    </motion.div>
  );
}

export default function WidgetSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#020617]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#7c3aed]/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.4em] text-[#22d3ee] mb-2 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
            — Observatory Dashboard —
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
            LIVE ASTRONOMY WIDGETS
          </h2>
          <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            Real-time space data for the curious astronomer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[MoonWidget, ISSWidget, MeteorWidget].map((Widget, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <Widget />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
