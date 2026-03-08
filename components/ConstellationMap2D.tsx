"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { resolveTier } from "@/lib/memberUtils";

/* ── Tier colour palette & labels ─────────────────── */
const tierColors: Record<string, string> = {
  free: "#ADD8E6",
  monthly: "#FFD700",
  annual: "#FF8C00",
  core: "#FF00FF",
};

const tierLabels: Record<string, string> = {
  free: "Free Member",
  monthly: "Monthly Subscriber",
  annual: "Annual Subscriber",
  core: "Core Team Member",
};

/* ── Types ────────────────────────────────────────── */
interface MemberProfile {
  id: string;
  name: string;
  plan: string;
  role: string;
}

interface MemberUser {
  id: string;
  name: string;
  tier: string;
}

interface BgStar {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
}

interface MemberStar {
  x: number;
  y: number;
  user: MemberUser;
  baseRadius: number;
  phase: number;
  speed: number;
}

/* ── Constants ────────────────────────────────────── */
const BG_STAR_COUNT = 400;
const MIN_SPACING = 40;
const CLUSTER_MIN = 5;
const CLUSTER_MAX = 10;
const HOVER_DIST = 24;
const MAX_MEMBERS = 500;

/* ── Demo data (when Supabase is not configured) ──── */
const DEMO_USERS: MemberUser[] = [
  { id: "1", name: "Alice", tier: "core" },
  { id: "2", name: "Bob", tier: "annual" },
  { id: "3", name: "Charlie", tier: "monthly" },
  { id: "4", name: "Dave", tier: "free" },
  { id: "5", name: "Eve", tier: "core" },
  { id: "6", name: "Frank", tier: "annual" },
  { id: "7", name: "Grace", tier: "monthly" },
  { id: "8", name: "Heidi", tier: "free" },
  { id: "9", name: "Ivan", tier: "annual" },
  { id: "10", name: "Judy", tier: "monthly" },
  { id: "11", name: "Karl", tier: "free" },
  { id: "12", name: "Liam", tier: "core" },
  { id: "13", name: "Mia", tier: "annual" },
  { id: "14", name: "Noah", tier: "monthly" },
  { id: "15", name: "Olivia", tier: "free" },
  { id: "16", name: "Paul", tier: "annual" },
  { id: "17", name: "Quinn", tier: "core" },
  { id: "18", name: "Rita", tier: "monthly" },
  { id: "19", name: "Sam", tier: "free" },
  { id: "20", name: "Tina", tier: "annual" },
  { id: "21", name: "Uma", tier: "monthly" },
  { id: "22", name: "Vince", tier: "free" },
  { id: "23", name: "Wendy", tier: "core" },
  { id: "24", name: "Xander", tier: "annual" },
  { id: "25", name: "Yara", tier: "free" },
  { id: "26", name: "Zara", tier: "monthly" },
  { id: "27", name: "Aaron", tier: "free" },
  { id: "28", name: "Bella", tier: "annual" },
  { id: "29", name: "Caleb", tier: "monthly" },
  { id: "30", name: "Diana", tier: "free" },
];

/* ── Helpers ──────────────────────────────────────── */
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/* ── Background stars ─────────────────────────────── */
function makeBgStars(W: number, H: number): BgStar[] {
  const stars: BgStar[] = [];
  for (let i = 0; i < BG_STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: rand(0.4, 1.4),
      baseAlpha: rand(0.15, 0.55),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.3, 1.2),
    });
  }
  return stars;
}

/* ── Place member stars with spacing ──────────────── */
function placeMemberStars(
  users: MemberUser[],
  W: number,
  H: number,
): MemberStar[] {
  const stars: MemberStar[] = [];
  const edgePadding = 60;
  for (let i = 0; i < users.length; i++) {
    let placed = false;
    for (let attempt = 0; attempt < 200; attempt++) {
      const sx = rand(edgePadding, W - edgePadding);
      const sy = rand(edgePadding, H - edgePadding);
      let tooClose = false;
      for (let j = 0; j < stars.length; j++) {
        if (dist({ x: sx, y: sy }, stars[j]) < MIN_SPACING) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) {
        stars.push({
          x: sx,
          y: sy,
          user: users[i],
          baseRadius: rand(3, 5),
          phase: rand(0, Math.PI * 2),
          speed: rand(0.4, 1.0),
        });
        placed = true;
        break;
      }
    }
    if (!placed) {
      stars.push({
        x: rand(edgePadding, W - edgePadding),
        y: rand(edgePadding, H - edgePadding),
        user: users[i],
        baseRadius: rand(3, 5),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.4, 1.0),
      });
    }
  }
  return stars;
}

/* ── Build constellation clusters ─────────────────── */
function buildConstellations(count: number): number[][] {
  const indices: number[] = [];
  for (let i = 0; i < count; i++) indices.push(i);

  // Fisher–Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = indices[i];
    indices[i] = indices[j];
    indices[j] = swap;
  }

  const groups: number[][] = [];
  let pos = 0;
  while (pos < indices.length) {
    const remaining = indices.length - pos;
    let size: number;
    if (remaining <= CLUSTER_MAX) {
      size = remaining;
    } else if (remaining < CLUSTER_MIN + CLUSTER_MIN) {
      size = remaining;
    } else {
      size = Math.floor(rand(CLUSTER_MIN, CLUSTER_MAX + 1));
      if (remaining - size < CLUSTER_MIN) {
        size = remaining - CLUSTER_MIN;
      }
    }
    groups.push(indices.slice(pos, pos + size));
    pos += size;
  }
  return groups;
}

/* ── Build edges within each constellation (MST + extras) ── */
function constellationEdges(
  group: number[],
  memberStars: MemberStar[],
): [number, number][] {
  if (group.length < 2) return [];

  const inTree: Record<number, boolean> = {};
  inTree[group[0]] = true;
  const edges: [number, number][] = [];

  while (Object.keys(inTree).length < group.length) {
    let bestDist = Infinity;
    let bestA = -1;
    let bestB = -1;
    for (let i = 0; i < group.length; i++) {
      if (!inTree[group[i]]) continue;
      for (let j = 0; j < group.length; j++) {
        if (inTree[group[j]]) continue;
        const d = dist(memberStars[group[i]], memberStars[group[j]]);
        if (d < bestDist) {
          bestDist = d;
          bestA = group[i];
          bestB = group[j];
        }
      }
    }
    if (bestA !== -1) {
      edges.push([bestA, bestB]);
      inTree[bestB] = true;
    }
  }

  const extras = Math.min(2, Math.floor(group.length / 4));
  for (let e = 0; e < extras; e++) {
    const a = group[Math.floor(Math.random() * group.length)];
    const b = group[Math.floor(Math.random() * group.length)];
    if (a !== b) {
      let dup = false;
      for (let k = 0; k < edges.length; k++) {
        if (
          (edges[k][0] === a && edges[k][1] === b) ||
          (edges[k][0] === b && edges[k][1] === a)
        ) {
          dup = true;
          break;
        }
      }
      if (!dup) edges.push([a, b]);
    }
  }
  return edges;
}

/* ── Precompute all edges ─────────────────────────── */
function buildAllEdges(
  constellations: number[][],
  memberStars: MemberStar[],
): [number, number][] {
  const all: [number, number][] = [];
  for (let c = 0; c < constellations.length; c++) {
    const edges = constellationEdges(constellations[c], memberStars);
    for (let e = 0; e < edges.length; e++) {
      all.push(edges[e]);
    }
  }
  return all;
}

/* ================================================================
   Component
   ================================================================ */
export default function ConstellationMap2D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Mutable scene data kept in a ref so the render loop can access
  // the latest values without triggering React re-renders.
  const scene = useRef({
    W: 0,
    H: 0,
    bgStars: [] as BgStar[],
    memberStars: [] as MemberStar[],
    allEdges: [] as [number, number][],
    mouseX: -1000,
    mouseY: -1000,
    users: [] as MemberUser[],
  });

  /* ── Rebuild scene geometry from current users ───── */
  const rebuild = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    canvas.width = W;
    canvas.height = H;

    const s = scene.current;
    s.W = W;
    s.H = H;
    s.bgStars = makeBgStars(W, H);
    s.memberStars = placeMemberStars(s.users, W, H);
    const groups = buildConstellations(s.memberStars.length);
    s.allEdges = buildAllEdges(groups, s.memberStars);
  }, []);

  /* ── Fetch member data ──────────────────────────── */
  const loadMembers = useCallback(async () => {
    let members: MemberUser[];

    if (!isSupabaseConfigured()) {
      members = DEMO_USERS;
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, plan, role")
        .limit(MAX_MEMBERS);

      if (error) {
        console.warn("[constellation] fetch error:", error.message);
        members = DEMO_USERS;
      } else {
        members = ((data || []) as MemberProfile[]).map((p) => ({
          id: p.id,
          name: p.name || "Member",
          tier: resolveTier(p.role, p.plan),
        }));
      }
    }

    scene.current.users = members;
    rebuild();
  }, [rebuild]);

  /* ── Mount: start render loop, fetch data, observe resize ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const tipEl = tipRef.current;
    if (!canvas || !tipEl) return;

    const ctx = canvas.getContext("2d")!;
    const tipNameEl = tipEl.querySelector(".tip-name") as HTMLElement;
    const tipTierEl = tipEl.querySelector(".tip-tier") as HTMLElement;

    // Capture narrowed non-null refs for use inside the render closure
    const tip = tipEl;

    /* mouse tracking (coordinates relative to canvas) */
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      scene.current.mouseX = e.clientX - rect.left;
      scene.current.mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      scene.current.mouseX = -1000;
      scene.current.mouseY = -1000;
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    /* render loop */
    function render(time: number) {
      const s = scene.current;
      const { W, H, bgStars, memberStars: mStars, allEdges } = s;
      if (!W || !H) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const t = time * 0.001;

      // background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#020617");
      grad.addColorStop(0.5, "#0a0f2e");
      grad.addColorStop(1, "#020617");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // background stars (twinkle)
      for (let i = 0; i < bgStars.length; i++) {
        const st = bgStars[i];
        let alpha = st.baseAlpha + 0.2 * Math.sin(t * st.speed + st.phase);
        if (alpha < 0.05) alpha = 0.05;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
        ctx.fill();
      }

      // constellation lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      for (let i = 0; i < allEdges.length; i++) {
        const a = mStars[allEdges[i][0]];
        const b = mStars[allEdges[i][1]];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // member stars + hover
      let hoveredStar: MemberStar | null = null;
      for (let i = 0; i < mStars.length; i++) {
        const m = mStars[i];
        const color = tierColors[m.user.tier] || tierColors.free;
        const pulse = 1 + 0.15 * Math.sin(t * m.speed * 2 + m.phase);
        let r = m.baseRadius * pulse;

        const dx = s.mouseX - m.x;
        const dy = s.mouseY - m.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const isHovered = d < HOVER_DIST;
        if (isHovered) {
          hoveredStar = m;
          r *= 1.5;
        }

        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = isHovered ? 28 : 12;
        ctx.beginPath();
        ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }

      // tooltip
      if (hoveredStar) {
        tipNameEl.textContent = hoveredStar.user.name;
        tipTierEl.textContent =
          tierLabels[hoveredStar.user.tier] || "Member";
        tipTierEl.style.color =
          tierColors[hoveredStar.user.tier] || "#94a3b8";
        tip.style.opacity = "1";

        let tx = s.mouseX + 16;
        let ty = s.mouseY - 10;
        const tw = tip.offsetWidth;
        const th = tip.offsetHeight;
        if (tx + tw > W - 8) tx = s.mouseX - tw - 12;
        if (ty + th > H - 8) ty = H - th - 8;
        if (ty < 8) ty = 8;
        tip.style.left = tx + "px";
        tip.style.top = ty + "px";
      } else {
        tip.style.opacity = "0";
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    /* observe container size changes */
    const ro = new ResizeObserver(() => rebuild());
    if (wrapRef.current) ro.observe(wrapRef.current);

    /* load data */
    loadMembers();

    /* realtime subscription for new members */
    let channel: ReturnType<typeof supabase.channel> | null = null;
    if (isSupabaseConfigured()) {
      channel = supabase
        .channel("constellation-profiles")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "profiles" },
          () => loadMembers(),
        )
        .subscribe();
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      ro.disconnect();
      if (channel) supabase.removeChannel(channel);
    };
  }, [rebuild, loadMembers]);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

      {/* Tooltip overlay */}
      <div
        ref={tipRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          padding: "8px 14px",
          borderRadius: 8,
          background: "rgba(7,9,26,0.88)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(6px)",
          color: "#e2e8f0",
          fontSize: 13,
          lineHeight: 1.45,
          opacity: 0,
          transition: "opacity 0.15s ease",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      >
        <div className="tip-name" style={{ fontWeight: 700, marginBottom: 2 }} />
        <div className="tip-tier" style={{ fontSize: 11, color: "#94a3b8" }} />
      </div>
    </div>
  );
}
