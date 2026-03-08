"use client";
import { useRef, useEffect, useState } from "react";
import { Application } from "@splinetool/runtime";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/6nJ4uC-0Hej7Q8l7/scene.splinecode";

export default function SplineEarth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    let disposed = false;
    const app = new Application(canvasRef.current);

    app
      .load(SPLINE_SCENE_URL)
      .then(() => {
        if (!disposed) setLoaded(true);
      })
      .catch(() => {
        if (!disposed) setError(true);
      });

    return () => {
      disposed = true;
      try {
        app.dispose();
      } catch {
        // ignore dispose errors during unmount
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "300px" }}>
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2563eb]/20 to-[#0c1e3d] flex items-center justify-center">
          <span className="text-3xl">🌍</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ minHeight: "300px" }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2563eb]/30 to-[#0c1e3d] animate-pulse" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease-in" }}
      />
    </div>
  );
}
