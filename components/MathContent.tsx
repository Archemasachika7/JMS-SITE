"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a string that may contain LaTeX.
 *
 * Two kinds of LaTeX show up in admin-authored problems & solutions:
 *
 *   1. Math mode — `$...$`, `$$...$$`, `\(...\)`, `\[...\]`. These are handed
 *      to KaTeX's auto-render so they become proper typeset math.
 *   2. Text-mode markup that lives *outside* any math delimiter, e.g.
 *      `\textbf{Problem.}`. KaTeX never touches text outside delimiters, so we
 *      convert the common ones (`\textbf`, `\textit`, `\emph`) to HTML ourselves.
 *
 * KaTeX is loaded once from the CDN and shared across every instance.
 */

let katexPromise: Promise<void> | null = null;

function loadKatex(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  // @ts-expect-error - renderMathInElement is attached to window by the CDN script
  if (window.renderMathInElement) return Promise.resolve();
  if (katexPromise) return katexPromise;

  katexPromise = new Promise<void>((resolve) => {
    if (!document.getElementById("katex-css")) {
      const css = document.createElement("link");
      css.id = "katex-css";
      css.rel = "stylesheet";
      css.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
      document.head.appendChild(css);
    }
    const katex = document.createElement("script");
    katex.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
    katex.onload = () => {
      const auto = document.createElement("script");
      auto.src =
        "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js";
      auto.onload = () => resolve();
      document.head.appendChild(auto);
    };
    document.head.appendChild(katex);
  });
  return katexPromise;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Turn the raw statement/solution into HTML. HTML-special characters are
 * escaped first (the browser decodes them back inside text nodes, so KaTeX
 * still sees the original `<`, `>`, `&` when it walks the DOM). Then a small,
 * safe set of text-mode commands is mapped to inline HTML.
 */
// Theorem-style text environments KaTeX can't handle (it only typesets math).
// We render `proof` with a label + QED box and strip the rest. Crucially we do
// NOT touch math environments (align, cases, matrix, equation, gather, ...),
// which live inside math delimiters and must reach KaTeX untouched.
const TEXT_ENVS =
  "theorem|lemma|corollary|proposition|definition|remark|example|claim|solution|center|quote";

function toHtml(raw: string): string {
  let s = escapeHtml(raw);
  s = s.replace(/\\textbf\{([^{}]*)\}/g, "<strong>$1</strong>");
  s = s.replace(/\\textit\{([^{}]*)\}/g, "<em>$1</em>");
  s = s.replace(/\\emph\{([^{}]*)\}/g, "<em>$1</em>");

  // proof environment → italic "Proof." label and a trailing QED square.
  s = s.replace(/\\begin\{proof\}\s*/g, "<em>Proof.</em> ");
  s = s.replace(/\s*\\end\{proof\}/g, ' <span aria-hidden="true">∎</span>');

  // Strip the remaining text-mode environment markers so they don't leak.
  s = s.replace(new RegExp(`\\\\(?:begin|end)\\{(?:${TEXT_ENVS})\\*?\\}`, "g"), "");
  return s;
}

const DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "\\[", right: "\\]", display: true },
  { left: "\\(", right: "\\)", display: false },
  { left: "$", right: "$", display: false },
];

export default function MathContent({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // We render an *empty* div in JSX and fill it imperatively. This way React
  // never manages the inner DOM, so a parent re-render (e.g. toggling the
  // solution open) can't wipe out KaTeX's rendered output and revert the math
  // back to raw source.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    el.innerHTML = toHtml(text);
    loadKatex().then(() => {
      if (cancelled || !ref.current) return;
      // @ts-expect-error - global from KaTeX auto-render
      window.renderMathInElement?.(ref.current, {
        delimiters: DELIMITERS,
        throwOnError: false,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  return <div ref={ref} className={className} style={{ whiteSpace: "pre-wrap" }} />;
}
