"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { resolveTier, getPlanLabel } from "@/lib/memberUtils";

/* ── Tier palette (red + white theme) ─────────────────── */
export const tierColors: Record<string, string> = {
  free: "#9f1239", // deep rose
  monthly: "#fb7185", // light rose
  annual: "#f43f5e", // rose
  core: "#ffffff", // white — top tier
};

interface MemberUser {
  id: string;
  name: string;
  tier: string;
}

interface Node {
  id: string;
  name: string;
  tier: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const MAX_MEMBERS = 500;
const LINK_DIST = 150; // px — connect nodes closer than this
const HOVER_DIST = 22;

const DEMO_USERS: MemberUser[] = [
  "Alice|core","Bob|annual","Charlie|monthly","Dave|free","Eve|core","Frank|annual",
  "Grace|monthly","Heidi|free","Ivan|annual","Judy|monthly","Karl|free","Liam|core",
  "Mia|annual","Noah|monthly","Olivia|free","Paul|annual","Quinn|core","Rita|monthly",
  "Sam|free","Tina|annual","Uma|monthly","Vince|free","Wendy|core","Xander|annual",
].map((s, i) => {
  const [name, tier] = s.split("|");
  return { id: String(i), name, tier };
});

export default function MemberGraphNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number; name: string; tier: string } | null>(null);

  const buildNodes = useCallback((users: MemberUser[], w: number, h: number) => {
    nodesRef.current = users.map((u) => ({
      id: u.id,
      name: u.name,
      tier: u.tier,
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: u.tier === "core" ? 5 : u.tier === "annual" ? 4.2 : 3.4,
    }));
  }, []);

  // Fetch members (same source as before).
  useEffect(() => {
    let active = true;
    (async () => {
      let users: MemberUser[] = DEMO_USERS;
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, plan, role")
          .limit(MAX_MEMBERS);
        if (!error && data && data.length) {
          users = data.map((p: { id: string; name: string | null; plan: string; role: string }) => ({
            id: p.id,
            name: p.name || "Member",
            tier: resolveTier(p.role, p.plan),
          }));
        }
      }
      if (!active) return;
      const w = wrapRef.current?.clientWidth ?? 800;
      const h = wrapRef.current?.clientHeight ?? 520;
      buildNodes(users, w, h);
    })();
    return () => {
      active = false;
    };
  }, [buildNodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c: CanvasRenderingContext2D = ctx;

    let raf = 0;
    let W = 0;
    let H = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap!.clientWidth;
      H = wrap!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      const nodes = nodesRef.current;
      c.clearRect(0, 0, W, H);

      // Move nodes (gentle drift + wall bounce).
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 6 || n.x > W - 6) n.vx *= -1;
        if (n.y < 6 || n.y > H - 6) n.vy *= -1;
        n.x = Math.max(6, Math.min(W - 6, n.x));
        n.y = Math.max(6, Math.min(H - 6, n.y));
      }

      // Edges between nearby nodes.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.22;
            c.strokeStyle = `rgba(244,63,94,${alpha})`;
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(a.x, a.y);
            c.lineTo(b.x, b.y);
            c.stroke();
          }
        }
      }

      // Hover detection.
      let hovered: Node | null = null;
      const m = mouseRef.current;
      if (m) {
        let best = HOVER_DIST;
        for (const n of nodes) {
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < best) {
            best = d;
            hovered = n;
          }
        }
      }

      // Nodes.
      for (const n of nodes) {
        const color = tierColors[n.tier] ?? tierColors.free;
        const isH = hovered === n;
        c.beginPath();
        c.arc(n.x, n.y, isH ? n.r + 2.5 : n.r, 0, Math.PI * 2);
        c.fillStyle = color;
        c.shadowColor = color;
        c.shadowBlur = isH ? 18 : 8;
        c.fill();
        c.shadowBlur = 0;
      }

      if (hovered) {
        setHover({ x: hovered.x, y: hovered.y, name: hovered.name, tier: hovered.tier });
      } else {
        setHover(null);
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = null;
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative h-full min-h-[400px] w-full overflow-hidden rounded-2xl border border-[#f43f5e]/20 bg-[#0a0408]/60"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-lg border border-white/15 bg-[#0a0408]/95 px-3 py-1.5 text-xs shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <span className="font-semibold text-white">{hover.name}</span>
          <span className="ml-2 text-gray-400">{getPlanLabel(hover.tier)}</span>
        </div>
      )}
    </div>
  );
}
