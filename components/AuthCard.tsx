"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import LoginSuccessAnimation from "./LoginSuccessAnimation";

export default function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLoginSuccess = () => {
    setLoginSuccess(true);
    // Redirect after animation completes
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const handleSignupSuccess = () => {
    setSignupSuccess(true);
  };

  const handleSwitchToLogin = () => {
    setSignupSuccess(false);
    setActiveTab("login");
  };

  return (
    <motion.div
      className="w-full max-w-[420px] mx-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="relative rounded-2xl border border-[#2563eb]/20 bg-[#07091a]/80 backdrop-blur-xl p-8 overflow-hidden"
        style={{
          boxShadow: loginSuccess
            ? "0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(37,99,235,0.2)"
            : "0 0 30px rgba(37,99,235,0.15), 0 0 60px rgba(37,99,235,0.05)",
        }}
        animate={{
          y: [0, -4, 0],
          boxShadow: loginSuccess
            ? [
                "0 0 30px rgba(37,99,235,0.15), 0 0 60px rgba(37,99,235,0.05)",
                "0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(37,99,235,0.2)",
              ]
            : undefined,
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 0.5, ease: "easeOut" },
        }}
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#2563eb]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {loginSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoginSuccessAnimation />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#10b981] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white fill-current"
                    >
                      <path d="M12 2L9.5 8.5H3L8 12.5L6 19L12 15.5L18 19L16 12.5L21 8.5H14.5L12 2Z" />
                    </svg>
                  </div>
                </div>
                <h1
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-[#2563eb] to-[#10b981] bg-clip-text text-transparent">
                    JU Maths Society
                  </span>
                </h1>
                <p
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
                >
                  Decode the universe&apos;s language with fellow problem-solvers.
                </p>
              </motion.div>

              {/* Tabs */}
              {!signupSuccess && (
                <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
              )}

              {/* Form content */}
              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <LoginForm key="login" onSuccess={handleLoginSuccess} />
                ) : (
                  <SignupForm
                    key="signup"
                    onSuccess={handleSignupSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
