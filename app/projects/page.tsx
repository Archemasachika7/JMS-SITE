"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";

const placeholderProjects = [
  { title: "Radio Telescope Array", description: "Building a small-scale radio telescope for hydrogen line detection.", color: "#38bdf8" },
  { title: "Satellite Tracking System", description: "Developing software to track satellites and predict passes.", color: "#2563eb" },
  { title: "Light Pollution Mapping", description: "Mapping light pollution levels across Kolkata using sensors.", color: "#f59e0b" },
  { title: "Spectroscopy Lab", description: "Analyzing stellar spectra using DIY spectrometers.", color: "#ef4444" },
];

export default function ProjectsPage() {
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {placeholderProjects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-[#07091a]/80 backdrop-blur-sm p-6 hover:border-white/20 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${project.color}15`, border: `1px solid ${project.color}30` }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" style={{ color: project.color }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-gray-500 text-sm mb-4"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  {project.description}
                </p>
                <span
                  className="text-xs px-3 py-1 rounded-full border"
                  style={{
                    fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif",
                    color: project.color,
                    borderColor: `${project.color}40`,
                    background: `${project.color}10`,
                  }}
                >
                  Coming Soon
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
    </AuthGuard>
  );
}
