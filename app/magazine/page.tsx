"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

interface Magazine {
  id: string;
  title: string;
  issue: string;
  cover_image: string;
  pdf_url: string;
  published_at: string;
}

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const { data } = await supabase
          .from("magazines")
          .select("*")
          .order("published_at", { ascending: false });
        if (data) setMagazines(data);
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchMagazines();
  }, []);

  const placeholders: (Magazine & { gradient: string })[] = [
    { id: "1", title: "Nebula Digest", issue: "Vol. 7", cover_image: "", pdf_url: "#", published_at: "2025-03-01", gradient: "linear-gradient(135deg, #0d0527 0%, #1a0a3e 40%, #030e1a 100%)" },
    { id: "2", title: "Nebula Digest", issue: "Vol. 6", cover_image: "", pdf_url: "#", published_at: "2024-09-01", gradient: "linear-gradient(135deg, #030e1a 0%, #0d0527 40%, #1a0a3e 100%)" },
    { id: "3", title: "Nebula Digest", issue: "Vol. 5", cover_image: "", pdf_url: "#", published_at: "2024-03-01", gradient: "linear-gradient(135deg, #1a0a3e 0%, #030e1a 40%, #0d0527 100%)" },
  ];

  const displayItems = magazines.length > 0 ? magazines : placeholders;

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs tracking-[0.4em] text-[#7c3aed] mb-2 uppercase"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              — Publication —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              MAGAZINE
            </h1>
            <p
              className="text-gray-500 text-sm mt-3"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              All editions of our flagship astronomy magazine
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayItems.map((item, i) => {
              const isReal = magazines.length > 0;
              const gradient = !isReal ? (item as (typeof placeholders)[0]).gradient : "";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-2xl overflow-hidden border border-[#7c3aed]/20 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#7c3aed]/50 transition-all"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                    {item.cover_image ? (
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full relative" style={{ background: gradient }}>
                        {[...Array(30)].map((_, j) => (
                          <div
                            key={j}
                            className="absolute rounded-full bg-white"
                            style={{
                              width: `${Math.random() * 2 + 0.5}px`,
                              height: `${Math.random() * 2 + 0.5}px`,
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              opacity: Math.random() * 0.6 + 0.2,
                            }}
                          />
                        ))}
                        <div className="absolute inset-0 flex flex-col justify-between p-6">
                          <div>
                            <p
                              className="text-[#22d3ee] text-xs tracking-[0.3em] uppercase"
                              style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                              AstroSci · JU
                            </p>
                            <h3
                              className="text-xl font-black text-white leading-tight mt-1"
                              style={{ fontFamily: "'Orbitron', monospace" }}
                            >
                              {item.title}
                            </h3>
                          </div>
                          <div>
                            <div className="h-px w-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] mb-2 opacity-60" />
                            <p
                              className="text-2xl font-black text-white"
                              style={{ fontFamily: "'Orbitron', monospace" }}
                            >
                              {item.issue}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3
                      className="text-white font-bold text-base mb-1"
                      style={{ fontFamily: "'Orbitron', monospace" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[#7c3aed] text-sm"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {item.issue}
                    </p>
                    <p
                      className="text-gray-500 text-xs mt-1"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {new Date(item.published_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                    {item.pdf_url && item.pdf_url !== "#" ? (
                      <motion.a
                        href={item.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-xs font-medium shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        ↓ Download PDF
                      </motion.a>
                    ) : (
                      <motion.button
                        className="mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-xs font-medium shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        ↓ Download PDF
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
