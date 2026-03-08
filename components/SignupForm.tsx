"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, isSupabaseConfigured, ensureProfile } from "@/lib/supabaseClient";

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // hCaptcha hidden for now — will be re-enabled later

  const handleSignup = async (e: React.FormEvent) => {
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
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (authError) {
        const code = (authError as { code?: string }).code;
        if (code === "user_already_exists" || authError.message.includes("already registered")) {
          setError("An account with this email already exists.");
        } else if (code === "weak_password" || authError.message.includes("password")) {
          setError("Password must be at least 6 characters long.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // When email confirmations are enabled, Supabase returns a user with an
      // empty identities array instead of an error for duplicate emails.
      // See: https://github.com/supabase/supabase-js/issues/296
      if (data?.user && data.user.identities?.length === 0) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      // Best-effort: create the profile row now if the user already has a
      // session (email confirmation disabled).  When email confirmation is
      // enabled the session won't exist yet, so ensureProfile will run on
      // the first login instead.
      if (data?.user && data?.session) {
        await ensureProfile(data.user);
      }

      setSuccess(true);
      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className="flex flex-col items-center py-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Success icon */}
        <motion.div
          className="w-16 h-16 rounded-full bg-[#2563eb]/20 flex items-center justify-center mb-5"
          style={{ boxShadow: "0 0 25px rgba(37,99,235,0.3)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <svg
            className="w-8 h-8 text-[#38bdf8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <motion.p
          className="text-white text-base font-semibold mb-2"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Account created successfully
        </motion.p>
        <motion.p
          className="text-gray-400 text-sm text-center mb-6"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Please check your email to verify your account.
        </motion.p>

        <motion.button
          onClick={onSwitchToLogin}
          className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all duration-300"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Return to Login
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSignup}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
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

      {/* Full Name */}
      <div className="mb-4">
        <label
          className="block text-gray-400 text-xs mb-1.5 tracking-wider uppercase"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
        >
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#2563eb]/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-300"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          placeholder="Your full name"
        />
      </div>

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
          minLength={6}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#2563eb]/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-300"
          style={{ fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif" }}
          placeholder="Min 6 characters"
        />
      </div>

      {/* Signup button */}
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
            Creating account...
          </span>
        ) : (
          "Sign Up"
        )}
      </motion.button>
    </motion.form>
  );
}
