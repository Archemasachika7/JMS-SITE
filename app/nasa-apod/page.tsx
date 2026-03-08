"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";

interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  date: string;
  media_type: string;
}

export default function NasaApodPage() {
  const [apod, setApod] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  useEffect(() => {
    async function fetchAPOD() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );
        if (res.ok) {
          const data = await res.json();
          setApod(data);
        }
      } catch {
        // NASA API fetch failed
      } finally {
        setLoading(false);
      }
    }
    fetchAPOD();
  }, []);

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
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
              — NASA —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              ASTRONOMY PICTURE OF THE DAY
            </h1>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border-2 border-[#38bdf8]/30 border-t-[#38bdf8] animate-spin mx-auto" />
              <p
                className="text-gray-500 text-sm mt-4"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                Fetching from NASA...
              </p>
            </div>
          ) : apod ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-[#38bdf8]/20 bg-[#07091a]/80 backdrop-blur-sm"
            >
              {apod.media_type === "image" ? (
                <div className="relative overflow-hidden cursor-pointer" onClick={() => setFullscreenOpen(true)}>
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full max-h-[600px] object-cover"
                  />
                </div>
              ) : (
                <div className="relative" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                <h2
                  className="text-xl md:text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  {apod.title}
                </h2>
                <p
                  className="text-[#38bdf8] text-sm mb-4"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  {new Date(apod.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p
                  className="text-gray-400 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  {apod.explanation}
                </p>
                <motion.a
                  href="https://apod.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#38bdf8]/40 text-[#38bdf8] text-sm hover:bg-[#38bdf8]/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Visit NASA APOD →
                </motion.a>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-white/10 bg-[#07091a]/80 backdrop-blur-sm">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                Unable to load NASA APOD. Please try again later.
              </p>
              <motion.a
                href="https://apod.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2 rounded-full border border-[#38bdf8]/30 text-[#38bdf8] text-sm hover:bg-[#38bdf8]/10 transition-all"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                whileHover={{ scale: 1.04 }}
              >
                Visit NASA APOD →
              </motion.a>
            </div>
          )}
        </div>
      </section>
      <Footer />
      {apod && apod.media_type === "image" && (
        <FullscreenImageViewer
          src={apod.hdurl || apod.url}
          alt={apod.title}
          caption={apod.title}
          subCaption={new Date(apod.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          isOpen={fullscreenOpen}
          onClose={() => setFullscreenOpen(false)}
        />
      )}
    </main>
  );
}
