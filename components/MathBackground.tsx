"use client";

import { useEffect, useRef } from "react";

/**
 * A subtle, full-screen mathematical background: Conway's Game of Life rendered
 * on a canvas with a faint cyan→violet palette and a soft fade trail. Sits
 * fixed behind all content (replaces the old starfield). Pure canvas — no deps.
 */
export default function MathBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const context = cv.getContext("2d");
    if (!context) return;
    // Explicitly-typed non-null aliases so the nested render functions
    // (closures) keep the narrowed type.
    const canvas: HTMLCanvasElement = cv;
    const ctx: CanvasRenderingContext2D = context;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const CELL = 18; // px per cell
    let cols = 0;
    let rows = 0;
    let grid: Uint8Array = new Uint8Array(0);
    let next: Uint8Array = new Uint8Array(0);

    const idx = (x: number, y: number) => y * cols + x;

    function seed() {
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.random() < 0.16 ? 1 : 0;
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(window.innerWidth / CELL) + 1;
      rows = Math.ceil(window.innerHeight / CELL) + 1;
      seed();
    }

    function step() {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = (x + dx + cols) % cols;
              const ny = (y + dy + rows) % rows;
              n += grid[idx(nx, ny)];
            }
          }
          const alive = grid[idx(x, y)];
          next[idx(x, y)] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
        }
      }
      const tmp = grid;
      grid = next;
      next = tmp;
    }

    function draw() {
      // Fade previous frame for a soft trailing glow (warm near-black).
      ctx.fillStyle = "rgba(10, 4, 8, 0.55)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (!grid[idx(x, y)]) continue;
          // Blend deep-red → soft-white across the screen width.
          const t = x / cols;
          const r = Math.round(225 + t * (254 - 225));
          const g = Math.round(29 + t * (205 - 29));
          const b = Math.round(72 + t * (211 - 72));
          ctx.fillStyle = `rgba(${r},${g},${b},0.16)`;
          ctx.fillRect(x * CELL, y * CELL, CELL - 2, CELL - 2);
        }
      }
    }

    let raf = 0;
    let last = 0;
    let reseedAt = performance.now() + 25000;
    const interval = 130; // ms between generations

    function loop(now: number) {
      if (now - last >= interval) {
        last = now;
        step();
        draw();
        // Periodically reseed so the field never settles into a static still-life.
        if (now > reseedAt) {
          for (let i = 0; i < grid.length; i++) {
            if (Math.random() < 0.04) grid[i] = 1;
          }
          reseedAt = now + 25000;
        }
      }
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (prefersReduced) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #1a060e 0%, #0a0408 70%)" }}
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
      {/* Vignette so foreground text stays readable */}
      <div className="absolute inset-0 bg-[#0a0408]/30" />
    </div>
  );
}
