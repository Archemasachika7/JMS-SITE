"use client";
import { motion } from "framer-motion";

export default function POTWSection() {
  return (
    <section id="potw" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#020617]/80" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/30 to-transparent" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#22d3ee]/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.4em] text-[#22d3ee] mb-2 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
            — Photo of the Week —
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
            POTW
          </h2>
          <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            Featured astrophotography from our community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-[#22d3ee]/20 bg-[#07091a]/80 backdrop-blur-sm group">
            {/* Image area */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "16/9",
                background: "radial-gradient(ellipse at 40% 50%, #1e1b4b 0%, #0d0527 40%, #020617 100%)",
              }}
            >
              {/* Decorative stars */}
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 2.5 + 0.5}px`,
                    height: `${Math.random() * 2.5 + 0.5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                />
              ))}
              {/* Nebula glow */}
              <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-[#7c3aed]/30 rounded-full blur-[80px]" />
              <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-[#22d3ee]/15 rounded-full blur-[60px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#7c3aed]/60 via-[#4c1d95] to-[#1e1b4b] shadow-[0_0_60px_rgba(124,58,237,0.5)]" />
              </div>

              {/* POTW badge */}
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1.5 rounded-full bg-[#22d3ee]/20 border border-[#22d3ee]/40 backdrop-blur-sm">
                  <span className="text-[#22d3ee] text-xs font-bold tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                    ★ POTW
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Orbitron', monospace" }}>
                    The Carina Nebula
                  </h3>
                  <p className="text-[#22d3ee] text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
                    📸 Photographed by Anika Mukherjee
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#7c3aed]/15 border border-[#7c3aed]/30 text-[#a78bfa] text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Nebula
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#22d3ee]/15 border border-[#22d3ee]/30 text-[#22d3ee] text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Deep Sky
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>
                A breathtaking capture of the Carina Nebula, one of the largest and brightest nebulae in the sky.
                Shot from the JU campus observatory using a 10-inch Dobsonian telescope with a DSLR adapter.
                This image was created by stacking 120 frames during a clear moonless night.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.a
                  href="#gallery"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#22d3ee]/20 to-[#7c3aed]/20 border border-[#22d3ee]/40 text-[#22d3ee] text-sm font-medium hover:from-[#22d3ee]/30 hover:to-[#7c3aed]/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Gallery →
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
