"use client";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PdfViewerProps {
  src: string;
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A fullscreen, in-app PDF viewer. Renders the PDF inside an <iframe> so users
 * can read it without leaving the site or downloading. Esc / tap-outside close.
 */
export default function PdfViewer({
  src,
  title,
  subtitle,
  isOpen,
  onClose,
}: PdfViewerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6 md:p-10"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close PDF viewer"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#07091a]"
            onClick={(e) => e.stopPropagation()}
          >
            {(title || subtitle) && (
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="min-w-0">
                  {title && (
                    <p
                      className="truncate text-sm font-bold text-white"
                      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                    >
                      {title}
                    </p>
                  )}
                  {subtitle && (
                    <p className="truncate text-xs text-[#e11d48]">{subtitle}</p>
                  )}
                </div>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5"
                >
                  Open ↗
                </a>
              </div>
            )}
            <iframe
              src={src}
              title={title || "PDF document"}
              className="h-full w-full flex-1 bg-white"
            />
          </motion.div>

          <p className="mt-3 text-xs text-gray-500">
            Press ESC or tap outside to close
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
