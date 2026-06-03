"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";

interface POTWItem {
  id: string;
  image_url: string;
  title: string;
  photographer: string;
  description: string;
  week_date: string;
}

export default function DashboardPOTWPreview() {
  const [items, setItems] = useState<POTWItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenItem, setFullscreenItem] = useState<POTWItem | null>(null);

  useEffect(() => {
    async function fetchPOTW() {
      try {
        const { data } = await supabase
          .from("potw")
          .select("id, image_url, title, photographer, description, week_date")
          .order("week_date", { ascending: false })
          .limit(3);
        console.log("potw", data);
        if (data) setItems(data);
      } catch {
        // Supabase fetch failed silently
      }
      setLoading(false);
    }
    fetchPOTW();
  }, []);

  const defaultGradient = "radial-gradient(ellipse at 50% 50%, #1e3a5f 0%, #020617 100%)";

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e11d48]/20 to-transparent" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#e11d48]/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div>
            <p
              className="text-xs tracking-[0.4em] text-[#fb7185] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Weekly Highlight —
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Problem of the Week
            </h2>
          </div>
          <Link href="/potw">
            <motion.span
              className="text-xs sm:text-sm text-[#e11d48] border border-[#e11d48]/30 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-[#e11d48]/10 transition-all cursor-pointer whitespace-nowrap"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              whileHover={{ scale: 1.05 }}
            >
              View All →
            </motion.span>
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-[#e11d48]/20 bg-[#07091a]/80 animate-pulse">
                <div className="w-full bg-[#0f172a]" style={{ aspectRatio: "16/10" }} />
                <div className="p-4">
                  <div className="h-4 bg-[#0f172a] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#0f172a] rounded w-1/2 mb-1" />
                  <div className="h-3 bg-[#0f172a] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#07091a]/60 py-16 text-center">
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              No featured photos yet — check back soon!
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl overflow-hidden border border-[#e11d48]/20 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#e11d48]/50 transition-all cursor-pointer"
              onClick={() => item.image_url && setFullscreenItem(item)}
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10" }}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: defaultGradient }}>
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#e11d48]/30 blur-2xl" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className="px-2 py-1 rounded-full bg-[#fb7185]/20 border border-[#fb7185]/40 text-[#fb7185] text-xs backdrop-blur-sm"
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
                  className="text-[#fb7185] text-xs"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  📸 {item.photographer}
                </p>
                <p
                  className="text-gray-500 text-xs mt-1"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  {new Date(item.week_date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
      <FullscreenImageViewer
        src={fullscreenItem?.image_url ?? ""}
        alt={fullscreenItem?.title ?? ""}
        caption={fullscreenItem?.title}
        subCaption={fullscreenItem ? `📸 ${fullscreenItem.photographer}` : undefined}
        isOpen={!!fullscreenItem}
        onClose={() => setFullscreenItem(null)}
      />
    </section>
  );
}
