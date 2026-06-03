"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";
import { supabase } from "@/lib/supabaseClient";

interface POTWItem {
  id: string;
  image_url: string;
  title: string;
  photographer: string;
  description: string;
  week_date: string;
}

export default function POTWPage() {
  const [items, setItems] = useState<POTWItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenItem, setFullscreenItem] = useState<POTWItem | null>(null);

  const defaultGradient = "radial-gradient(ellipse at 50% 50%, #1e3a5f 0%, #020617 100%)";

  useEffect(() => {
    async function fetchPOTW() {
      try {
        const { data } = await supabase
          .from("potw")
          .select("*")
          .order("week_date", { ascending: false });
        console.log("potw", data);
        if (data) setItems(data);
      } catch {
        // Supabase fetch failed silently
      }
      setLoading(false);
    }
    fetchPOTW();
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

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#e11d48]/20 bg-[#07091a]/80 animate-pulse">
                  <div className="w-full bg-[#0f172a]" style={{ aspectRatio: "16/10" }} />
                  <div className="p-5">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl overflow-hidden border border-[#e11d48]/20 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#e11d48]/50 transition-all"
              >
                <div
                  className="relative overflow-hidden cursor-pointer"
                  style={{ aspectRatio: "16/10" }}
                  onClick={() => item.image_url && setFullscreenItem(item)}
                >
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
                <div className="p-5">
                  <h3
                    className="text-white font-bold text-base mb-1"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[#fb7185] text-sm"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    📸 {item.photographer}
                  </p>
                  <p
                    className="text-gray-500 text-xs mt-2"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    {new Date(item.week_date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
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
        alt={fullscreenItem?.title ?? ""}
        caption={fullscreenItem?.title}
        subCaption={
          fullscreenItem
            ? `📸 ${fullscreenItem.photographer}`
            : undefined
        }
        isOpen={!!fullscreenItem}
        onClose={() => setFullscreenItem(null)}
      />
    </main>
    </AuthGuard>
  );
}
