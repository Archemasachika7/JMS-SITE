"use client";
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  speed: number;
  twinkle: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
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

    // Stars
    const stars: Star[] = [];
    const starCount = Math.min(1500, Math.floor((canvas.width * canvas.height) / 1200));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.005 + 0.001,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    // Shooting stars
    const shootingStars: ShootingStar[] = [];

    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height * 0.5,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 4,
        angle: Math.PI / 6 + Math.random() * (Math.PI / 6),
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
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

      // Draw stars with parallax
      stars.forEach((s) => {
        s.twinkle += s.speed;
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.twinkle));
        const parallaxY = s.y - scrollY * (s.r * 0.05);
        const drawY =
          ((parallaxY % canvas.height) + canvas.height) % canvas.height;

        ctx.beginPath();
        ctx.arc(s.x, drawY, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165,243,252,${alpha * 0.8})`;
        ctx.fill();
      });

      // Draw constellation lines
      if (time - lastConstellationTime > 8000 + Math.random() * 5000) {
        spawnConstellation();
        lastConstellationTime = time;
      }

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

        const parallaxY1 = cl.y1 - scrollY * 0.03;
        const parallaxY2 = cl.y2 - scrollY * 0.03;

        ctx.beginPath();
        ctx.moveTo(cl.x1, parallaxY1);
        ctx.lineTo(cl.x2, parallaxY2);
        ctx.strokeStyle = `rgba(34,211,238,${cl.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.shadowColor = "rgba(34,211,238,0.5)";
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Spawn shooting stars periodically
      if (time - lastShootingStarTime > 3000 + Math.random() * 4000) {
        spawnShootingStar();
        lastShootingStarTime = time;
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity = 1 - ss.life / ss.maxLife;

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, `rgba(165,243,252,0)`);
        gradient.addColorStop(1, `rgba(165,243,252,${ss.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

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
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ position: "fixed", top: 0, left: 0 }}
    />
  );
}
