"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TARGET_DATE = new Date("2025-04-12T19:00:00");

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#2563eb]/20 to-[#020617] border border-[#2563eb]/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]" />
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563eb]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/30 to-transparent" />
        </div>
        <motion.span
          key={display}
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-3xl md:text-4xl font-black text-white"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          {display}
        </motion.span>
      </div>
      <span className="text-xs text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

export default function EventCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="events" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#020617]/80" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563eb]/40 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#2563eb]/5 rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.4em] text-[#38bdf8] mb-3 uppercase" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>
            — Next Event —
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
            UPCOMING STARGAZING
          </h2>
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>
            Join us for a night under the stars
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="relative p-8 md:p-10 rounded-2xl border border-[#2563eb]/20 bg-[#07091a]/80 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                  <span className="text-[#38bdf8] text-xs tracking-widest uppercase" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>
                    Live Countdown
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
                  Lyrid Meteor Shower Night
                </h3>
                <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>
                  Jadavpur University Campus Rooftop Observatory
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs mb-1" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>Event Date</p>
                <p className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>APR 12, 2025</p>
                <p className="text-[#38bdf8] text-sm" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>7:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-8">
              <FlipUnit value={timeLeft.days} label="Days" />
              <span className="text-3xl font-light text-[#2563eb] mb-6">:</span>
              <FlipUnit value={timeLeft.hours} label="Hours" />
              <span className="text-3xl font-light text-[#2563eb] mb-6">:</span>
              <FlipUnit value={timeLeft.minutes} label="Minutes" />
              <span className="text-3xl font-light text-[#2563eb] mb-6">:</span>
              <FlipUnit value={timeLeft.seconds} label="Seconds" />
            </div>

            <div className="mt-8 text-center">
              <motion.button
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#2563eb]/30 to-[#38bdf8]/20 border border-[#2563eb]/50 text-white text-sm font-medium hover:from-[#2563eb]/50 hover:to-[#38bdf8]/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Register for Event →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
