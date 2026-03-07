"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

function getGreeting(): string {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });
  const hour = parseInt(formatter.format(new Date()), 10);

  if (hour >= 22 || hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function ProfileGreeting() {
  const [userName, setUserName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [greeting] = useState(getGreeting());

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("name, profile_image")
            .eq("id", user.id)
            .single();
          if (data) {
            setUserName(data.name || "Explorer");
            setProfileImage(data.profile_image || "");
          } else {
            setUserName(user.user_metadata?.name || user.user_metadata?.full_name || "Explorer");
          }
        } else {
          setUserName("Explorer");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setUserName("Explorer");
      }
    }
    fetchProfile();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-28 pb-8 px-6"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <Link href="/profile">
          <motion.div
            className="relative w-28 h-28 rounded-full cursor-pointer group"
            whileHover={{ scale: 1.08 }}
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          </motion.div>
        </Link>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4"
        >
          <p
            className="text-xs tracking-[0.3em] text-[#22d3ee] uppercase mb-1"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {greeting}
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            Hello, {userName}
          </h1>
        </motion.div>
      </div>
    </motion.section>
  );
}
