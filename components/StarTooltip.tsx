"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StarTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  name: string;
  profileImage: string;
  membershipPlan: string;
}

function getPlanLabel(plan: string): string {
  switch (plan.toLowerCase()) {
    case "monthly":
      return "Monthly Subscriber";
    case "annual":
      return "Annual Subscriber";
    case "admin":
      return "Core Team";
    default:
      return "Free Member";
  }
}

function getPlanColor(plan: string): string {
  switch (plan.toLowerCase()) {
    case "monthly":
      return "#22d3ee";
    case "annual":
      return "#a855f6";
    case "admin":
      return "#facc15";
    default:
      return "#ffffff";
  }
}

export default function StarTooltip({
  visible,
  x,
  y,
  name,
  profileImage,
  membershipPlan,
}: StarTooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: x + 16,
            top: y - 10,
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-[#07091a]/90 backdrop-blur-md shadow-lg"
            style={{ minWidth: 180 }}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white fill-current"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p
                className="text-white text-sm font-semibold leading-tight"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {name || "AstroSci Member"}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: getPlanColor(membershipPlan),
                }}
              >
                {getPlanLabel(membershipPlan)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
