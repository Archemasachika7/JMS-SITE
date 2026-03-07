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

  const handleGoogleLogin = async () => {
    if (loading) return;

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Please copy .env.example to .env.local and add your Supabase project credentials."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      }
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
              fontFamily: "'Space Mono', monospace",
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
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]/60 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
          style={{ fontFamily: "'Space Mono', monospace" }}
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label
          className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]/60 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
          style={{ fontFamily: "'Space Mono', monospace" }}
          placeholder="••••••••"
        />
      </div>

      {/* Login button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-semibold text-sm tracking-wider shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        style={{ fontFamily: "'Orbitron', monospace" }}
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

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span
          className="text-gray-500 text-xs"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          or
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Google button */}
      <motion.button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
        style={{ fontFamily: "'Space Mono', monospace" }}
        whileHover={loading ? {} : { scale: 1.02 }}
        whileTap={loading ? {} : { scale: 0.98 }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </motion.button>
    </motion.form>
  );
}
