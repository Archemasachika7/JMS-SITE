"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
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
              — Get in Touch —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              SUPPORT
            </h1>
            <p
              className="text-gray-500 text-sm mt-3"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Sponsor us, make a donation, or send us a message
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-[#07091a]/80 backdrop-blur-sm p-8 space-y-6"
          >
            <div>
              <label
                className="text-gray-400 text-xs mb-1.5 block"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0a0d1a] border border-white/10 text-white text-sm focus:border-[#22d3ee]/50 focus:outline-none transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                className="text-gray-400 text-xs mb-1.5 block"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0a0d1a] border border-white/10 text-white text-sm focus:border-[#22d3ee]/50 focus:outline-none transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label
                className="text-gray-400 text-xs mb-1.5 block"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0d1a] border border-white/10 text-white text-sm focus:border-[#22d3ee]/50 focus:outline-none transition-colors resize-none"
                style={{ fontFamily: "'Space Mono', monospace" }}
                placeholder="Tell us how you'd like to help or what you need..."
              />
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/30"
              >
                <span
                  className="text-[#22d3ee] text-sm"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  ✓ Message sent! We&apos;ll get back to you soon.
                </span>
              </motion.div>
            ) : (
              <motion.button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-sm font-semibold shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all duration-300"
                style={{ fontFamily: "'Space Mono', monospace" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            )}
          </motion.form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
