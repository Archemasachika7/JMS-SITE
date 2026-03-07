"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function JoinSection() {
  return (
    <section id="join" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#020617]/80" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7c3aed]/8 rounded-full blur-[120px]" />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.4em] text-[#22d3ee] mb-4 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
            — Join Us —
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Orbitron', monospace" }}>
            Become part of the<br />
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">AstroSci community</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "'Space Mono', monospace" }}>
            Join a passionate group of astronomers, astrophotographers, and space enthusiasts.
            Attend stargazing events, contribute to our magazine, and explore the universe with us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link href="/join">
            <motion.span
              className="inline-flex px-10 py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-semibold text-sm tracking-wider shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.7)] transition-all duration-300 cursor-pointer"
              style={{ fontFamily: "'Orbitron', monospace" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Join Now
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
