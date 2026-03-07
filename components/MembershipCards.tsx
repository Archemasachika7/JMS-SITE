"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const plans = [
  {
    name: "Free",
    description: "Basic access to club resources and events",
    features: ["Event notifications", "Gallery access", "Community forum"],
    color: "#22d3ee",
  },
  {
    name: "Monthly Subscriber",
    description: "Enhanced benefits with monthly renewal",
    features: ["All Free features", "Magazine downloads", "Priority registration", "Workshop access"],
    color: "#7c3aed",
    popular: true,
  },
  {
    name: "Annual Subscriber",
    description: "Full access with annual commitment",
    features: ["All Monthly features", "Exclusive content", "Mentorship program", "Certificate of membership"],
    color: "#f59e0b",
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p
            className="text-xs tracking-[0.4em] text-[#7c3aed] mb-2 uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            — Plans —
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            Membership
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isActive =
              currentPlan.toLowerCase() === plan.name.toLowerCase();

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl border bg-[#07091a]/80 backdrop-blur-sm p-6 transition-all ${
                  plan.popular
                    ? "border-[#7c3aed]/50 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="px-3 py-1 rounded-full bg-[#7c3aed] text-white text-xs font-bold"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Popular
                    </span>
                  </div>
                )}

                {isActive && (
                  <div className="absolute top-4 right-4">
                    <span
                      className="px-2 py-1 rounded-full bg-[#22d3ee]/20 border border-[#22d3ee]/40 text-[#22d3ee] text-xs"
                      style={{ fontFamily: "'Space Mono', monospace" }}
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
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-gray-500 text-xs mb-4"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {plan.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span style={{ color: plan.color }}>✓</span>
                      <span
                        className="text-gray-400 text-xs"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="mailto:astrosci@jadavpur.edu"
                  className="block w-full py-2.5 rounded-xl text-center text-sm font-medium transition-all duration-300"
                  style={{
                    fontFamily: "'Space Mono', monospace",
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
              className="px-6 py-3 rounded-full border border-[#22d3ee]/30 text-[#22d3ee] text-sm hover:bg-[#22d3ee]/10 transition-all cursor-pointer"
              style={{ fontFamily: "'Space Mono', monospace" }}
              whileHover={{ scale: 1.05 }}
            >
              Join as Sponsor
            </motion.span>
          </Link>
          <Link href="/support">
            <motion.span
              className="px-6 py-3 rounded-full border border-[#7c3aed]/30 text-[#7c3aed] text-sm hover:bg-[#7c3aed]/10 transition-all cursor-pointer"
              style={{ fontFamily: "'Space Mono', monospace" }}
              whileHover={{ scale: 1.05 }}
            >
              Make a Donation
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
