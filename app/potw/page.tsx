"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

interface POTWItem {
  id: string;
  image_url: string;
  title: string;
  photographer: string;
  date: string;
}

export default function POTWPage() {
  const [items, setItems] = useState<POTWItem[]>([]);

  useEffect(() => {
    async function fetchPOTW() {
      try {
        const { data } = await supabase
          .from("potw")
          .select("*")
          .order("date", { ascending: false });
        if (data) setItems(data);
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchPOTW();
  }, []);

  const placeholders: (POTWItem & { gradient: string })[] = [
    { id: "1", image_url: "", title: "The Carina Nebula", photographer: "Anika Mukherjee", date: "2025-03-01", gradient: "radial-gradient(ellipse at 40% 50%, #1e3a5f 0%, #0c1e3d 40%, #020617 100%)" },
    { id: "2", image_url: "", title: "Horsehead Nebula", photographer: "Priya Sen", date: "2025-02-22", gradient: "radial-gradient(ellipse at 60% 40%, #1e3a5f 0%, #0c1929 50%, #020617 100%)" },
    { id: "3", image_url: "", title: "Pillars of Creation", photographer: "Ravi Chatterjee", date: "2025-02-15", gradient: "radial-gradient(ellipse at 50% 60%, #3b1a09 0%, #1a0a04 50%, #020617 100%)" },
    { id: "4", image_url: "", title: "Ring Nebula", photographer: "Dibya Ghosh", date: "2025-02-08", gradient: "radial-gradient(ellipse at 40% 50%, #164e63 0%, #0c4a6e 40%, #020617 100%)" },
    { id: "5", image_url: "", title: "Eagle Nebula", photographer: "Sneha Das", date: "2025-02-01", gradient: "radial-gradient(ellipse at 55% 40%, #7f1d1d 0%, #450a0a 50%, #020617 100%)" },
    { id: "6", image_url: "", title: "Whirlpool Galaxy", photographer: "Arjun Bose", date: "2025-01-25", gradient: "radial-gradient(ellipse at 50% 50%, #065f46 0%, #022c22 50%, #020617 100%)" },
  ];

  const displayItems = items.length > 0 ? items : placeholders;

  const gradients = [
    "radial-gradient(ellipse at 40% 50%, #1e3a5f 0%, #0c1e3d 40%, #020617 100%)",
    "radial-gradient(ellipse at 60% 40%, #1e3a5f 0%, #0c1929 50%, #020617 100%)",
    "radial-gradient(ellipse at 50% 60%, #3b1a09 0%, #1a0a04 50%, #020617 100%)",
    "radial-gradient(ellipse at 40% 50%, #164e63 0%, #0c4a6e 40%, #020617 100%)",
    "radial-gradient(ellipse at 55% 40%, #7f1d1d 0%, #450a0a 50%, #020617 100%)",
    "radial-gradient(ellipse at 50% 50%, #065f46 0%, #022c22 50%, #020617 100%)",
  ];

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
              className="text-xs tracking-[0.4em] text-[#38bdf8] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Photo of the Week —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              POTW ARCHIVE
            </h1>
            <p
              className="text-gray-500 text-sm mt-3"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              All previous Picture of the Week winners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item, i) => {
              const isReal = items.length > 0;
              const gradient = !isReal
                ? (item as (typeof placeholders)[0]).gradient
                : gradients[i % gradients.length];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-2xl overflow-hidden border border-[#2563eb]/20 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#2563eb]/50 transition-all"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: gradient }}>
                        {[...Array(30)].map((_, j) => (
                          <div
                            key={j}
                            className="absolute rounded-full bg-white"
                            style={{
                              width: `${Math.random() * 2 + 0.5}px`,
                              height: `${Math.random() * 2 + 0.5}px`,
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              opacity: Math.random() * 0.7 + 0.3,
                            }}
                          />
                        ))}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#2563eb]/30 blur-2xl" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2 py-1 rounded-full bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] text-xs backdrop-blur-sm"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        ★ POTW
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3
                      className="text-white font-bold text-base mb-1"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[#38bdf8] text-sm"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      📸 {item.photographer}
                    </p>
                    <p
                      className="text-gray-500 text-xs mt-2"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
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
