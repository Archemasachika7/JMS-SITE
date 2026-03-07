"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  useEffect(() => {
    async function fetchAPOD() {
      try {
        const res = await fetch(
          "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
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
              className="text-xs tracking-[0.4em] text-[#22d3ee] mb-2 uppercase"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              — NASA —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              ASTRONOMY PICTURE OF THE DAY
            </h1>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border-2 border-[#22d3ee]/30 border-t-[#22d3ee] animate-spin mx-auto" />
              <p
                className="text-gray-500 text-sm mt-4"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Fetching from NASA...
              </p>
            </div>
          ) : apod ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-[#22d3ee]/20 bg-[#07091a]/80 backdrop-blur-sm"
            >
              {apod.media_type === "image" ? (
                <div className="relative overflow-hidden">
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
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  {apod.title}
                </h2>
                <p
                  className="text-[#22d3ee] text-sm mb-4"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {new Date(apod.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p
                  className="text-gray-400 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {apod.explanation}
                </p>
                <motion.a
                  href="https://apod.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#22d3ee]/40 text-[#22d3ee] text-sm hover:bg-[#22d3ee]/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
                  style={{ fontFamily: "'Space Mono', monospace" }}
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
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Unable to load NASA APOD. Please try again later.
              </p>
              <motion.a
                href="https://apod.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2 rounded-full border border-[#22d3ee]/30 text-[#22d3ee] text-sm hover:bg-[#22d3ee]/10 transition-all"
                style={{ fontFamily: "'Space Mono', monospace" }}
                whileHover={{ scale: 1.04 }}
              >
                Visit NASA APOD →
              </motion.a>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
