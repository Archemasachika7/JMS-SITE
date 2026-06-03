"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TrendingUp, Plus, Trash2, RefreshCw, ChevronDown } from "lucide-react";

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (el: HTMLElement, opts?: object) => DesmosCalc;
    };
  }
}

interface DesmosCalc {
  setExpression: (e: object) => void;
  removeExpression: (e: { id: string }) => void;
  setBlank: () => void;
  destroy: () => void;
}

type Expr = { id: string; latex: string; color: string };

const NEON_COLORS = [
  "#00F0FF", // cyan
  "#00FF66", // green
  "#7B61FF", // violet
  "#f43f5e", // rose
  "#fb923c", // orange
  "#facc15", // yellow
];

const DEMO: Expr[] = [
  { id: "d0", latex: "y = \\sin(x)", color: "#00F0FF" },
  { id: "d1", latex: "y = x^2 / 4 - 2", color: "#00FF66" },
];

const EXAMPLE_PRESETS = [
  { label: "Archimedean spiral", latex: "r = \\theta / 5" },
  { label: "Rose curve", latex: "r = \\cos(4\\theta)" },
  { label: "Bifolium", latex: "(x^2 + y^2)^2 = 2x^2 y" },
  { label: "Cycloid param", latex: "\\left(t - \\sin(t), 1 - \\cos(t)\\right)" },
  { label: "Logistic", latex: "y = \\frac{1}{1 + e^{-x}}" },
  { label: "Gaussian", latex: "y = e^{-x^2}" },
];

export default function GraphingCalculator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<DesmosCalc | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [exprs, setExprs] = useState<Expr[]>(DEMO);
  const [input, setInput] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  // ── Load Desmos once ──────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    function init() {
      if (!containerRef.current || !window.Desmos) return;
      calcRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
        invertedColors: true,      // built-in dark mode
        expressionsCollapsed: true,
        settingsMenu: false,
        zoomButtons: true,
        border: false,
        expressions: false,        // we manage our own list below
        keypad: false,
        lockViewport: false,
      });
      DEMO.forEach((e) => calcRef.current!.setExpression({ id: e.id, latex: e.latex, color: e.color }));
      setLoaded(true);
    }

    if (window.Desmos) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = "https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0faa6";
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    }

    return () => {
      calcRef.current?.destroy();
      calcRef.current = null;
    };
  }, []);

  // ── Add ───────────────────────────────────────────────────────────────
  const add = useCallback((latex: string) => {
    if (!latex.trim() || !calcRef.current) return;
    const id = `e${Date.now()}`;
    const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    calcRef.current.setExpression({ id, latex: latex.trim(), color });
    setExprs((p) => [...p, { id, latex: latex.trim(), color }]);
    setInput("");
    setShowPresets(false);
  }, []);

  // ── Remove ────────────────────────────────────────────────────────────
  const remove = useCallback((id: string) => {
    calcRef.current?.removeExpression({ id });
    setExprs((p) => p.filter((e) => e.id !== id));
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (!calcRef.current) return;
    calcRef.current.setBlank();
    DEMO.forEach((e) => calcRef.current!.setExpression({ id: e.id, latex: e.latex, color: e.color }));
    setExprs(DEMO);
    setInput("");
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden glass-cyan glow-card"
      onMouseMove={(ev) => {
        const r = ev.currentTarget.getBoundingClientRect();
        const x = ((ev.clientX - r.left) / r.width * 100).toFixed(1);
        const y = ((ev.clientY - r.top) / r.height * 100).toFixed(1);
        ev.currentTarget.style.setProperty("--mx", `${x}%`);
        ev.currentTarget.style.setProperty("--my", `${y}%`);
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2" style={{ color: "var(--math-cyan)" }}>
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.3em]">
            Graphing Calculator
          </span>
          <span className="ml-1 text-[10px] rounded-full px-2 py-0.5 border" style={{ borderColor: "rgba(0,240,255,0.25)", color: "rgba(0,240,255,0.6)" }}>
            Desmos
          </span>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <div className="relative" style={{ height: 400 }}>
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(0,240,255,0.2)", borderTopColor: "var(--math-cyan)" }}
            />
            <p className="text-xs text-gray-500">Loading Desmos…</p>
          </div>
        )}
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* ── Expression list ──────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-t border-white/5 space-y-3">
        {/* Active expressions */}
        <div className="flex flex-wrap gap-2">
          {exprs.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full border text-xs font-mono transition-all"
              style={{
                borderColor: `${e.color}40`,
                color: e.color,
                background: `${e.color}08`,
              }}
            >
              <span className="max-w-[160px] truncate">{e.latex}</span>
              <button onClick={() => remove(e.id)} className="hover:opacity-60 transition-opacity shrink-0">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Input row */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add(input)}
              disabled={!loaded}
              placeholder="e.g.  y = sin(x) * cos(x)  or  r = cos(3θ)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 font-mono focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ ["--tw-ring-color" as string]: "var(--math-cyan)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(0,240,255,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <button
            onClick={() => add(input)}
            disabled={!input.trim() || !loaded}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "rgba(0,240,255,0.12)",
              border: "1px solid rgba(0,240,255,0.25)",
              color: "var(--math-cyan)",
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.background = "rgba(0,240,255,0.2)"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.background = "rgba(0,240,255,0.12)"); }}
          >
            <Plus className="h-4 w-4" /> Plot
          </button>
        </div>

        {/* Presets */}
        <div>
          <button
            onClick={() => setShowPresets((p) => !p)}
            aria-expanded={showPresets}
            aria-controls="graphing-presets"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showPresets ? "rotate-180" : ""}`} />
            Example curves
          </button>
          {showPresets && (
            <div id="graphing-presets" className="mt-2 flex flex-wrap gap-1.5">
              {EXAMPLE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => add(p.latex)}
                  className="px-2.5 py-1 rounded-full border text-[10px] font-mono text-gray-400 hover:text-white transition-all"
                  style={{ borderColor: "rgba(0,240,255,0.2)", background: "rgba(0,240,255,0.04)" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-600">
          Cartesian{" "}
          <span className="font-mono text-gray-500">y = f(x)</span>
          {" · "}polar{" "}
          <span className="font-mono text-gray-500">r = f(θ)</span>
          {" · "}parametric{" "}
          <span className="font-mono text-gray-500">(f(t), g(t))</span>
          {" · "}implicit{" "}
          <span className="font-mono text-gray-500">F(x,y) = 0</span>
        </p>
      </div>
    </div>
  );
}
