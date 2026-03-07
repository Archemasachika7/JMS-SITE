"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [plan, setPlan] = useState<string>("Free");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "");
          const { data } = await supabase
            .from("profiles")
            .select("name, profile_image, plan")
            .eq("id", user.id)
            .single();
          if (data) {
            setUserName(data.name || "");
            setProfileImage(data.profile_image || "");
            setPlan(data.plan || "Free");
          }
        }
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchProfile();
  }, []);

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p
              className="text-xs tracking-[0.4em] text-[#22d3ee] mb-2 uppercase"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              — Your Account —
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              PROFILE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-[#07091a]/80 backdrop-blur-sm p-8"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-28 h-28 rounded-full mb-4">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] opacity-60 blur-sm" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#7c3aed]/60">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-white fill-current">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                {userName || "AstroSci Member"}
              </h2>
              <p
                className="text-gray-400 text-sm mt-1"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {userEmail || "Not logged in"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  Membership Plan
                </span>
                <span
                  className="text-[#22d3ee] text-sm px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {plan}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  Email
                </span>
                <span
                  className="text-gray-300 text-sm"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {userEmail || "—"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
