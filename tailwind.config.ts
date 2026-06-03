import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canvas
        background: "#000000",
        surface: "#0A0A0A",
        // Legacy (keep for backward compat)
        space: "#020617",
        panel: "#0f172a",
        border: "#1f2937",
        muted: "#e5e7eb",
        "earth-blue": "#2563eb",
        "orbit-blue": "#38bdf8",
        "atmos-green": "#10b981",
        "aurora-green": "#22c55e",
        // Void & Neon accents
        math: {
          cyan: "#00F0FF",
          green: "#00FF66",
          violet: "#7B61FF",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "Inter", "Helvetica", "sans-serif"],
        body: ["Public Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "DM Mono", "monospace"],
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        "cyan-glow":
          "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,240,255,0.06) 0%, transparent 60%)",
        "green-glow":
          "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,255,102,0.05) 0%, transparent 60%)",
      },
      backdropBlur: {
        glass: "12px",
      },
      boxShadow: {
        "cyan-sm": "0 0 15px rgba(0,240,255,0.15)",
        "cyan-md": "0 0 30px rgba(0,240,255,0.2)",
        "cyan-lg": "0 0 60px rgba(0,240,255,0.25)",
        "green-sm": "0 0 15px rgba(0,255,102,0.15)",
        "violet-sm": "0 0 15px rgba(123,97,255,0.2)",
        "rose-sm": "0 0 20px rgba(225,29,72,0.3)",
        "rose-md": "0 0 40px rgba(225,29,72,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;

