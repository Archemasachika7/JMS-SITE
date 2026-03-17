"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Megaphone, ShoppingBag, Calendar, Trophy, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const sponsorPlans = [
  {
    title: "Community Promotion",
    price: "₹599",
    period: "",
    description: "Promotion in AstroSci groups and website.",
    icon: Megaphone,
  },
  {
    title: "Merchandise Sponsor",
    price: "₹1,499",
    period: "/ year",
    description: "Promotion on AstroSci merchandise.",
    icon: ShoppingBag,
  },
  {
    title: "Event Host",
    price: "₹2,000",
    period: "",
    description: "Sponsor AstroSci events.",
    icon: Calendar,
  },
  {
    title: "Major Sponsor",
    price: "₹7,499",
    period: "",
    description: "Host Olympiads and major AstroSci programs.",
    icon: Trophy,
  },
];

type VerifiedSponsor = { name: string; logo: string; website: string };

export default function SponsorsPage() {
  const [verifiedSponsors, setVerifiedSponsors] = useState<VerifiedSponsor[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadVerifiedSponsors() {
      const { data: verifiedDonors, error: donorsError } = await supabase
        .from("donators")
        .select("user_id")
        .eq("status", "verified")
        .not("user_id", "is", null);

      if (donorsError) {
        console.error("Failed to load verified donors:", donorsError.message);
        return;
      }
      if (!mounted || !verifiedDonors) return;

      const verifiedUserIds = Array.from(
        new Set(
          verifiedDonors
            .map((donator) => donator.user_id)
            .filter((userId): userId is string => Boolean(userId))
        )
      );

      if (verifiedUserIds.length === 0) {
        setVerifiedSponsors([]);
        return;
      }

      const { data: sponsors, error: sponsorsError } = await supabase
        .from("sponsors")
        .select("organization_name, logo_url, website_url, user_id")
        .eq("status", "verified")
        .in("user_id", verifiedUserIds)
        .order("created_at", { ascending: false });

      if (sponsorsError) {
        console.error("Failed to load verified sponsors:", sponsorsError.message);
        return;
      }
      if (!mounted || !sponsors) return;

      setVerifiedSponsors(
        sponsors.map((sponsor) => ({
          name: sponsor.organization_name,
          logo: sponsor.logo_url ?? "",
          website: sponsor.website_url ?? "",
        }))
      );
    }

    loadVerifiedSponsors();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="relative min-h-screen">
      <Navbar />

      {/* Status Check Banner */}
      <div className="relative z-20 pt-20">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/sponsors/status">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#f59e0b]/30 bg-[#0f172a]/90 backdrop-blur-sm px-5 py-3 text-sm text-[#f59e0b] hover:bg-[#0f172a] hover:border-[#f59e0b]/60 transition-all duration-300 cursor-pointer"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              <Award className="w-4 h-4" />
              Already applied for sponsorship? Check your status here!
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #1a1005 0%, #020617 60%)" }} />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#f59e0b]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#d97706]/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs tracking-[0.4em] text-[#f59e0b] mb-4 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Sponsorship —
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              <span className="bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
                Support AstroSci Through{" "}
              </span>
              <span className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
                Sponsorship
              </span>
            </h1>
            <p
              className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              Partner with us to promote science, education, and exploration. Your brand reaches a passionate community of astronomers and space enthusiasts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/sponsors/payment">
              <motion.span
                className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-bold text-base tracking-wider shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.7)] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Award className="w-5 h-5" />
                JOIN AS SPONSOR
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sponsorship Plans */}
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
              className="text-xs tracking-[0.4em] text-[#f59e0b] mb-3 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Plans —
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Sponsorship Plans
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorPlans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative group rounded-2xl border border-[#f59e0b]/20 bg-[#0f172a]/80 backdrop-blur-sm p-6 flex flex-col"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex flex-col flex-1">
                    <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#f59e0b]" />
                    </div>
                    <h3
                      className="text-lg font-bold text-white mb-2"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                    >
                      {plan.title}
                    </h3>
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-[#f59e0b]">{plan.price}</span>
                      {plan.period && (
                        <span className="text-sm text-gray-400 ml-1">{plan.period}</span>
                      )}
                    </div>
                    <p
                      className="text-gray-400 text-sm leading-relaxed mb-6 flex-1"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      {plan.description}
                    </p>
                    <Link href="/sponsors/payment">
                      <motion.span
                        className="inline-flex items-center justify-center w-full py-3 rounded-full border border-[#f59e0b]/40 text-[#f59e0b] font-semibold text-sm tracking-wider hover:bg-[#f59e0b]/10 hover:border-[#f59e0b] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 cursor-pointer"
                        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Become Sponsor
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Sponsors */}
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
              className="text-xs tracking-[0.4em] text-[#f59e0b] mb-3 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Partners —
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Our Sponsors
            </h2>
          </motion.div>

          {verifiedSponsors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedSponsors.map((sponsor, i) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-[#f59e0b]/20 bg-[#0f172a]/80 backdrop-blur-sm p-6 text-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-[#f59e0b]/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {sponsor.logo ? (
                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover" />
                    ) : (
                      <Award className="w-8 h-8 text-[#f59e0b]" />
                    )}
                  </div>
                  <h3
                    className="text-lg font-bold text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    {sponsor.name}
                  </h3>
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
                    >
                      Visit Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-16 rounded-2xl border border-white/5 bg-[#0f172a]/40"
            >
              <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p
                className="text-gray-500 text-base"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                Verified sponsors will appear here.
              </p>
              <p className="text-gray-600 text-sm mt-1">Be the first to sponsor AstroSci!</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
