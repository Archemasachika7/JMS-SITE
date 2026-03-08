"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabaseClient";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  uploaded_at: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data } = await supabase
          .from("gallery")
          .select("*")
          .order("uploaded_at", { ascending: false });
        if (data) setItems(data);
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchGallery();
  }, []);

  const placeholders = [
    { id: "1", image_url: "", caption: "Orion Nebula", uploaded_at: "2025-03-01", gradient: "radial-gradient(ellipse at 40% 50%, #1e40af 0%, #0c1e3d 40%, #020617 100%)" },
    { id: "2", image_url: "", caption: "Andromeda Galaxy", uploaded_at: "2025-02-28", gradient: "radial-gradient(ellipse at 60% 40%, #065f46 0%, #022c22 50%, #020617 100%)" },
    { id: "3", image_url: "", caption: "Saturn Transit", uploaded_at: "2025-02-25", gradient: "radial-gradient(ellipse at 50% 60%, #78350f 0%, #3b1a09 50%, #020617 100%)" },
    { id: "4", image_url: "", caption: "Milky Way Core", uploaded_at: "2025-02-20", gradient: "radial-gradient(ellipse at 50% 40%, #1e3a5f 0%, #2d1b69 30%, #020617 80%)" },
    { id: "5", image_url: "", caption: "Lunar Eclipse", uploaded_at: "2025-02-15", gradient: "radial-gradient(ellipse at 45% 45%, #7f1d1d 0%, #450a0a 50%, #020617 100%)" },
    { id: "6", image_url: "", caption: "Pleiades Cluster", uploaded_at: "2025-02-10", gradient: "radial-gradient(ellipse at 55% 40%, #164e63 0%, #0c4a6e 40%, #020617 100%)" },
  ];

  const displayItems = items.length > 0 ? items : placeholders;

  return (
    <AuthGuard>
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
              — Astrophotography —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              GALLERY
            </h1>
            <p
              className="text-gray-500 text-sm mt-3"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              Stunning shots captured by our members
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item, i) => {
              const isReal = items.length > 0;
              const imageUrl = isReal ? (item as GalleryItem).image_url : "";
              const caption = isReal ? (item as GalleryItem).caption : (item as (typeof placeholders)[0]).caption;
              const uploadDate = isReal ? (item as GalleryItem).uploaded_at : (item as (typeof placeholders)[0]).uploaded_at;
              const gradient = !isReal ? (item as (typeof placeholders)[0]).gradient : "";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#38bdf8]/40 bg-[#07091a]/80 backdrop-blur-sm transition-all"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
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
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-white font-bold text-sm"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                    >
                      {caption}
                    </h3>
                    <p
                      className="text-gray-500 text-xs mt-1"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      {new Date(uploadDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
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
    </AuthGuard>
  );
}
