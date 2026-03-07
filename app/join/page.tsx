"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-lg w-full text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
              <path d="M12 2L9.5 8.5H3L8 12.5L6 19L12 15.5L18 19L16 12.5L21 8.5H14.5L12 2Z" />
            </svg>
          </div>
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "'Orbitron', monospace" }}
        >
          Join <span className="bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">AstroSci</span>
        </h1>

        <p
          className="text-gray-400 text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Become a member of the AstroSci Club at Jadavpur University. Explore the cosmos, attend
          stargazing events, contribute to our magazine, and connect with fellow space enthusiasts.
        </p>

        <div className="rounded-2xl border border-[#7c3aed]/20 bg-[#07091a]/80 backdrop-blur-sm p-8 mb-8">
          <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>
            Signup form coming soon. Stay tuned!
          </p>
          <motion.button
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-semibold text-sm tracking-wider shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.7)] transition-all duration-300"
            style={{ fontFamily: "'Orbitron', monospace" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Sign Up (Coming Soon)
          </motion.button>
        </div>

        <Link href="/" className="text-[#22d3ee] text-sm hover:text-white transition-colors" style={{ fontFamily: "'Space Mono', monospace" }}>
          ← Back to Home
        </Link>
      </motion.div>
    </main>
  );
}
