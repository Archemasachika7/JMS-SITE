"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  uploaded_at: string;
}

export default function DashboardGalleryPreview() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data } = await supabase
          .from("gallery")
          .select("id, image_url, caption, uploaded_at")
          .order("uploaded_at", { ascending: false })
          .limit(3);
        if (data) setItems(data);
      } catch {
        // Supabase fetch failed silently
      }
      setLoading(false);
    }
    fetchGallery();
  }, []);

  const placeholders = [
    { gradient: "radial-gradient(ellipse at 40% 50%, #1e40af 0%, #0c1e3d 40%, #020617 100%)", caption: "Orion Nebula" },
    { gradient: "radial-gradient(ellipse at 60% 40%, #065f46 0%, #022c22 50%, #020617 100%)", caption: "Andromeda Galaxy" },
    { gradient: "radial-gradient(ellipse at 50% 60%, #78350f 0%, #3b1a09 50%, #020617 100%)", caption: "Saturn Transit" },
  ];

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/20 to-transparent" />

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
              — Astrophotography —
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              GALLERY
            </h2>
          </div>
          <Link href="/gallery">
            <motion.span
              className="text-sm text-[#38bdf8] border border-[#38bdf8]/30 px-5 py-2 rounded-full hover:bg-[#38bdf8]/10 transition-all cursor-pointer"
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
              <div key={i} className="rounded-xl overflow-hidden border border-white/10 animate-pulse" style={{ aspectRatio: "4/3" }}>
                <div className="w-full h-full bg-[#0f172a]" />
              </div>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(items.length > 0 ? items : placeholders).map((item, i) => {
            const isReal = items.length > 0;
            const imageUrl = isReal ? (item as GalleryItem).image_url : "";
            const caption = isReal ? (item as GalleryItem).caption : (item as (typeof placeholders)[0]).caption;
            const gradient = !isReal ? (item as (typeof placeholders)[0]).gradient : "";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#38bdf8]/30 transition-all"
                style={{ aspectRatio: "4/3" }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: gradient }}>
                    {[...Array(20)].map((_, j) => (
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
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p
                    className="text-white text-sm font-bold"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    {caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
