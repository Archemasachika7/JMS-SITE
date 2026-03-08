"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getPlanLabel, getPlanColor } from "@/lib/memberUtils";

interface MemberProfileCardProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  name: string;
  profileImage: string;
  bio: string;
  membershipPlan: string;
}

export default function MemberProfileCard({
  visible,
  onClose,
  userId,
  name,
  profileImage,
  bio,
  membershipPlan,
}: MemberProfileCardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm"
          >
            <div className="rounded-2xl border border-white/10 bg-[#07091a]/95 backdrop-blur-xl p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Profile image */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div
                    className="absolute -inset-1 rounded-full opacity-60 blur-sm"
                    style={{
                      background: `radial-gradient(circle, ${getPlanColor(membershipPlan)}40, transparent)`,
                    }}
                  />
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#2563eb] to-[#10b981] flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8 text-white fill-current"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <h3
                className="text-center text-white text-lg font-bold"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {name || "AstroSci Member"}
              </h3>

              {/* Plan badge */}
              <div className="flex justify-center mt-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif",
                    color: getPlanColor(membershipPlan),
                    borderColor: `${getPlanColor(membershipPlan)}40`,
                    backgroundColor: `${getPlanColor(membershipPlan)}10`,
                  }}
                >
                  {getPlanLabel(membershipPlan)}
                </span>
              </div>

              {/* Bio */}
              {bio && (
                <p
                  className="text-gray-400 text-sm text-center mt-4 leading-relaxed"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  {bio}
                </p>
              )}

              {/* View Profile button */}
              <div className="flex justify-center mt-6">
                <Link href={`/profile/${userId}`}>
                  <motion.span
                    className="inline-flex px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300 cursor-pointer"
                    style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Profile
                  </motion.span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
