"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabaseClient";

interface Project {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  pdf_url: string | null;
  author: string | null;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setProjects(data);
      } catch {
        // Supabase fetch failed silently
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <AuthGuard>
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
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
              — Innovation —
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              AstroSci Projects
            </h1>
            <p
              className="text-gray-500 text-sm mt-3"
              style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
            >
              Research and technical projects by our members
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-white/10 bg-[#07091a]/80 animate-pulse"
                >
                  <div className="w-full bg-[#0f172a]" style={{ aspectRatio: "16/9" }} />
                  <div className="p-6">
                    <div className="h-4 bg-[#0f172a] rounded w-3/4 mb-3" />
                    <div className="h-3 bg-[#0f172a] rounded w-full mb-2" />
                    <div className="h-3 bg-[#0f172a] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#07091a]/60 py-16 text-center">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
              >
                No projects yet — check back soon!
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl overflow-hidden border border-white/10 bg-[#07091a]/80 backdrop-blur-sm hover:border-[#2563eb]/40 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "radial-gradient(ellipse at 50% 50%, #1e3a5f 0%, #020617 100%)" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#2563eb]/40 fill-current">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="text-white font-bold text-lg mb-2"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    {project.title}
                  </h3>
                  {project.description && (
                    <p
                      className="text-gray-500 text-sm mb-3"
                      style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    >
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      {project.author && (
                        <span
                          className="text-xs text-gray-400"
                          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                        >
                          by {project.author}
                        </span>
                      )}
                      <span
                        className="text-xs text-gray-600"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        {new Date(project.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {project.pdf_url && (
                      <a
                        href={project.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#2563eb]/40 text-[#38bdf8] bg-[#2563eb]/10 hover:bg-[#2563eb]/20 hover:border-[#2563eb] transition-all"
                        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 12v-2h4v2h-4zm6-4H8v-2h8v2z" />
                        </svg>
                        View PDF
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
    </AuthGuard>
  );
}
