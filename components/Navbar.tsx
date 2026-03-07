"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["Home", "Gallery", "Events", "POTW", "Magazine", "Join"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#020617]/80 backdrop-blur-xl border-b border-[#7c3aed]/20 shadow-lg shadow-[#7c3aed]/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.03 }}>
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] opacity-80 blur-sm" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M12 2L9.5 8.5H3L8 12.5L6 19L12 15.5L18 19L16 12.5L21 8.5H14.5L12 2Z" />
              </svg>
            </div>
          </div>
          <div>
            <span
              className="font-bold text-lg tracking-wider bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              ASTROSCI
            </span>
            <p className="text-[10px] text-gray-400 tracking-widest -mt-1 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
              Jadavpur University
            </p>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors group"
              style={{ fontFamily: "'Space Mono', monospace" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              {item}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] group-hover:w-4/5 transition-all duration-300 rounded-full" />
            </motion.a>
          ))}
        </div>

        {/* Login Button */}
        <motion.button
          className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border border-[#7c3aed]/60 text-[#22d3ee] hover:bg-[#7c3aed]/20 hover:border-[#7c3aed] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300"
          style={{ fontFamily: "'Space Mono', monospace" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
          Login
        </motion.button>

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
            className="md:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-[#7c3aed]/20 px-6 pb-4"
          >
            {navItems.map((item) => (
              
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-3 text-gray-300 hover:text-[#22d3ee] border-b border-white/5 text-sm tracking-wider"
                style={{ fontFamily: "'Space Mono', monospace" }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button
              className="mt-4 w-full py-2 rounded-full border border-[#7c3aed]/60 text-[#22d3ee] text-sm"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
