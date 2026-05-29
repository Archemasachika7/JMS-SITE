"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { siteConfig } from "@/config/siteConfig";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "POTW", href: "/potw" },
  { label: "Magazine", href: "/magazine" },
  { label: "Projects", href: "/projects" },
  { label: "Astronomy", href: "/astronomy" },
  { label: "Team", href: "/team" },
  { label: "Members", href: "/members" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Donators", href: "/donators" },
  { label: "🚀 Recruit", href: "/recruitment", highlight: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsSignedIn(true);
          const { data } = await supabase
            .from("profiles")
            .select("profile_image")
            .eq("id", user.id)
            .maybeSingle();
          if (data?.profile_image) {
            setProfileImage(data.profile_image);
          }
        }
      } catch {
        // Auth check failed silently
      }
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session?.user);
      if (!session?.user) setProfileImage("");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#020617]/80 backdrop-blur-xl border-b border-[#2563eb]/20 shadow-lg shadow-[#2563eb]/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.03 }}>
          <Image src={siteConfig.assets.logo} alt={`${siteConfig.clubName} Logo`} width={36} height={36} className="h-9 w-9" />
          <div>
            <span
              className="font-bold text-lg tracking-wider bg-gradient-to-r from-[#2563eb] to-[#10b981] bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              ASTROSCI
            </span>
            <p className="text-[10px] text-gray-400 tracking-widest -mt-1 uppercase" style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}>
              {siteConfig.university}
            </p>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, i) =>
            (item as { highlight?: boolean }).highlight ? (
              <Link key={item.label} href={item.href}>
                <motion.span
                  className="relative px-4 py-2 text-sm font-semibold cursor-pointer group"
                  style={{
                    fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif",
                    background: "linear-gradient(135deg,#a855f7,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[#a855f7] to-[#ec4899] group-hover:w-4/5 transition-all duration-300 rounded-full" />
                </motion.span>
              </Link>
            ) : (
              <Link key={item.label} href={item.href}>
                <motion.span
                  className="relative px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors group cursor-pointer"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[#2563eb] to-[#10b981] group-hover:w-4/5 transition-all duration-300 rounded-full" />
                </motion.span>
              </Link>
            )
          )}
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <Link href="/profile">
              <motion.div
                className="relative w-10 h-10 rounded-full cursor-pointer group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981] opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#2563eb]/60">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2563eb] to-[#10b981] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <motion.span
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border border-[#2563eb]/60 text-[#38bdf8] hover:bg-[#2563eb]/20 hover:border-[#2563eb] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 cursor-pointer"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                  Login
                </motion.span>
              </Link>
              <Link href="/auth?tab=signup">
                <motion.span
                  className="inline-flex px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300 cursor-pointer"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Join Now
                </motion.span>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="flex flex-col gap-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-[#2563eb]/20 px-6 pb-4"
          >
            {navItems.map((item) =>
              (item as { highlight?: boolean }).highlight ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block mt-3 mb-1"
                  onClick={() => setMenuOpen(false)}
                >
                  <span
                    className="inline-block w-full text-center py-2.5 rounded-full text-sm font-semibold text-white"
                    style={{
                      fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif",
                      background: "linear-gradient(135deg,#4f46e5,#a855f7,#ec4899)",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-3 text-gray-300 hover:text-[#38bdf8] border-b border-white/5 text-sm tracking-wider"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            {isSignedIn ? (
              <Link href="/profile" className="block mt-4" onClick={() => setMenuOpen(false)}>
                <span
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-full border border-[#2563eb]/60 text-[#38bdf8] text-sm"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  My Profile
                </span>
              </Link>
            ) : (
              <>
                <Link href="/auth" className="block mt-4">
                  <span
                    className="block w-full py-2 rounded-full border border-[#2563eb]/60 text-[#38bdf8] text-sm text-center"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    Login
                  </span>
                </Link>
                <Link href="/auth?tab=signup" className="block mt-2">
                  <span
                    className="block w-full py-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white text-sm text-center"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    Join Now
                  </span>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
