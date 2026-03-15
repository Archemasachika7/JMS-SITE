"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  QrCode,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
  EyeOff,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Step = "form" | "payment" | "verification";

export default function DonatorPaymentPage() {
  const [step, setStep] = useState<Step>("form");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #0a1628 0%, #020617 60%)" }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#7c3aed]/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Back Link */}
          <Link href="/donators" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#22d3ee] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Donators
          </Link>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {["Details", "Payment", "Verification"].map((label, i) => {
              const steps: Step[] = ["form", "payment", "verification"];
              const isActive = steps.indexOf(step) >= i;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white"
                        : "bg-white/10 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block ${isActive ? "text-[#22d3ee]" : "text-gray-600"}`}>
                    {label}
                  </span>
                  {i < 2 && <div className={`w-8 sm:w-12 h-px ${isActive ? "bg-[#22d3ee]/40" : "bg-white/10"}`} />}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Form */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="rounded-2xl border border-[#22d3ee]/20 bg-[#0f172a]/80 backdrop-blur-sm p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#22d3ee]" />
                    </div>
                    <div>
                      <h2
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                      >
                        Make a Donation
                      </h2>
                      <p className="text-sm text-gray-400">Your support makes a difference</p>
                    </div>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    {/* Anonymous Toggle */}
                    <div className="rounded-xl bg-[#7c3aed]/5 border border-[#7c3aed]/20 p-4">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <EyeOff className="w-4 h-4 text-[#7c3aed]" />
                          <div>
                            <span className="text-sm font-semibold text-white">Anonymous Donation</span>
                            <p className="text-xs text-gray-400">Your name will be hidden on the donators wall</p>
                          </div>
                        </div>
                        <div
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            isAnonymous ? "bg-[#7c3aed]" : "bg-white/10"
                          }`}
                          onClick={() => setIsAnonymous(!isAnonymous)}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                              isAnonymous ? "translate-x-[22px]" : "translate-x-0.5"
                            }`}
                          />
                        </div>
                      </label>
                    </div>

                    {/* Donation Amount */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Donation Amount (₹)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="1"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22d3ee]/50 transition-colors"
                        placeholder="Enter amount"
                      />
                    </div>

                    {/* Name (unless anonymous) */}
                    {!isAnonymous && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isAnonymous}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22d3ee]/50 transition-colors"
                          placeholder="Your name"
                        />
                      </motion.div>
                    )}

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22d3ee]/50 transition-colors"
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22d3ee]/50 transition-colors"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Contact details are required so we can reach you regarding the donator certificate.
                    </p>

                    <motion.button
                      type="submit"
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all duration-300"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Proceed to Payment
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="rounded-2xl border border-[#22d3ee]/20 bg-[#0f172a]/80 backdrop-blur-sm p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-6">
                    <QrCode className="w-7 h-7 text-[#22d3ee]" />
                  </div>
                  <h2
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    Complete Payment
                  </h2>
                  <p className="text-sm text-gray-400 mb-8">
                    Scan the QR code below or use UPI to donate
                  </p>

                  {/* QR Code Placeholder */}
                  <div className="w-56 h-56 mx-auto rounded-2xl border-2 border-dashed border-[#22d3ee]/30 bg-white/5 flex flex-col items-center justify-center mb-6">
                    <QrCode className="w-16 h-16 text-[#22d3ee]/40 mb-2" />
                    <p className="text-xs text-gray-500">QR Code</p>
                  </div>

                  {/* UPI Button */}
                  <motion.a
                    href="#"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#22d3ee]/40 text-[#22d3ee] font-semibold text-sm tracking-wider hover:bg-[#22d3ee]/10 hover:border-[#22d3ee] transition-all duration-300 mb-8"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Smartphone className="w-4 h-4" />
                    Pay via UPI
                  </motion.a>

                  <div className="border-t border-white/10 pt-6">
                    <motion.button
                      onClick={() => setStep("verification")}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all duration-300"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle2 className="w-4 h-4 inline mr-2" />
                      I have Donated
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Verification */}
            {step === "verification" && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-2xl border border-[#22d3ee]/20 bg-[#0f172a]/80 backdrop-blur-sm p-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-10 h-10 text-[#22d3ee]" />
                    </div>
                  </motion.div>

                  <h2
                    className="text-2xl font-bold text-white mb-3"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    Payment Verification Pending
                  </h2>
                  <p className="text-gray-400 text-base mb-2">
                    Thank you for your generous donation! Your payment is being verified.
                  </p>
                  <p className="text-[#22d3ee] text-sm font-semibold mb-6">
                    Verification will be completed within 24 hours.
                  </p>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-left space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Once verified, you will receive an official <strong className="text-white">Donator Certificate</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        {isAnonymous
                          ? "Your donation will appear as \"Anonymous Donor\" on the donators wall."
                          : "Your name and profile picture will appear on the donators wall."}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Status update: <strong className="text-[#22d3ee]">Accepted</strong> or <strong className="text-gray-400">Rejected</strong> within 24 hrs.
                      </p>
                    </div>
                  </div>

                  {/* Verification Status Display */}
                  <div className="rounded-xl border border-[#22d3ee]/20 bg-[#22d3ee]/5 p-4 mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] animate-pulse" />
                      <span className="text-sm font-semibold text-[#22d3ee]">Pending Verification</span>
                    </div>
                  </div>

                  <Link href="/donators">
                    <motion.span
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#22d3ee]/40 text-[#22d3ee] font-semibold text-sm tracking-wider hover:bg-[#22d3ee]/10 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Donators
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}
