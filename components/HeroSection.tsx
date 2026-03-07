"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; alpha: number; speed: number; twinkle: number }[] = [];
    for (let i = 0; i < 320; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.003 + 0.001,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    let animFrame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.twinkle += s.speed;
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 60%, #0d0527 0%, #020617 60%)" }}
    >
      <StarCanvas />

      {/* Nebula glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#22d3ee]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Orbiting rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none">
        <div className="w-full h-full rounded-full border border-[#7c3aed]/10" style={{ animation: "spin 40s linear infinite" }} />
        <div className="absolute inset-[60px] rounded-full border border-[#22d3ee]/8" style={{ animation: "spin 25s linear infinite reverse" }} />
        <div className="absolute inset-[140px] rounded-full border border-[#7c3aed]/6" style={{ animation: "spin 18s linear infinite" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#7c3aed]" />
          <span className="text-xs tracking-[0.4em] text-[#22d3ee] uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
            Est. 2018 · Jadavpur University
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#7c3aed]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight"
          style={{ fontFamily: "'Orbitron', monospace" }}
        >
          <span className="bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">ASTRO</span>
          <span className="bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">SCI</span>
          <br />
          <span className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-400 tracking-widest">CLUB</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Exploring the cosmos from the heart of Jadavpur. A community of astronomers,
          astrophotographers, and space enthusiasts charting the universe together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#events"
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-semibold text-sm tracking-wider overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.7)] transition-all duration-300"
            style={{ fontFamily: "'Orbitron', monospace" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10">Explore Events</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          <motion.a
            href="#join"
            className="px-8 py-4 rounded-full border border-[#22d3ee]/40 text-[#22d3ee] font-semibold text-sm tracking-wider hover:bg-[#22d3ee]/10 hover:border-[#22d3ee] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300"
            style={{ fontFamily: "'Orbitron', monospace" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Join the Community
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent" style={{ animation: "pulse 2s ease-in-out infinite" }} />
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
