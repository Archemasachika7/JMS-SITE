"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sigma, Timer, ArrowRight, Calculator, TrendingUp, Hash } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { siteConfig } from "@/config/siteConfig";

type Problem = {
  id: string;
  title: string;
  statement: string | null;
  difficulty: string | null;
  topic: string | null;
};

const diffColor: Record<string, string> = {
  easy: "text-emerald-300",
  medium: "text-amber-300",
  hard: "text-rose-300",
};

function getRemaining(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

export default function MathWidgetsSection() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [remaining, setRemaining] = useState(() =>
    getRemaining(siteConfig.nextEvent.date)
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoaded(true);
      return;
    }
    (async () => {
      try {
        const { data } = await supabase
          .from("problems")
          .select("id, title, statement, difficulty, topic")
          .eq("is_published", true)
          .order("problem_date", { ascending: false })
          .limit(1)
          .maybeSingle();
        setProblem(data as Problem | null);
      } catch {
        // ignore — section degrades gracefully
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setRemaining(getRemaining(siteConfig.nextEvent.date)),
      1000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-6xl mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#e11d48]" />
          <span className="text-xs tracking-[0.4em] text-[#fb7185] uppercase">Interactive</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#e11d48]" />
        </div>
        <h2 className="text-3xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Math at your fingertips
        </h2>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        {/* Problem of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-[#f43f5e]/20 bg-[#0f172a]/70 p-7 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-[#f43f5e]">
            <Sigma className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">
              Problem of the Day
            </span>
          </div>

          {!loaded ? (
            <div className="h-24 animate-pulse rounded-lg bg-white/5" />
          ) : problem ? (
            <>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {problem.title}
                </h3>
                {problem.difficulty && (
                  <span
                    className={`text-xs font-medium ${
                      diffColor[problem.difficulty] ?? "text-gray-400"
                    }`}
                  >
                    • {problem.difficulty}
                  </span>
                )}
              </div>
              {problem.statement && (
                <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-400">
                  {problem.statement}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400">
              No problem published yet — admins can add one from the dashboard.
            </p>
          )}

          <Link
            href="/problems"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#f43f5e] hover:gap-2.5 transition-all"
          >
            Browse the problem archive <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Event countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-[#fb7185]/20 bg-[#0f172a]/70 p-7 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-[#fb7185]">
            <Timer className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">
              Counting down to
            </span>
          </div>
          <h3
            className="mb-5 text-xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {siteConfig.nextEvent.label}
          </h3>

          {remaining ? (
            <div className="grid grid-cols-4 gap-3">
              {[
                { v: remaining.days, l: "Days" },
                { v: remaining.hours, l: "Hours" },
                { v: remaining.mins, l: "Min" },
                { v: remaining.secs, l: "Sec" },
              ].map((u) => (
                <div
                  key={u.l}
                  className="rounded-xl border border-white/10 bg-[#0b1220] py-4 text-center"
                >
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {String(u.v).padStart(2, "0")}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">
                    {u.l}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Happening now — or freshly concluded. Stay tuned for the next one.
            </p>
          )}
        </motion.div>

        {/* Math Tools promo — spans full width on large screens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-[#f43f5e]/20 bg-gradient-to-br from-[#0f172a]/90 to-[#0b1220]/90 p-7 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#f43f5e]">
                <Calculator className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em]">
                  Math Tools — Desmos · math.js · Number Theory
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Your interactive math lab
              </h3>
              <p className="text-sm text-gray-400 max-w-xl">
                Graph any function, evaluate symbolic expressions (derivatives, integrals, matrices),
                and explore number theory — all without leaving the browser.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end shrink-0">
              {[
                { icon: TrendingUp, label: "Graphing Calc" },
                { icon: Calculator, label: "Symbolic Math" },
                { icon: Hash, label: "Number Theory" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Icon className="h-3.5 w-3.5 text-[#f43f5e]" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/math-tools"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#f43f5e] hover:gap-2.5 transition-all"
          >
            Open Math Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
