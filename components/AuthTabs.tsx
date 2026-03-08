"use client";

import { motion } from "framer-motion";

interface AuthTabsProps {
  activeTab: "login" | "signup";
  onTabChange: (tab: "login" | "signup") => void;
}

export default function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex relative mb-6 rounded-xl bg-white/5 p-1">
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-lg bg-[#2563eb]/30"
        style={{
          boxShadow: "0 0 15px rgba(37,99,235,0.4)",
          width: "calc(50% - 4px)",
        }}
        animate={{ x: activeTab === "login" ? 4 : "calc(100% + 4px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <button
        className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
          activeTab === "login" ? "text-white" : "text-gray-400 hover:text-gray-300"
        }`}
        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        onClick={() => onTabChange("login")}
      >
        Login
      </button>
      <button
        className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
          activeTab === "signup" ? "text-white" : "text-gray-400 hover:text-gray-300"
        }`}
        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        onClick={() => onTabChange("signup")}
      >
        Sign Up
      </button>
    </div>
  );
}
