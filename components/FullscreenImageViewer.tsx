"use client";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FullscreenImageViewerProps {
  src: string;
  alt: string;
  caption?: string;
  subCaption?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenImageViewer({
  src,
  alt,
  caption,
  subCaption,
  isOpen,
  onClose,
}: FullscreenImageViewerProps) {
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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6 md:p-10"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
            aria-label="Close fullscreen view"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
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

          {/* Image container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-full max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
              draggable={false}
            />

            {/* Caption overlay */}
            {(caption || subCaption) && (
              <div className="mt-3 text-center max-w-2xl px-4">
                {caption && (
                  <p
                    className="text-white text-sm md:text-base font-bold"
                    style={{
                      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                    }}
                  >
                    {caption}
                  </p>
                )}
                {subCaption && (
                  <p
                    className="text-gray-400 text-xs md:text-sm mt-1"
                    style={{
                      fontFamily:
                        "'Public Sans', 'Inter', system-ui, sans-serif",
                    }}
                  >
                    {subCaption}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Fullscreen hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <p
              className="text-gray-500 text-xs"
              style={{
                fontFamily: "'Public Sans', 'Inter', system-ui, sans-serif",
              }}
            >
              Press ESC or tap outside to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
