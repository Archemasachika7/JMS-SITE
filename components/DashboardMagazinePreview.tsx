"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Magazine {
  id: string;
  title: string;
  issue: string;
  cover_image: string;
  pdf_url: string;
  date: string;
}

export default function DashboardMagazinePreview() {
  const [magazine, setMagazine] = useState<Magazine | null>(null);

  useEffect(() => {
    async function fetchMagazine() {
      try {
        const { data } = await supabase
          .from("magazines")
          .select("*")
          .order("date", { ascending: false })
          .limit(1)
          .single();
        if (data) setMagazine(data);
      } catch {
        // Supabase fetch failed silently
      }
    }
    fetchMagazine();
  }, []);

  const display = magazine || {
    title: "Nebula Digest",
    issue: "Vol. 7",
    cover_image: "",
    pdf_url: "#",
    date: "2025-03-01",
  };

  return (
    <section
      className="py-16 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020617 0%, #05021a 50%, #020617 100%)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#7c3aed]/6 rounded-full blur-[120px] -translate-y-1/2" />

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
              className="text-xs tracking-[0.4em] text-[#7c3aed] mb-2 uppercase"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              — Publication —
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              LATEST MAGAZINE
            </h2>
          </div>
          <Link href="/magazine">
            <motion.span
              className="text-sm text-[#7c3aed] border border-[#7c3aed]/30 px-5 py-2 rounded-full hover:bg-[#7c3aed]/10 transition-all cursor-pointer"
              style={{ fontFamily: "'Space Mono', monospace" }}
              whileHover={{ scale: 1.05 }}
            >
              View All →
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Cover */}
          <div className="group mx-auto max-w-xs">
            <div className="relative">
              <div className="absolute -inset-3 bg-[#7c3aed]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div
                className="relative rounded-2xl overflow-hidden border border-[#7c3aed]/30 group-hover:border-[#7c3aed]/60 transition-all duration-500"
                style={{ aspectRatio: "3/4" }}
              >
                {display.cover_image ? (
                  <img
                    src={display.cover_image}
                    alt={display.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full relative"
                    style={{ background: "linear-gradient(135deg, #0d0527 0%, #1a0a3e 40%, #030e1a 100%)" }}
                  >
                    {[...Array(40)].map((_, i) => (
                      <div
                        key={i}
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
                          className="text-[#22d3ee] text-xs tracking-[0.3em] uppercase mb-1"
                          style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                          AstroSci Club · JU
                        </p>
                        <h3
                          className="text-xl font-black text-white leading-tight"
                          style={{ fontFamily: "'Orbitron', monospace" }}
                        >
                          {display.title}
                        </h3>
                      </div>
                      <div>
                        <div className="h-px w-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] mb-3 opacity-60" />
                        <p
                          className="text-2xl font-black text-white"
                          style={{ fontFamily: "'Orbitron', monospace" }}
                        >
                          {display.issue}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-xl md:text-2xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              {display.title} — <span className="text-[#7c3aed]">{display.issue}</span>
            </h3>
            <p
              className="text-gray-400 text-sm"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {new Date(display.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
              })}
            </p>
            <div className="flex gap-3 mt-2">
              {display.pdf_url && display.pdf_url !== "#" ? (
                <motion.a
                  href={display.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-sm font-semibold shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all duration-300"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ↓ Download
                </motion.a>
              ) : (
                <motion.button
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-sm font-semibold shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all duration-300"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ↓ Download
                </motion.button>
              )}
              <Link href="/magazine">
                <motion.span
                  className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 hover:text-white transition-all duration-300 inline-block cursor-pointer"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                  whileHover={{ scale: 1.03 }}
                >
                  View All →
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
