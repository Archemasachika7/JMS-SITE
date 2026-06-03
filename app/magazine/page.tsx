"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";
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
  const [loading, setLoading] = useState(true);
  const [fullscreenMagazine, setFullscreenMagazine] = useState<Magazine | null>(null);

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
      setLoading(false);
    }
    fetchMagazines();
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
              className="text-xs tracking-[0.4em] text-[#e11d48] mb-2 uppercase"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              — Publication —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              MAGAZINE
            </h1>
            <p
              className="text-gray-500 text-sm mt-3"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              All editions of our flagship mathematics magazine
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#e11d48]/20 bg-[#07091a]/80 animate-pulse">
                  <div className="w-full bg-[#0f172a]" style={{ aspectRatio: "3/4" }} />
                  <div className="p-5">
                    <div className="h-4 bg-[#0f172a] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#0f172a] rounded w-1/3 mb-1" />
                    <div className="h-3 bg-[#0f172a] rounded w-1/4 mb-3" />
                    <div className="h-8 bg-[#0f172a] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : magazines.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#07091a]/60 py-16 text-center">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                No magazines published yet — check back soon!
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazines.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl overflow-hidden border border-[#e11d48]/20 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#e11d48]/50 transition-all"
              >
                <div
                  className="relative overflow-hidden cursor-pointer"
                  style={{ aspectRatio: "3/4" }}
                  onClick={() => item.cover_image && setFullscreenMagazine(item)}
                >
                  {item.cover_image ? (
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full relative" style={{ background: "linear-gradient(135deg, #020617 0%, #1a0a3e 40%, #030e1a 100%)" }}>
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
                            className="text-[#fb7185] text-xs tracking-[0.3em] uppercase"
                            style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                          >
                            JU Maths Society
                          </p>
                          <h3
                            className="text-xl font-black text-white leading-tight mt-1"
                            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                          >
                            {item.title}
                          </h3>
                        </div>
                        <div>
                          <div className="h-px w-full bg-gradient-to-r from-[#e11d48] to-[#fb7185] mb-2 opacity-60" />
                          <p
                            className="text-2xl font-black text-white"
                            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
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
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[#e11d48] text-sm"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  >
                    {item.issue}
                  </p>
                  <p
                    className="text-gray-500 text-xs mt-1"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
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
                      className="inline-block mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-medium shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      ↓ Download PDF
                    </motion.a>
                  ) : (
                    <motion.button
                      className="mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-medium shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      ↓ Download PDF
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>
      <Footer />
      <FullscreenImageViewer
        src={fullscreenMagazine?.cover_image ?? ""}
        alt={fullscreenMagazine?.title ?? ""}
        caption={fullscreenMagazine?.title}
        subCaption={fullscreenMagazine?.issue}
        isOpen={!!fullscreenMagazine}
        onClose={() => setFullscreenMagazine(null)}
      />
    </main>
    </AuthGuard>
  );
}
