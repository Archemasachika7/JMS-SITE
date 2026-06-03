"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronRight, X, Info } from "lucide-react";
import { create, all } from "mathjs";

const math = create(all);

type HistoryEntry = {
  input: string;
  result: string;
  isError: boolean;
};

const QUICK_EXAMPLES = [
  "sin(pi/4)",
  "derivative('x^3 + 2x', 'x')",
  "det([[1,2],[3,4]])",
  "sqrt(2)^10",
  "factorial(10)",
  "log(1000, 10)",
  "simplify('x^2 + x + 3 + x^2 + x + 3')",
  "integrate('x^2', 'x')",
  "((1 + sqrt(5)) / 2)",
];

function evaluate(expr: string): { result: string; isError: boolean } {
  try {
  
    const result = math.evaluate(expr) as any;
    const formatted =
      typeof result === "object" && result !== null
        ? math.format(result, { precision: 8 })
        : typeof result === "number"
        ? math.format(result, { precision: 10 })
        : String(result);
    return { result: formatted, isError: false };
  } catch (e) {
    return { result: (e as Error).message, isError: true };
  }
}

export default function MathEvaluator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showInfo, setShowInfo] = useState(false);

  const run = useCallback(() => {
    if (!input.trim()) return;
    const { result, isError } = evaluate(input.trim());
    setHistory((prev) => [{ input: input.trim(), result, isError }, ...prev].slice(0, 30));
    if (!isError) setInput("");
  }, [input]);

  function tryExample(e: string) {
    const { result, isError } = evaluate(e);
    setHistory((prev) => [{ input: e, result, isError }, ...prev].slice(0, 30));
  }

  return (
    <div className="rounded-2xl border border-[#f43f5e]/20 bg-[#0f172a]/80 backdrop-blur-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-[#f43f5e]">
          <Calculator className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.3em]">
            Math Evaluator
          </span>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-500 hover:text-[#fb7185] transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/5"
          >
            <div className="px-6 py-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-gray-500">
              <span><span className="text-gray-400 font-mono">sin, cos, tan, log</span> — trig &amp; log</span>
              <span><span className="text-gray-400 font-mono">sqrt, abs, factorial</span> — common fns</span>
              <span><span className="text-gray-400 font-mono">pi, e, phi, Infinity</span> — constants</span>
              <span><span className="text-gray-400 font-mono">{"derivative('f','x')"}</span> — symbolic diff</span>
              <span><span className="text-gray-400 font-mono">{"integrate('f','x')"}</span> — symbolic integral</span>
              <span><span className="text-gray-400 font-mono">{"simplify('expr')"}</span> — simplification</span>
              <span><span className="text-gray-400 font-mono">det([[…]])</span> — matrix ops</span>
              <span><span className="text-gray-400 font-mono">gcd(a,b), lcm(a,b)</span> — number theory</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2 min-h-[200px] max-h-[300px]">
        {history.length === 0 && (
          <p className="text-xs text-gray-600 mt-2">
            Results appear here. Try an expression below or click an example.
          </p>
        )}
        <AnimatePresence initial={false}>
          {history.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group"
            >
              <div className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-[#f43f5e] mt-0.5 flex-shrink-0" />
                <span className="font-mono text-sm text-gray-300 break-all">{h.input}</span>
              </div>
              <div className="ml-5 mt-0.5">
                <span
                  className={`font-mono text-sm break-all ${
                    h.isError ? "text-rose-400" : "text-[#fb7185] font-semibold"
                  }`}
                >
                  = {h.result}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Examples */}
      <div className="px-6 py-3 border-t border-white/5 flex gap-1.5 flex-wrap">
        {QUICK_EXAMPLES.map((e) => (
          <button
            key={e}
            onClick={() => tryExample(e)}
            className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 hover:border-[#f43f5e]/40 hover:text-[#fb7185] hover:bg-[#f43f5e]/5 transition-all"
          >
            {e}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 pb-5 pt-3 border-t border-white/5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="2 + 2, sin(pi/6), derivative('x^3','x')…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-[#f43f5e]/50 focus:bg-white/8 transition-all pr-8"
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={run}
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#f43f5e]/20 border border-[#f43f5e]/30 text-[#f43f5e] text-sm font-medium hover:bg-[#f43f5e]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Run
          </button>
        </div>
        <p className="text-[11px] text-gray-600 mt-2">
          Powered by <span className="text-gray-500">math.js</span> — supports symbolic math, matrices, complex numbers
        </p>
      </div>
    </div>
  );
}
