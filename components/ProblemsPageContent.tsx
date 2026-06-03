"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MathContent from "@/components/MathContent";

export type PublicProblem = {
  id: string;
  title: string;
  statement: string | null;
  solution: string | null;
  difficulty: string | null;
  topic: string | null;
  source: string | null;
  problem_date: string | null;
};

const diffColor: Record<string, string> = {
  easy: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
  medium: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  hard: "text-rose-300 border-rose-500/30 bg-rose-500/10",
};

function ProblemCard({ p, i }: { p: PublicProblem; i: number }) {
  const [showSolution, setShowSolution] = useState(false);
  const hasSolution = Boolean(p.solution && p.solution.trim());

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="rounded-2xl border border-white/10 bg-[#0f172a]/70 p-6"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold text-white">{p.title}</h2>
        {p.difficulty && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
              diffColor[p.difficulty] ?? diffColor.medium
            }`}
          >
            {p.difficulty}
          </span>
        )}
        {p.topic && (
          <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-gray-400">
            {p.topic}
          </span>
        )}
      </div>

      {p.statement && (
        <MathContent text={p.statement} className="leading-relaxed text-gray-300" />
      )}

      {hasSolution && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowSolution((s) => !s)}
            aria-expanded={showSolution}
            className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-4 py-1.5 text-sm font-medium text-[#00F0FF] transition-colors hover:bg-[#00F0FF]/20"
          >
            <motion.span
              animate={{ rotate: showSolution ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              ▸
            </motion.span>
            {showSolution ? "Hide solution" : "Show solution"}
          </button>

          <AnimatePresence initial={false}>
            {showSolution && (
              <motion.div
                key="solution"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-xl border-l-2 border-[#00F0FF]/50 bg-[#00F0FF]/[0.04] p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#00F0FF]/70">
                    Solution
                  </p>
                  <MathContent
                    text={p.solution!}
                    className="leading-relaxed text-gray-300"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
        {p.source && <span>Source: {p.source}</span>}
        {p.problem_date && <span>{p.problem_date}</span>}
      </div>
    </motion.article>
  );
}

export default function ProblemsPageContent({ problems }: { problems: PublicProblem[] }) {
  return (
    <main className="relative min-h-screen bg-[#020617]">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Problem{" "}
            <span className="bg-gradient-to-r from-[#f43f5e] to-[#fb7185] bg-clip-text text-transparent">
              Archive
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Hand-picked problems from the JU Maths Society. Sharpen your
            intuition one theorem at a time.
          </p>
        </motion.div>

        {problems.length === 0 ? (
          <p className="text-center text-gray-500">
            No problems published yet. Check back soon.
          </p>
        ) : (
          <div className="space-y-5">
            {problems.map((p, i) => (
              <ProblemCard key={p.id} p={p} i={i} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
