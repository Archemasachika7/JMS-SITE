"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, isSupabaseConfigured, ensureProfile } from "@/lib/supabaseClient";

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // hCaptcha hidden for now — will be re-enabled later

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Please copy .env.example to .env.local and add your Supabase project credentials."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Track login: fetch IP and update profile
      try {
        // Ensure a profiles row exists (fallback for users who signed up
        // before the DB trigger was created or when the trigger failed).
        if (data.user) {
          await ensureProfile(data.user);
        }

        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        if (data.user) {
          await supabase
            .from("profiles")
            .update({
              last_login_at: new Date().toISOString(),
              last_login_ip: ip,
            })
            .eq("id", data.user.id);
        }
      } catch {
        // Non-critical: IP tracking failure should not block login
      }

      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleLogin}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            style={{
              fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif",
              boxShadow: "0 0 15px rgba(239,68,68,0.15)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <div className="mb-4">
        <label
          className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#2563eb]/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-300"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label
          className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#2563eb]/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-300"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          placeholder="••••••••"
        />
      </div>

      {/* Login button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-semibold text-sm tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_35px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        whileHover={loading ? {} : { scale: 1.02 }}
        whileTap={loading ? {} : { scale: 0.98 }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </motion.button>
    </motion.form>
  );
}
