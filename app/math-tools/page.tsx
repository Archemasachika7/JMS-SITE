import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Math Tools | JU Maths Society",
  description:
    "Interactive graphing calculator, symbolic math evaluator, and number theory tools — powered by Desmos and math.js.",
};

const GraphingCalculator = dynamic(
  () => import("@/components/GraphingCalculator"),
  { ssr: false }
);
const MathEvaluator = dynamic(() => import("@/components/MathEvaluator"), {
  ssr: false,
});
const NumberTheoryTools = dynamic(
  () => import("@/components/NumberTheoryTools"),
  { ssr: false }
);

export default function MathToolsPage() {
  return (
    <main className="relative min-h-screen bg-[#020617]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e11d48]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#fb7185]/6 rounded-full blur-[100px] pointer-events-none" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(251,113,133,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,113,133,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#e11d48]" />
            <span className="text-xs tracking-[0.4em] text-[#fb7185] uppercase">
              JU Maths Society
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#e11d48]" />
          </div>
          <h1
            className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Math
            </span>
            <span className="bg-gradient-to-br from-[#e11d48] to-[#fb7185] bg-clip-text text-transparent">
              {" "}Tools
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Graph functions, evaluate symbolic expressions, and explore number
            theory — everything a mathematician needs, in one place.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Graphing Calculator — full width */}
          <GraphingCalculator />

          {/* Evaluator + Number Theory side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <MathEvaluator />
            <NumberTheoryTools />
          </div>

          {/* Formula reference card */}
          <FormulaReference />
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FormulaReference() {
  const sections = [
    {
      title: "Calculus",
      items: [
        { name: "Product Rule", formula: "(uv)' = u'v + uv'" },
        { name: "Chain Rule", formula: "(f∘g)' = f'(g(x))·g'(x)" },
        { name: "Integration by Parts", formula: "∫u dv = uv − ∫v du" },
        { name: "Taylor Series", formula: "f(x) = Σ f⁽ⁿ⁾(a)/n! · (x−a)ⁿ" },
      ],
    },
    {
      title: "Number Theory",
      items: [
        { name: "Fermat's Little", formula: "aᵖ ≡ a (mod p), p prime" },
        { name: "Euler's Theorem", formula: "aᵠ⁽ⁿ⁾ ≡ 1 (mod n), gcd(a,n)=1" },
        { name: "Wilson's Theorem", formula: "(p−1)! ≡ −1 (mod p)" },
        { name: "CRT", formula: "x ≡ aᵢ (mod nᵢ), ∀i" },
      ],
    },
    {
      title: "Linear Algebra",
      items: [
        { name: "det(AB)", formula: "det(A)·det(B)" },
        { name: "Rank-Nullity", formula: "rank(A) + nullity(A) = n" },
        { name: "Cayley-Hamilton", formula: "p(A) = 0, p = char. poly" },
        { name: "Spectral Thm", formula: "A = QΛQᵀ (symmetric A)" },
      ],
    },
    {
      title: "Classic Identities",
      items: [
        { name: "Euler's Identity", formula: "eⁱᵖ + 1 = 0" },
        { name: "Basel Problem", formula: "Σ 1/n² = π²/6" },
        { name: "Gaussian Integral", formula: "∫₋∞^∞ e^(−x²) dx = √π" },
        { name: "Golden Ratio", formula: "φ = (1+√5)/2 ≈ 1.618…" },
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-[#f43f5e]/20 bg-[#0f172a]/80 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3
          className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f43f5e]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Formula Reference
        </h3>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((s) => (
          <div key={s.title}>
            <h4
              className="text-xs font-semibold uppercase tracking-widest text-[#fb7185] mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {s.title}
            </h4>
            <ul className="space-y-2.5">
              {s.items.map((item) => (
                <li key={item.name} className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-gray-500">{item.name}</span>
                  <span className="text-xs font-mono text-gray-200">
                    {item.formula}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
