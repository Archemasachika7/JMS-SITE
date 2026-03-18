"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Star, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export type Donor = {
  id: string;
  name: string;
  avatar: string;
  amount: string;
  anonymous: boolean;
};

const donationMilestones = [
  { amount: "₹250", progress: 32 },
  { amount: "₹500", progress: 58 },
  { amount: "₹1,000+", progress: 82 },
];

function DonorCard({
  donor,
  index,
  highlight,
}: {
  donor: Donor;
  index: number;
  highlight?: boolean;
}) {
  const isAnonymous = donor.anonymous;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`relative group rounded-2xl border bg-[#0f172a]/80 backdrop-blur-sm p-6 text-center ${
        highlight
          ? "border-[#22d3ee]/40 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
          : "border-[#7c3aed]/20"
      }`}
    >
      {highlight && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#22d3ee]/5 to-transparent pointer-events-none" />
      )}
      <div className="relative z-10">
        <div
          className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden ${
            highlight ? "ring-2 ring-[#22d3ee]/50" : ""
          }`}
        >
          {!isAnonymous && donor.avatar ? (
            <img src={donor.avatar} alt={donor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
          )}
        </div>
        <h3
          className="text-base font-bold text-white mb-1"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          {isAnonymous ? "Anonymous Donor" : donor.name}
        </h3>
        <p className="text-sm text-[#22d3ee]">{donor.amount}</p>
        {highlight && (
          <Star className="w-4 h-4 text-[#f59e0b] mx-auto mt-2 fill-[#f59e0b]" />
        )}
      </div>
    </motion.div>
  );
}

export default function DonatorsPageContent({
  topDonors,
  allDonors,
}: {
  topDonors: Donor[];
  allDonors: Donor[];
}) {
  const [activeMilestone, setActiveMilestone] = useState(donationMilestones[1]);

  return (
    <main className="relative min-h-screen bg-[#020617]">
      <Navbar />

      <div className="relative z-20 pt-20">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/donators/status">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#22d3ee]/30 bg-[#0f172a]/90 backdrop-blur-sm px-5 py-3 text-sm text-[#22d3ee] hover:bg-[#0f172a] hover:border-[#22d3ee]/60 transition-all duration-300 cursor-pointer"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              <Heart className="w-4 h-4" />
              Already applied for donation? Check your status here!
            </motion.div>
          </Link>
        </div>
      </div>

      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #0a1628 0%, #020617 60%)" }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#7c3aed]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#22d3ee]/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs tracking-[0.4em] text-[#22d3ee] mb-4 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Donations —
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              <span className="bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
                Support{" "}
              </span>
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
                AstroSci
              </span>
            </h1>
            <p
              className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              Your contribution helps us promote science and education. Every donation brings us closer to inspiring the next generation of explorers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/donators/payment">
              <motion.span
                className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white font-bold text-base tracking-wider shadow-[0_0_26px_rgba(139,92,246,0.32)] hover:shadow-[0_0_42px_rgba(139,92,246,0.5)] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                animate={{
                  boxShadow: [
                    "0 0 18px rgba(139,92,246,0.28)",
                    "0 0 32px rgba(139,92,246,0.46)",
                    "0 0 18px rgba(139,92,246,0.28)",
                  ],
                }}
                transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Heart className="w-5 h-5" />
                Support Us
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 rounded-2xl border border-[#8B5CF6]/30 bg-[rgba(255,255,255,0.05)] backdrop-blur-md p-6 max-w-2xl mx-auto"
          >
            <div className="mb-3">
              <p className="text-sm text-[#F3F4F6] font-semibold">Donation Momentum</p>
              <p className="text-xs text-[#c4b5fd] mt-1">
                Note: donations &gt; ₹50 are eligible for certificates.
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-5">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${activeMilestone.progress}%`,
                  background: "linear-gradient(90deg, #6366F1, #A855F7)",
                }}
                animate={{ width: `${activeMilestone.progress}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {donationMilestones.map((milestone) => {
                const isActive = activeMilestone.amount === milestone.amount;
                return (
                  <button
                    key={milestone.amount}
                    type="button"
                    onClick={() => setActiveMilestone(milestone)}
                    className={`rounded-xl border px-2 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "border-transparent text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] shadow-[0_0_20px_rgba(139,92,246,0.45)]"
                        : "border-[#8B5CF6]/35 text-[#E5E7EB] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_16px_rgba(139,92,246,0.25)]"
                    }`}
                  >
                    <span className="block text-sm text-[#F3F4F6]">{milestone.amount}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p
              className="text-xs tracking-[0.4em] text-[#22d3ee] mb-3 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Top Supporters —
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Our Top Donors
            </h2>
          </motion.div>

          {topDonors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {topDonors.map((donor, i) => (
                <DonorCard key={donor.id} donor={donor} index={i} highlight />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-12 rounded-2xl border border-[#7c3aed]/20 bg-[#0f172a]/40"
            >
              <Star className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p
                className="text-gray-300 text-base"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                Top supporters will be featured here.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p
              className="text-xs tracking-[0.4em] text-[#22d3ee] mb-3 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Wall of Gratitude —
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              All Donators
            </h2>
          </motion.div>

          {allDonors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {allDonors.map((donor, i) => (
                <DonorCard key={donor.id} donor={donor} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-16 rounded-2xl border border-[#7c3aed]/20 bg-[#0f172a]/40"
            >
              <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p
                className="text-gray-300 text-base"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                Verified donators will appear here.
              </p>
              <p className="text-gray-500 text-sm mt-1">Be the first to donate to AstroSci!</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
