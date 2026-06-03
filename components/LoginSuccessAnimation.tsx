"use client";

import { motion } from "framer-motion";

export default function LoginSuccessAnimation() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Glowing ring */}
      <motion.div
        className="relative w-24 h-24 mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(225,29,72,0.4) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#e11d48]"
          style={{
            boxShadow:
              "0 0 20px rgba(225,29,72,0.5), inset 0 0 20px rgba(225,29,72,0.1)",
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear" }}
        />
        {/* Checkmark */}
        <motion.svg
          className="absolute inset-0 m-auto w-10 h-10 text-[#fb7185]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>

      {/* Success text */}
      <motion.p
        className="text-white text-lg font-semibold mb-2"
        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        Login successful
      </motion.p>
      <motion.p
        className="text-gray-400 text-sm"
        style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        Preparing your dashboard...
      </motion.p>
    </motion.div>
  );
}
