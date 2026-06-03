"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";
import { supabase } from "@/lib/supabaseClient";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  uploaded_at: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenItem, setFullscreenItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data } = await supabase
          .from("gallery")
          .select("*")
          .order("uploaded_at", { ascending: false });
        console.log("gallery", data);
        if (data) setItems(data);
      } catch {
        // Supabase fetch failed silently
      }
      setLoading(false);
    }
    fetchGallery();
  }, []);

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
              className="text-xs tracking-[0.4em] text-[#fb7185] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Moments & Mathematics —
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
              Moments from our events, seminars, and the people who make them
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-[#07091a]/80 animate-pulse">
                  <div className="w-full bg-[#0f172a]" style={{ aspectRatio: "4/3" }} />
                  <div className="p-4">
                    <div className="h-4 bg-[#0f172a] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#0f172a] rounded w-1/2" />
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
                No gallery images yet — check back soon!
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#fb7185]/40 bg-[#07091a]/80 backdrop-blur-sm transition-all"
              >
                <div
                  className="relative overflow-hidden cursor-pointer"
                  style={{ aspectRatio: "4/3" }}
                  onClick={() => item.image_url && setFullscreenItem(item)}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: "radial-gradient(ellipse at 50% 50%, #1e3a5f 0%, #020617 100%)" }}>
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
                    {item.caption}
                  </h3>
                  <p
                    className="text-gray-500 text-xs mt-1"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    {new Date(item.uploaded_at).toLocaleDateString("en-IN", {
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
      </section>
      <Footer />
      <FullscreenImageViewer
        src={fullscreenItem?.image_url ?? ""}
        alt={fullscreenItem?.caption ?? ""}
        caption={fullscreenItem?.caption}
        subCaption={
          fullscreenItem
            ? new Date(fullscreenItem.uploaded_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : undefined
        }
        isOpen={!!fullscreenItem}
        onClose={() => setFullscreenItem(null)}
      />
    </main>
    </AuthGuard>
  );
}
