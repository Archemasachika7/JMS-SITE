"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Plus, Trash2, RefreshCw } from "lucide-react";

declare global {
  interface Window {
    
    Desmos: any;
  }
}

const DEMO_EXPRESSIONS = [
  { latex: "y = \\sin(x)", color: "#f43f5e" },
  { latex: "y = x^2 - 3", color: "#fb7185" },
];

export default function GraphingCalculator() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const calcRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [expressions, setExpressions] = useState(DEMO_EXPRESSIONS);
  const [newExpr, setNewExpr] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    function initDesmos() {
      if (!containerRef.current || !window.Desmos) return;
      calcRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
        expressionsCollapsed: true,
        settingsMenu: false,
        zoomButtons: true,
        border: false,
        backgroundColor: "#0f172a",
        textColor: "#f8fafc",
        expressions: false,
        keypad: false,
      });
      DEMO_EXPRESSIONS.forEach((e, i) =>
        calcRef.current.setExpression({ id: `e${i}`, latex: e.latex, color: e.color })
      );
      setLoaded(true);
    }

    if (window.Desmos) {
      initDesmos();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0faa6";
    script.async = true;
    script.onload = initDesmos;
    document.head.appendChild(script);

    return () => {
      if (calcRef.current) {
        calcRef.current.destroy();
        calcRef.current = null;
      }
    };
  }, []);

  function addExpression() {
    if (!newExpr.trim()) return;
    if (!calcRef.current) return;
    const id = `e${Date.now()}`;
    const colors = ["#f43f5e", "#fb7185", "#fda4af", "#e11d48", "#be123c"];
    const color = colors[expressions.length % colors.length];
    calcRef.current.setExpression({ id, latex: newExpr.trim(), color });
    setExpressions((prev) => [...prev, { latex: newExpr.trim(), color }]);
    setNewExpr("");
    setError("");
  }

  function removeExpression(idx: number) {
    if (!calcRef.current) return;
    const updated = [...expressions];
    updated.splice(idx, 1);
    calcRef.current.removeExpression({ id: `e${idx}` });
    // Rebuild all
    calcRef.current.setBlank();
    updated.forEach((e, i) =>
      calcRef.current.setExpression({ id: `e${i}`, latex: e.latex, color: e.color })
    );
    setExpressions(updated);
  }

  function reset() {
    if (!calcRef.current) return;
    calcRef.current.setBlank();
    DEMO_EXPRESSIONS.forEach((e, i) =>
      calcRef.current.setExpression({ id: `e${i}`, latex: e.latex, color: e.color })
    );
    setExpressions(DEMO_EXPRESSIONS);
    setNewExpr("");
    setError("");
  }

  return (
    <div className="rounded-2xl border border-[#f43f5e]/20 bg-[#0f172a]/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-[#f43f5e]">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.3em]">
            Graphing Calculator
          </span>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#fb7185] transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* Canvas */}
      <div className="relative">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f172a]">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full border-2 border-[#f43f5e]/40 border-t-[#f43f5e] animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500">Loading calculator…</p>
            </div>
          </div>
        )}
        <div ref={containerRef} style={{ width: "100%", height: 380 }} />
      </div>

      {/* Expression list + add */}
      <div className="px-6 py-4 border-t border-white/5 space-y-3">
        <div className="flex flex-wrap gap-2">
          {expressions.map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full border text-xs font-mono"
              style={{ borderColor: `${e.color}40`, color: e.color }}
            >
              <span>{e.latex}</span>
              <button
                onClick={() => removeExpression(i)}
                className="hover:opacity-70 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newExpr}
            onChange={(e) => setNewExpr(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addExpression()}
            placeholder="e.g. y = sin(x) * cos(x)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-[#f43f5e]/50 focus:bg-white/8 transition-all"
          />
          <button
            onClick={addExpression}
            disabled={!newExpr.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#f43f5e]/20 border border-[#f43f5e]/30 text-[#f43f5e] text-sm font-medium hover:bg-[#f43f5e]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="h-4 w-4" /> Plot
          </button>
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
        <p className="text-[11px] text-gray-600">
          Use LaTeX syntax: <span className="font-mono text-gray-500">y = x^2</span>,{" "}
          <span className="font-mono text-gray-500">y = \sin(x)</span>,{" "}
          <span className="font-mono text-gray-500">r = 1 + \cos(\theta)</span>
        </p>
      </div>
    </div>
  );
}
