"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const DEADLINE = new Date("2026-06-06T11:30:00Z");

function getTimeLeft() {
  const diff = DEADLINE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function RecruitmentBanner() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Don't render after deadline
  if (!timeLeft) return null;

  return (
    <section className="relative overflow-hidden mx-4 md:mx-8 my-6 rounded-2xl">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0f0520 0%, #1a0535 30%, #0a1535 60%, #030818 100%)",
        }}
      />

      {/* Aurora blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 10% 50%, #be123c20 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 70% at 90% 30%, #ec489920 0%, transparent 60%), " +
            "radial-gradient(ellipse 40% 60% at 50% 100%, #e11d4815 0%, transparent 50%)",
        }}
      />

      {/* Animated top rainbow strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg,#be123c,#fb7185,#ec4899,#f97316,#eab308,#22c55e,#e11d48,#be123c)",
          backgroundSize: "200% 100%",
          animation: "rbShift 4s linear infinite",
        }}
      />
      <style>{`@keyframes rbShift { to { background-position: 200% 0; } }`}</style>

      {/* Content */}
      <div className="relative z-10 px-6 py-8 md:py-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">

        {/* Left: text */}
        <div className="flex-1 text-center md:text-left">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{
              background: "linear-gradient(135deg,#be123c20,#ec489920)",
              border: "1px solid #fb718540",
              color: "#fda4af",
              fontFamily: "'Space Grotesk','Inter',sans-serif",
              letterSpacing: "2px",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#fb7185", animation: "pulse 1.5s ease-in-out infinite" }}
            />
            RECRUITMENT OPEN
          </div>

          <h2
            className="text-2xl md:text-3xl font-black mb-2 leading-tight"
            style={{
              fontFamily: "'Space Grotesk','Inter',sans-serif",
              background: "linear-gradient(135deg,#fff 20%,#a5b4fc 50%,#f472b6 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Join JU Maths Society 2025–26
          </h2>

          <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: "'Public Sans','Inter',sans-serif" }}>
            PR · Design · Tech · Video · Content — applications close&nbsp;
            <span className="text-yellow-400 font-semibold">June 6 · 5:00 PM IST</span>
          </p>

          <Link href="/recruitment">
            <span
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white cursor-pointer transition-all duration-200"
              style={{
                background: "linear-gradient(135deg,#be123c,#fb7185,#ec4899)",
                boxShadow: "0 0 20px #fb718550",
                fontFamily: "'Space Grotesk','Inter',sans-serif",
              }}
            >
              Apply Now 🚀
            </span>
          </Link>
        </div>

        {/* Right: countdown */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {[
            { val: timeLeft.days,    lbl: "DAYS",  color: "#f472b6" },
            { val: timeLeft.hours,   lbl: "HRS",   color: "#fb923c" },
            { val: timeLeft.minutes, lbl: "MINS",  color: "#fb7185" },
            { val: timeLeft.seconds, lbl: "SECS",  color: "#4ade80" },
          ].map((b, i) => (
            <div key={b.lbl} className="flex items-center gap-2 md:gap-3">
              <div
                className="flex flex-col items-center rounded-xl px-3 py-2 md:px-4 md:py-3 min-w-[54px]"
                style={{
                  background: "#0d1128",
                  border: `1px solid ${b.color}33`,
                  boxShadow: `0 0 12px ${b.color}15`,
                }}
              >
                <span
                  className="text-xl md:text-2xl font-black leading-none"
                  style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", color: b.color }}
                >
                  {pad(b.val)}
                </span>
                <span
                  className="text-[9px] mt-1"
                  style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", color: "#5a6490", letterSpacing: "2px" }}
                >
                  {b.lbl}
                </span>
              </div>
              {i < 3 && (
                <span className="text-lg font-bold pb-3" style={{ color: "#2a3570" }}>:</span>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Bottom rainbow strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg,#e11d48,#be123c,#fb7185,#ec4899,#f97316,#eab308,#e11d48)",
          backgroundSize: "200% 100%",
          animation: "rbShift 4s linear infinite reverse",
        }}
      />
    </section>
  );
}
