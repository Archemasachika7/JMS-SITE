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
        space: "#020617",
        panel: "#0f172a",
        border: "#1f2937",
        muted: "#e5e7eb",
        "earth-blue": "#2563eb",
        "orbit-blue": "#38bdf8",
        "atmos-green": "#10b981",
        "aurora-green": "#22c55e",
      },
      fontFamily: {
        heading: ["Space Grotesk", "Inter", "Helvetica", "sans-serif"],
        body: ["Public Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["DM Mono", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
