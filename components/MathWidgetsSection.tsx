"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sigma, Timer, ArrowRight } from "lucide-react";
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
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        {/* Problem of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-[#22d3ee]/20 bg-[#0f172a]/70 p-7 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-[#22d3ee]">
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
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#22d3ee] hover:gap-2.5 transition-all"
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
          className="rounded-2xl border border-[#a855f7]/20 bg-[#0f172a]/70 p-7 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-[#a855f7]">
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
      </div>
    </section>
  );
}
