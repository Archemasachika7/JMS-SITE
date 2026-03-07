"use client";
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  opacity: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  dirX: number;
  dirY: number;
  length: number;
  opacity: number;
}

interface ConstellationLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  phase: "in" | "visible" | "out";
  life: number;
  maxLife: number;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    setSize();

    // Stars: generate 600–1200
    const stars: Star[] = [];
    const starCount = Math.floor(Math.random() * 601) + 600;
    for (let i = 0; i < starCount; i++) {
      const baseOpacity = Math.random() * 0.5 + 0.3;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        baseOpacity,
        opacity: baseOpacity,
        twinkleSpeed: Math.random() * 0.003 + 0.001,
      });
    }

    // Shooting stars
    const shootingStars: ShootingStar[] = [];

    function spawnShootingStar() {
      const angle = Math.PI / 6 + Math.random() * (Math.PI / 6);
      const speed = Math.random() * 6 + 4;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      shootingStars.push({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height * 0.5,
        velocityX: vx,
        velocityY: vy,
        dirX: Math.cos(angle),
        dirY: Math.sin(angle),
        length: Math.random() * 80 + 40,
        opacity: 1,
      });
    }

    // Constellation lines
    const constellationLines: ConstellationLine[] = [];
    const maxConstellations = 3;

    function spawnConstellation() {
      if (constellationLines.length >= maxConstellations * 4) return;

      // Pick a random cluster of nearby stars
      const centerIdx = Math.floor(Math.random() * stars.length);
      const center = stars[centerIdx];
      const nearby = stars
        .filter(
          (s) =>
            s !== center &&
            Math.abs(s.x - center.x) < 200 &&
            Math.abs(s.y - center.y) < 200
        )
        .slice(0, 5);

      if (nearby.length < 2) return;

      // Connect nearby stars with lines
      for (let i = 0; i < nearby.length - 1; i++) {
        constellationLines.push({
          x1: nearby[i].x,
          y1: nearby[i].y,
          x2: nearby[i + 1].x,
          y2: nearby[i + 1].y,
          opacity: 0,
          phase: "in",
          life: 0,
          maxLife: 300 + Math.random() * 200,
        });
      }
      // Close the constellation
      if (nearby.length > 2) {
        constellationLines.push({
          x1: nearby[nearby.length - 1].x,
          y1: nearby[nearby.length - 1].y,
          x2: center.x,
          y2: center.y,
          opacity: 0,
          phase: "in",
          life: 0,
          maxLife: 300 + Math.random() * 200,
        });
      }
    }

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    let animFrame: number;
    let lastShootingStarTime = 0;
    let lastConstellationTime = 0;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars with parallax
      stars.forEach((s) => {
        s.opacity = s.baseOpacity + Math.sin(time * s.twinkleSpeed) * 0.1;
        const parallaxY = s.y - scrollY * 0.05;
        const drawY =
          ((parallaxY % canvas.height) + canvas.height) % canvas.height;

        ctx.beginPath();
        ctx.arc(s.x, drawY, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165,243,252,${s.opacity})`;
        ctx.fill();
      });

      // Spawn constellation lines every 6–10 seconds
      if (time - lastConstellationTime > 6000 + Math.random() * 4000) {
        spawnConstellation();
        lastConstellationTime = time;
      }

      // Draw constellation lines
      for (let i = constellationLines.length - 1; i >= 0; i--) {
        const cl = constellationLines[i];
        cl.life++;

        const fadeInDuration = 60;
        const fadeOutStart = cl.maxLife - 60;

        if (cl.phase === "in") {
          cl.opacity = Math.min(1, cl.life / fadeInDuration) * 0.25;
          if (cl.life >= fadeInDuration) cl.phase = "visible";
        } else if (cl.phase === "visible") {
          cl.opacity = 0.25;
          if (cl.life >= fadeOutStart) cl.phase = "out";
        } else {
          cl.opacity = Math.max(0, (cl.maxLife - cl.life) / 60) * 0.25;
        }

        if (cl.life >= cl.maxLife) {
          constellationLines.splice(i, 1);
          continue;
        }

        const parallaxY1 = cl.y1 - scrollY * 0.05;
        const parallaxY2 = cl.y2 - scrollY * 0.05;

        ctx.beginPath();
        ctx.moveTo(cl.x1, parallaxY1);
        ctx.lineTo(cl.x2, parallaxY2);
        ctx.strokeStyle = `rgba(165,243,252,${cl.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.shadowColor = "rgba(165,243,252,0.5)";
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Spawn shooting stars every 5–12 seconds
      if (time - lastShootingStarTime > 5000 + Math.random() * 7000) {
        spawnShootingStar();
        lastShootingStarTime = time;
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.velocityX;
        ss.y += ss.velocityY;
        ss.opacity -= 0.015;

        if (
          ss.opacity <= 0 ||
          ss.x > canvas.width + 100 ||
          ss.y > canvas.height + 100
        ) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - ss.dirX * ss.length;
        const tailY = ss.y - ss.dirY * ss.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, `rgba(165,243,252,0)`);
        gradient.addColorStop(1, `rgba(165,243,252,${ss.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "rgba(165,243,252,0.8)";
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Bright head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${ss.opacity})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };
    animFrame = requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver(() => setSize());
    resizeObserver.observe(document.body);

    window.addEventListener("resize", setSize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}
    />
  );
}
