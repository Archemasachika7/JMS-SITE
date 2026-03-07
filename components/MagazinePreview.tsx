"use client";
import { motion } from "framer-motion";

export default function MagazinePreview() {
  return (
    <section id="magazine" className="py-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #020617 0%, #05021a 50%, #020617 100%)" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#7c3aed]/6 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.4em] text-[#7c3aed] mb-2 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
            — Publication —
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Orbitron', monospace" }}>NEBULA DIGEST</h2>
          <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            Our flagship astronomy magazine, published each semester
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Magazine Cover */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group"
          >
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 bg-[#7c3aed]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div
                className="relative rounded-2xl overflow-hidden border border-[#7c3aed]/30 group-hover:border-[#7c3aed]/60 transition-all duration-500 cursor-pointer"
                style={{ aspectRatio: "3/4", background: "linear-gradient(135deg, #0d0527 0%, #1a0a3e 40%, #030e1a 100%)" }}
              >
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${Math.random() * 2 + 0.5}px`,
                      height: `${Math.random() * 2 + 0.5}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.6 + 0.2,
                    }}
                  />
                ))}
                <div className="absolute top-1/4 right-1/4 w-32 h-32">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#7c3aed]/60 via-[#4c1d95] to-[#1e1b4b] shadow-[0_0_40px_rgba(124,58,237,0.4)]" />
                </div>
                <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#22d3ee]/10 rounded-full blur-[60px]" />
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div>
                    <p className="text-[#22d3ee] text-xs tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>AstroSci Club · JU</p>
                    <h3 className="text-2xl font-black text-white leading-tight" style={{ fontFamily: "'Orbitron', monospace" }}>NEBULA<br />DIGEST</h3>
                  </div>
                  <div>
                    <div className="h-px w-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] mb-3 opacity-60" />
                    <p className="text-3xl font-black text-white" style={{ fontFamily: "'Orbitron', monospace" }}>VOL. 7</p>
                    <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>Spring 2025 Edition</p>
                    <p className="text-[#a78bfa] text-sm mt-3 font-medium leading-snug" style={{ fontFamily: "'Space Mono', monospace" }}>
                      &ldquo;The Dark Energy<br />Conundrum&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40">
                  <span className="text-[#a78bfa] text-xs font-bold tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>NEW ISSUE</span>
                </div>
                <span className="text-gray-600 text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>Released · March 2025</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Orbitron', monospace" }}>
                Nebula Digest<br />
                <span className="text-[#7c3aed]">Vol. 7</span> — Spring 2025
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'Space Mono', monospace" }}>
                Explore the cosmos through our latest edition — featuring in-depth articles on dark energy cosmology,
                our members&apos; best astrophotography, and a special interview with ISRO scientists.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: "The Dark Energy Conundrum", tag: "Cover Story" },
                { title: "JU Members' Best Shots of 2025", tag: "Astrophotography" },
                { title: "Interview: Scientists at ISRO", tag: "Exclusive" },
                { title: "Beginner's Guide to Starhopping", tag: "Tutorial" },
              ].map(({ title, tag }) => (
                <div key={title} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <span className="w-1 h-4 rounded-full bg-[#7c3aed]" />
                  <span className="text-sm text-gray-300 flex-1" style={{ fontFamily: "'Space Mono', monospace" }}>{title}</span>
                  <span className="text-xs text-[#7c3aed] bg-[#7c3aed]/10 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Space Mono', monospace" }}>{tag}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <motion.button
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-sm font-semibold shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all duration-300"
                style={{ fontFamily: "'Space Mono', monospace" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                ↓ Download Free
              </motion.button>
              <motion.button
                className="px-5 py-3 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 hover:text-white transition-all duration-300"
                style={{ fontFamily: "'Space Mono', monospace" }}
                whileHover={{ scale: 1.03 }}
              >
                Archive →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
