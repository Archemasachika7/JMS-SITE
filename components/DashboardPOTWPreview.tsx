"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface POTWItem {
  id: string;
  image_url: string;
  title: string;
  photographer: string;
  date: string;
}

export default function DashboardPOTWPreview() {
  const [items, setItems] = useState<POTWItem[]>([]);

  useEffect(() => {
    async function fetchPOTW() {
      try {
        const { data } = await supabase
          .from("potw")
          .select("*")
          .order("date", { ascending: false })
          .limit(3);
        if (data) setItems(data);
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchPOTW();
  }, []);

  const placeholders: POTWItem[] = [
    { id: "1", image_url: "", title: "The Carina Nebula", photographer: "Anika Mukherjee", date: "2025-03-01" },
    { id: "2", image_url: "", title: "Horsehead Nebula", photographer: "Priya Sen", date: "2025-02-22" },
    { id: "3", image_url: "", title: "Pillars of Creation", photographer: "Ravi Chatterjee", date: "2025-02-15" },
  ];

  const gradients = [
    "radial-gradient(ellipse at 40% 50%, #1e3a5f 0%, #0c1e3d 40%, #020617 100%)",
    "radial-gradient(ellipse at 60% 40%, #1e3a5f 0%, #0c1929 50%, #020617 100%)",
    "radial-gradient(ellipse at 50% 60%, #3b1a09 0%, #1a0a04 50%, #020617 100%)",
  ];

  const displayItems = items.length > 0 ? items : placeholders;

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563eb]/20 to-transparent" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#2563eb]/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p
              className="text-xs tracking-[0.4em] text-[#38bdf8] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Featured Shots —
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Picture of the Week
            </h2>
          </div>
          <Link href="/potw">
            <motion.span
              className="text-sm text-[#2563eb] border border-[#2563eb]/30 px-5 py-2 rounded-full hover:bg-[#2563eb]/10 transition-all cursor-pointer"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              whileHover={{ scale: 1.05 }}
            >
              View Archive →
            </motion.span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl overflow-hidden border border-[#2563eb]/20 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#2563eb]/50 transition-all"
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10" }}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: gradients[i] || gradients[0] }}>
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
              <div className="p-4">
                <h3
                  className="text-white font-bold text-sm mb-1"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[#38bdf8] text-xs"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  📸 {item.photographer}
                </p>
                <p
                  className="text-gray-500 text-xs mt-1"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
