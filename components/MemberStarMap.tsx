"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import StarTooltip from "./StarTooltip";
import MemberProfileCard from "./MemberProfileCard";

interface MemberProfile {
  id: string;
  name: string;
  profile_image: string;
  plan: string;
  bio: string;
  created_at: string;
}

interface StarNode {
  x: number;
  y: number;
  userId: string;
  name: string;
  profileImage: string;
  membershipPlan: string;
  bio: string;
  radius: number;
  glowRadius: number;
  pulseOffset: number;
  isNew: boolean;
  newAnimProgress: number;
}

const MAX_STARS = 500;

function getStarColor(plan: string): { r: number; g: number; b: number } {
  switch (plan.toLowerCase()) {
    case "monthly":
      return { r: 34, g: 211, b: 238 }; // cyan
    case "annual":
      return { r: 168, g: 85, b: 246 }; // purple
    case "admin":
      return { r: 250, g: 204, b: 21 }; // gold
    default:
      return { r: 255, g: 255, b: 255 }; // white
  }
}

function getStarRadius(plan: string): number {
  switch (plan.toLowerCase()) {
    case "monthly":
      return 3;
    case "annual":
      return 3.5;
    case "admin":
      return 4;
    default:
      return 2;
  }
}

export default function MemberStarMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<StarNode[]>([]);
  const animFrameRef = useRef<number>(0);
  const hoveredStarRef = useRef<StarNode | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    profileImage: "",
    membershipPlan: "",
  });

  const [profileCard, setProfileCard] = useState({
    visible: false,
    userId: "",
    name: "",
    profileImage: "",
    bio: "",
    membershipPlan: "",
  });

  const createStarFromProfile = useCallback(
    (
      profile: MemberProfile,
      canvasWidth: number,
      canvasHeight: number,
      isNew = false
    ): StarNode => {
      const padding = 40;
      return {
        x: padding + Math.random() * (canvasWidth - padding * 2),
        y: padding + Math.random() * (canvasHeight - padding * 2),
        userId: profile.id,
        name: profile.name || "AstroSci Member",
        profileImage: profile.profile_image || "",
        membershipPlan: profile.plan || "free",
        bio: profile.bio || "",
        radius: getStarRadius(profile.plan || "free"),
        glowRadius: getStarRadius(profile.plan || "free") * 3,
        pulseOffset: Math.random() * Math.PI * 2,
        isNew,
        newAnimProgress: isNew ? 0 : 1,
      };
    },
    []
  );

  // Fetch members and set up realtime
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    async function fetchMembers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, profile_image, plan, bio, created_at")
        .limit(MAX_STARS);

      if (error) {
        console.warn("[members] Failed to fetch profiles:", error.message);
        return;
      }

      if (data && canvas) {
        starsRef.current = data.map((p: MemberProfile) =>
          createStarFromProfile(p, canvas.width, canvas.height)
        );
      }
    }

    fetchMembers();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("profiles-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          if (starsRef.current.length >= MAX_STARS) return;
          const profile = payload.new as MemberProfile;
          if (canvas) {
            const newStar = createStarFromProfile(
              profile,
              canvas.width,
              canvas.height,
              true
            );
            starsRef.current.push(newStar);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [createStarFromProfile]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    setSize();
    window.addEventListener("resize", setSize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // Check hover
      let found: StarNode | null = null;
      for (const star of starsRef.current) {
        const dx = mouseRef.current.x - star.x;
        const dy = mouseRef.current.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < star.radius + 8) {
          found = star;
          break;
        }
      }

      hoveredStarRef.current = found;
      canvas.style.cursor = found ? "pointer" : "default";

      if (found) {
        setTooltip({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          name: found.name,
          profileImage: found.profileImage,
          membershipPlan: found.membershipPlan,
        });
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const star of starsRef.current) {
        const dx = mx - star.x;
        const dy = my - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < star.radius + 8) {
          setProfileCard({
            visible: true,
            userId: star.userId,
            name: star.name,
            profileImage: star.profileImage,
            bio: star.bio,
            membershipPlan: star.membershipPlan,
          });
          break;
        }
      }
    };

    // Touch handling for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;

        for (const star of starsRef.current) {
          const dx = mx - star.x;
          const dy = my - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < star.radius + 12) {
            setProfileCard({
              visible: true,
              userId: star.userId,
              name: star.name,
              profileImage: star.profileImage,
              bio: star.bio,
              membershipPlan: star.membershipPlan,
            });
            e.preventDefault();
            break;
          }
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const stars = starsRef.current;

      // Draw constellation lines between nearby stars
      const connectionDist = 120;
      for (let i = 0; i < stars.length; i++) {
        let connections = 0;
        for (let j = i + 1; j < stars.length; j++) {
          if (connections >= 2) break;
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha =
              0.12 *
              (1 - dist / connectionDist) *
              (0.8 + 0.2 * Math.sin(time * 0.0008 + i));
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(165,243,252,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw stars
      for (const star of stars) {
        // Animate new stars
        if (star.isNew && star.newAnimProgress < 1) {
          star.newAnimProgress = Math.min(1, star.newAnimProgress + 0.008);
          if (star.newAnimProgress >= 1) star.isNew = false;
        }

        const animScale = star.isNew
          ? star.newAnimProgress * star.newAnimProgress
          : 1;
        const pulse =
          1 + 0.15 * Math.sin(time * 0.002 + star.pulseOffset) * animScale;
        const isHovered = hoveredStarRef.current === star;
        const color = getStarColor(star.membershipPlan);
        const r = star.radius * pulse * animScale;

        // Glow
        const glowSize = isHovered
          ? star.glowRadius * 2.5
          : star.glowRadius * pulse * animScale;
        const glow = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          glowSize
        );
        const glowAlpha = isHovered ? 0.5 : 0.2 * animScale;
        glow.addColorStop(
          0,
          `rgba(${color.r},${color.g},${color.b},${glowAlpha})`
        );
        glow.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${0.9 * animScale})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(star.x, star.y, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.8 * animScale})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", setSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: "manipulation" }}
      />
      <StarTooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        name={tooltip.name}
        profileImage={tooltip.profileImage}
        membershipPlan={tooltip.membershipPlan}
      />
      <MemberProfileCard
        visible={profileCard.visible}
        onClose={() =>
          setProfileCard((prev) => ({ ...prev, visible: false }))
        }
        userId={profileCard.userId}
        name={profileCard.name}
        profileImage={profileCard.profileImage}
        bio={profileCard.bio}
        membershipPlan={profileCard.membershipPlan}
      />
    </>
  );
}
