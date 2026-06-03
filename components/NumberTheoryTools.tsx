"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, ChevronDown, ChevronUp } from "lucide-react";
import { create, all } from "mathjs";

const math = create(all);

// ── Helpers ──────────────────────────────────────────────────────────────────

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) if (n % i === 0) return false;
  return true;
}

function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors.push(d); n /= d; }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function fibonacci(n: number): bigint[] {
  const seq: bigint[] = [0n, 1n];
  for (let i = 2; i <= n; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return seq.slice(0, n + 1);
}

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}

// ── Sub-tools ─────────────────────────────────────────────────────────────────

function PrimeChecker() {
  const [n, setN] = useState("");
  const [result, setResult] = useState<{ prime: boolean; factors: number[] } | null>(null);

  function check() {
    const num = parseInt(n);
    if (isNaN(num) || num < 1) return;
    setResult({ prime: isPrime(num), factors: primeFactors(num) });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="number"
          value={n}
          onChange={(e) => { setN(e.target.value); setResult(null); }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Enter a number…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#f43f5e]/50 transition-all"
        />
        <button
          onClick={check}
          className="px-4 py-2 rounded-xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-[#f43f5e] text-sm hover:bg-[#f43f5e]/25 transition-all"
        >
          Check
        </button>
      </div>
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 space-y-1"
          >
            <p className={`text-sm font-semibold ${result.prime ? "text-emerald-400" : "text-amber-400"}`}>
              {n} is {result.prime ? "prime" : "composite"}
            </p>
            {!result.prime && (
              <p className="text-xs text-gray-400 font-mono">
                Factors: {result.factors.join(" × ")}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FibonacciTool() {
  const [n, setN] = useState("10");
  const [seq, setSeq] = useState<string[] | null>(null);

  function generate() {
    const num = Math.min(parseInt(n) || 10, 50);
    setSeq(fibonacci(num).map(String));
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-500">First</span>
        <input
          type="number"
          value={n}
          onChange={(e) => { setN(e.target.value); setSeq(null); }}
          min={1}
          max={50}
          className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#f43f5e]/50 transition-all"
        />
        <span className="text-xs text-gray-500">terms (max 50)</span>
        <button
          onClick={generate}
          className="ml-auto px-4 py-2 rounded-xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-[#f43f5e] text-sm hover:bg-[#f43f5e]/25 transition-all"
        >
          Generate
        </button>
      </div>
      {seq && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <p className="text-xs font-mono text-gray-300 break-all leading-6">
            {seq.join(", ")}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function GcdLcmTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<{ gcd: number; lcm: number } | null>(null);

  function compute() {
    const na = parseInt(a), nb = parseInt(b);
    if (isNaN(na) || isNaN(nb)) return;
  
    const g = Math.abs(math.gcd(na, nb) as any as number);
    setResult({ gcd: g, lcm: Math.abs(na * nb) / g });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="number" value={a} onChange={(e) => { setA(e.target.value); setResult(null); }}
          placeholder="a" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#f43f5e]/50 transition-all" />
        <input type="number" value={b} onChange={(e) => { setB(e.target.value); setResult(null); }}
          placeholder="b" onKeyDown={(e) => e.key === "Enter" && compute()}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#f43f5e]/50 transition-all" />
        <button onClick={compute}
          className="px-4 py-2 rounded-xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-[#f43f5e] text-sm hover:bg-[#f43f5e]/25 transition-all">
          Compute
        </button>
      </div>
      {result && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex gap-8">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">GCD</p>
            <p className="text-xl font-bold text-[#fb7185] font-mono">{result.gcd}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">LCM</p>
            <p className="text-xl font-bold text-[#fb7185] font-mono">{result.lcm}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ModPowTool() {
  const [base, setBase] = useState("");
  const [exp, setExp] = useState("");
  const [mod, setMod] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function compute() {
    try {
      const r = modPow(BigInt(base), BigInt(exp), BigInt(mod));
      setResult(r.toString());
    } catch {
      setResult("Invalid input");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        {[{ label: "Base", val: base, set: setBase }, { label: "Exp", val: exp, set: setExp }, { label: "Mod", val: mod, set: setMod }].map(({ label, val, set }) => (
          <div key={label} className="flex-1 min-w-[80px]">
            <p className="text-[10px] text-gray-500 mb-1">{label}</p>
            <input type="text" value={val} onChange={(e) => { set(e.target.value); setResult(null); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#f43f5e]/50 transition-all" />
          </div>
        ))}
        <button onClick={compute}
          className="self-end px-4 py-2 rounded-xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-[#f43f5e] text-sm hover:bg-[#f43f5e]/25 transition-all">
          Compute
        </button>
      </div>
      {result !== null && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-[10px] text-gray-500 mb-1">Base^Exp mod Mod</p>
          <p className="text-lg font-bold text-[#fb7185] font-mono break-all">{result}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TOOLS = [
  { id: "prime", label: "Prime Checker & Factorisation", Component: PrimeChecker },
  { id: "fib", label: "Fibonacci Generator", Component: FibonacciTool },
  { id: "gcd", label: "GCD & LCM", Component: GcdLcmTool },
  { id: "modpow", label: "Modular Exponentiation (aᵇ mod m)", Component: ModPowTool },
];

export default function NumberTheoryTools() {
  const [open, setOpen] = useState<string | null>("prime");

  return (
    <div className="rounded-2xl border border-[#f43f5e]/20 bg-[#0f172a]/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 text-[#f43f5e]">
        <Hash className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-[0.3em]">
          Number Theory
        </span>
      </div>
      <div className="divide-y divide-white/5">
        {TOOLS.map(({ id, label, Component }) => (
          <div key={id}>
            <button
              onClick={() => setOpen(open === id ? null : id)}
              className="w-full flex items-center justify-between px-6 py-3.5 text-sm text-gray-300 hover:text-white hover:bg-white/3 transition-all"
            >
              <span>{label}</span>
              {open === id ? <ChevronUp className="h-4 w-4 text-[#f43f5e]" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <AnimatePresence initial={false}>
              {open === id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-1">
                    <Component />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
