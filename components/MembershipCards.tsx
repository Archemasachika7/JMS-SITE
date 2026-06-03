"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { siteConfig } from "@/config/siteConfig";

const plans = [
  {
    name: "Free",
    description: "Basic access to society resources and events",
    features: ["Event notifications", "Problem of the Day", "Community forum"],
    color: "#B45309",
    tier: "free",
  },
  {
    name: "Monthly Scholar",
    description: "Enhanced benefits with monthly renewal",
    features: ["All Free features", "Curated problem sets", "DSA & olympiad roadmaps", "Workshop access"],
    color: "#C0C0C0",
    tier: "monthly",
  },
  {
    name: "Annual Fellow",
    description: "Full access with annual commitment",
    features: ["All Monthly features", "Research mentorship", "Priority event registration", "Certificate of membership"],
    color: "#FCD34D",
    tier: "annual",
  },
];

export default function MembershipCards() {
  const [currentPlan, setCurrentPlan] = useState<string>("");

  useEffect(() => {
    async function fetchPlan() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("plan")
            .eq("id", user.id)
            .single();
          if (data?.plan) setCurrentPlan(data.plan);
        }
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchPlan();
  }, []);

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563eb]/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p
            className="text-xs tracking-[0.4em] text-[#2563eb] mb-2 uppercase"
            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          >
            — Plans —
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            Membership
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isActive = currentPlan.toLowerCase() === plan.tier;
            const tierStyles =
              plan.tier === "annual"
                ? {
                    border: "border-[#FCD34D]/60 shadow-[0_0_30px_rgba(245,158,11,0.2)]",
                    badge: "bg-gradient-to-r from-[#FCD34D] to-[#F59E0B] text-[#111827]",
                  }
                : plan.tier === "monthly"
                  ? {
                      border: "border-[#C0C0C0]/60 shadow-[0_0_24px_rgba(192,192,192,0.15)]",
                      badge: "bg-gradient-to-r from-[#E5E7EB] to-[#9CA3AF] text-[#111827]",
                    }
                  : {
                      border: "border-[#B45309]/60 shadow-[0_0_20px_rgba(180,83,9,0.15)]",
                      badge: "bg-gradient-to-r from-[#B45309] to-[#78350F] text-white",
                    };

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl border bg-[#07091a]/80 backdrop-blur-sm p-6 transition-all ${tierStyles.border}`}
              >
                {plan.tier === "annual" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${tierStyles.badge}`}
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      Best Value
                    </span>
                  </div>
                )}

                {isActive && (
                  <div className="absolute top-4 right-4">
                    <span
                      className="px-2 py-1 rounded-full bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] text-xs"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      Active
                    </span>
                  </div>
                )}

                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                  style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}40` }}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" style={{ color: plan.color }}>
                    <path d="M12 2L9.5 8.5H3L8 12.5L6 19L12 15.5L18 19L16 12.5L21 8.5H14.5L12 2Z" />
                  </svg>
                </div>

                <h3
                  className="text-lg font-bold text-white mb-1"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-gray-500 text-xs mb-4"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  {plan.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span style={{ color: plan.color }}>✓</span>
                      <span
                        className="text-gray-400 text-xs"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={`mailto:${siteConfig.email}`}
                  className="block w-full py-2.5 rounded-xl text-center text-sm font-medium transition-all duration-300"
                  style={{
                    fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif",
                    background: `${plan.color}15`,
                    border: `1px solid ${plan.color}40`,
                    color: plan.color,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Admins
                </motion.a>
              </motion.div>
            );
          })}
        </div>

        {/* Donation / Sponsor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link href="/support">
            <motion.span
              className="px-5 sm:px-6 py-3 rounded-full border border-[#38bdf8]/30 text-[#38bdf8] text-xs sm:text-sm hover:bg-[#38bdf8]/10 transition-all cursor-pointer whitespace-nowrap"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              whileHover={{ scale: 1.05 }}
            >
              Join as Sponsor
            </motion.span>
          </Link>
          <Link href="/support">
            <motion.span
              className="px-5 sm:px-6 py-3 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white text-xs sm:text-sm shadow-[0_0_24px_rgba(168,85,247,0.28)] hover:shadow-[0_0_36px_rgba(168,85,247,0.42)] transition-all cursor-pointer whitespace-nowrap"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              animate={{
                boxShadow: [
                  "0 0 18px rgba(139,92,246,0.22)",
                  "0 0 28px rgba(139,92,246,0.42)",
                  "0 0 18px rgba(139,92,246,0.22)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
            >
              Support Us
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
