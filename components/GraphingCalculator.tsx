"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TrendingUp, Plus, Trash2, RefreshCw, ChevronDown } from "lucide-react";
import { create, all, type EvalFunction } from "mathjs";

const math = create(all);

type Expr = { id: string; expr: string; color: string };

const NEON_COLORS = [
  "#00F0FF", // cyan
  "#00FF66", // green
  "#7B61FF", // violet
  "#f43f5e", // rose
  "#fb923c", // orange
  "#facc15", // yellow
];

const DEMO: Expr[] = [
  { id: "d0", expr: "y = sin(x)", color: "#00F0FF" },
  { id: "d1", expr: "y = x^2/4 - 2", color: "#00FF66" },
];

const EXAMPLE_PRESETS = [
  { label: "Archimedean spiral", expr: "r = theta/5" },
  { label: "Rose curve", expr: "r = cos(4*theta)" },
  { label: "Bifolium", expr: "(x^2+y^2)^2 = 2*x^2*y" },
  { label: "Cycloid", expr: "(t - sin(t), 1 - cos(t))" },
  { label: "Logistic", expr: "y = 1/(1 + e^(-x))" },
  { label: "Gaussian", expr: "y = e^(-x^2)" },
];

// ── Expression parsing ────────────────────────────────────────────────────────
type Compiled =
  | { kind: "cartesian"; f: EvalFunction }
  | { kind: "polar"; f: EvalFunction }
  | { kind: "parametric"; fx: EvalFunction; fy: EvalFunction }
  | { kind: "implicit"; g: EvalFunction }
  | { kind: "error"; message: string };

function normalize(src: string): string {
  // Accept a few LaTeX-isms and Greek for convenience.
  return src
    .replace(/\\left|\\right/g, "")
    .replace(/\\frac\s*\{([^}]*)\}\s*\{([^}]*)\}/g, "($1)/($2)")
    .replace(/\\cdot/g, "*")
    .replace(/\\theta|θ/g, "theta")
    .replace(/\\pi|π/g, "pi")
    .replace(/\\/g, "")
    .trim();
}

function compileExpr(raw: string): Compiled {
  const src = normalize(raw);
  try {
    // Parametric: (f(t), g(t))
    if (src.startsWith("(") && src.includes(",")) {
      const inner = src.slice(1, src.lastIndexOf(")"));
      // split on the top-level comma
      let depth = 0;
      let comma = -1;
      for (let i = 0; i < inner.length; i++) {
        const c = inner[i];
        if (c === "(") depth++;
        else if (c === ")") depth--;
        else if (c === "," && depth === 0) { comma = i; break; }
      }
      if (comma === -1) return { kind: "error", message: "expected (x(t), y(t))" };
      return {
        kind: "parametric",
        fx: math.compile(inner.slice(0, comma)),
        fy: math.compile(inner.slice(comma + 1)),
      };
    }

    const eq = src.indexOf("=");
    if (eq === -1) {
      // bare expression → treat as y = expr
      return { kind: "cartesian", f: math.compile(src) };
    }

    const lhs = src.slice(0, eq).trim();
    const rhs = src.slice(eq + 1).trim();

    if (lhs === "y") return { kind: "cartesian", f: math.compile(rhs) };
    if (lhs === "r") return { kind: "polar", f: math.compile(rhs) };

    // Anything else → implicit  lhs - rhs = 0
    return { kind: "implicit", g: math.compile(`(${lhs}) - (${rhs})`) };
  } catch (e) {
    return { kind: "error", message: (e as Error).message };
  }
}

function niceStep(range: number): number {
  const raw = range / 10;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const nice = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return nice * mag;
}

export default function GraphingCalculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [exprs, setExprs] = useState<Expr[]>(DEMO);
  const [input, setInput] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  // Viewport: world center + pixels-per-unit (square aspect)
  const view = useRef({ cx: 0, cy: 0, ppu: 32 });
  const exprsRef = useRef(exprs);
  exprsRef.current = exprs;

  // ── Drawing ─────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    const { cx, cy, ppu } = view.current;
    const toSX = (x: number) => W / 2 + (x - cx) * ppu;
    const toSY = (y: number) => H / 2 - (y - cy) * ppu;
    const xmin = cx - W / 2 / ppu;
    const xmax = cx + W / 2 / ppu;
    const ymin = cy - H / 2 / ppu;
    const ymax = cy + H / 2 / ppu;

    // ── Grid ──
    const step = niceStep(xmax - xmin);
    ctx.lineWidth = 1;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textBaseline = "top";
    for (let x = Math.ceil(xmin / step) * step; x <= xmax; x += step) {
      const sx = toSX(x);
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
      if (Math.abs(x) > 1e-9) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(formatTick(x, step), sx + 3, toSY(0) + 3);
      }
    }
    for (let y = Math.ceil(ymin / step) * step; y <= ymax; y += step) {
      const sy = toSY(y);
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
      if (Math.abs(y) > 1e-9) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(formatTick(y, step), toSX(0) + 4, sy + 2);
      }
    }
    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, toSY(0)); ctx.lineTo(W, toSY(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toSX(0), 0); ctx.lineTo(toSX(0), H); ctx.stroke();

    // ── Curves ──
    for (const e of exprsRef.current) {
      const c = compileExpr(e.expr);
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 6;

      try {
        if (c.kind === "cartesian") {
          ctx.beginPath();
          let pen = false;
          const samples = Math.max(W, 400);
          for (let i = 0; i <= samples; i++) {
            const x = xmin + ((xmax - xmin) * i) / samples;
            const y = c.f.evaluate({ x }) as number;
            if (!Number.isFinite(y) || Math.abs(y) > 1e6) { pen = false; continue; }
            const sx = toSX(x), sy = toSY(y);
            if (!pen) { ctx.moveTo(sx, sy); pen = true; } else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        } else if (c.kind === "polar") {
          ctx.beginPath();
          let pen = false;
          const N = 2000;
          for (let i = 0; i <= N; i++) {
            const theta = (4 * Math.PI * i) / N;
            const r = c.f.evaluate({ theta }) as number;
            if (!Number.isFinite(r)) { pen = false; continue; }
            const sx = toSX(r * Math.cos(theta)), sy = toSY(r * Math.sin(theta));
            if (!pen) { ctx.moveTo(sx, sy); pen = true; } else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        } else if (c.kind === "parametric") {
          ctx.beginPath();
          let pen = false;
          const N = 2000;
          for (let i = 0; i <= N; i++) {
            const t = -20 + (40 * i) / N;
            const x = c.fx.evaluate({ t }) as number;
            const y = c.fy.evaluate({ t }) as number;
            if (!Number.isFinite(x) || !Number.isFinite(y)) { pen = false; continue; }
            const sx = toSX(x), sy = toSY(y);
            if (!pen) { ctx.moveTo(sx, sy); pen = true; } else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        } else if (c.kind === "implicit") {
          drawImplicit(ctx, c.g, xmin, xmax, ymin, ymax, toSX, toSY);
        }
      } catch {
        // skip a single bad expression rather than break the whole render
      }
      ctx.shadowBlur = 0;
    }
  }, []);

  // ── Mount: size + first draw + resize observer ──────────────────────────
  useEffect(() => {
    draw();
    const ro = new ResizeObserver(() => draw());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [draw]);

  // Redraw whenever the expression set changes
  useEffect(() => { draw(); }, [exprs, draw]);

  // ── Pan ─────────────────────────────────────────────────────────────────
  const drag = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    view.current.cx -= dx / view.current.ppu;
    view.current.cy += dy / view.current.ppu;
    draw();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    drag.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  // ── Zoom ────────────────────────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { cx, cy, ppu } = view.current;
    const wx = cx + (mx - rect.width / 2) / ppu;
    const wy = cy - (my - rect.height / 2) / ppu;
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    const newPpu = Math.min(4000, Math.max(2, ppu * factor));
    view.current.ppu = newPpu;
    view.current.cx = wx - (mx - rect.width / 2) / newPpu;
    view.current.cy = wy + (my - rect.height / 2) / newPpu;
    draw();
  };

  // ── Add / Remove / Reset ─────────────────────────────────────────────────
  const add = useCallback((expr: string) => {
    const v = expr.trim();
    if (!v) return;
    const id = `e${Date.now()}`;
    const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    setExprs((p) => [...p, { id, expr: v, color }]);
    setInput("");
    setShowPresets(false);
  }, []);

  const remove = useCallback((id: string) => {
    setExprs((p) => p.filter((e) => e.id !== id));
  }, []);

  const reset = useCallback(() => {
    view.current = { cx: 0, cy: 0, ppu: 32 };
    setExprs(DEMO);
    setInput("");
    draw();
  }, [draw]);

  return (
    <div
      className="rounded-2xl overflow-hidden glass-cyan glow-card"
      onMouseMove={(ev) => {
        const r = ev.currentTarget.getBoundingClientRect();
        const x = (((ev.clientX - r.left) / r.width) * 100).toFixed(1);
        const y = (((ev.clientY - r.top) / r.height) * 100).toFixed(1);
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
            math.js
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
      <div
        ref={wrapRef}
        className="relative select-none"
        style={{ height: 400, cursor: "grab", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-gray-600 font-mono">
          drag to pan · scroll to zoom
        </span>
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
              <span className="max-w-[180px] truncate">{e.expr}</span>
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
              placeholder="e.g.  y = sin(x) * cos(x)  or  r = cos(3*theta)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 font-mono focus:outline-none transition-all"
              onFocus={(e) => (e.target.style.borderColor = "rgba(0,240,255,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <button
            onClick={() => add(input)}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "rgba(0,240,255,0.12)",
              border: "1px solid rgba(0,240,255,0.25)",
              color: "var(--math-cyan)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,240,255,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,240,255,0.12)"; }}
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
                  onClick={() => add(p.expr)}
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
          <span className="font-mono text-gray-500">r = f(theta)</span>
          {" · "}parametric{" "}
          <span className="font-mono text-gray-500">(f(t), g(t))</span>
          {" · "}implicit{" "}
          <span className="font-mono text-gray-500">F(x,y) = c</span>
        </p>
      </div>
    </div>
  );
}

// ── Tick label formatting ─────────────────────────────────────────────────────
function formatTick(v: number, step: number): string {
  const decimals = step < 1 ? Math.max(0, -Math.floor(Math.log10(step))) : 0;
  return v.toFixed(decimals);
}

// ── Implicit curve via marching squares (zero contour of g) ───────────────────
function drawImplicit(
  ctx: CanvasRenderingContext2D,
  g: EvalFunction,
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number,
  toSX: (x: number) => number,
  toSY: (y: number) => number
) {
  const N = 140;
  const dx = (xmax - xmin) / N;
  const dy = (ymax - ymin) / N;
  // sample grid
  const val: number[][] = [];
  for (let j = 0; j <= N; j++) {
    val[j] = [];
    const y = ymin + j * dy;
    for (let i = 0; i <= N; i++) {
      const x = xmin + i * dx;
      let v: number;
      try { v = g.evaluate({ x, y }) as number; } catch { v = NaN; }
      val[j][i] = v;
    }
  }
  const interp = (a: number, b: number) => a / (a - b); // fraction where sign flips
  ctx.beginPath();
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const v0 = val[j][i];       // bottom-left  (x_i, y_j)
      const v1 = val[j][i + 1];   // bottom-right
      const v2 = val[j + 1][i + 1]; // top-right
      const v3 = val[j + 1][i];   // top-left
      if (![v0, v1, v2, v3].every(Number.isFinite)) continue;
      const x0 = xmin + i * dx, x1 = x0 + dx;
      const y0 = ymin + j * dy, y1 = y0 + dy;
      // edge crossing points
      const pts: [number, number][] = [];
      if ((v0 < 0) !== (v1 < 0)) pts.push([x0 + interp(v0, v1) * dx, y0]);
      if ((v1 < 0) !== (v2 < 0)) pts.push([x1, y0 + interp(v1, v2) * dy]);
      if ((v3 < 0) !== (v2 < 0)) pts.push([x0 + interp(v3, v2) * dx, y1]);
      if ((v0 < 0) !== (v3 < 0)) pts.push([x0, y0 + interp(v0, v3) * dy]);
      for (let k = 0; k + 1 < pts.length; k += 2) {
        ctx.moveTo(toSX(pts[k][0]), toSY(pts[k][1]));
        ctx.lineTo(toSX(pts[k + 1][0]), toSY(pts[k + 1][1]));
      }
    }
  }
  ctx.stroke();
}
