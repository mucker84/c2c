"use client";

import { motion, AnimatePresence } from "framer-motion";

interface GlitchTextProps {
  glitch: string;
  fullText: string;
  revealed: boolean;
}

export default function GlitchText({ glitch, fullText, revealed }: GlitchTextProps) {
  return (
    <div className="relative min-h-[80px]">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.p
            key="glitch"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
            className="font-mono text-sm text-surface-muted leading-relaxed tracking-wide"
          >
            {glitch}
          </motion.p>
        ) : (
          <motion.p
            key="full"
            initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-sm text-gray-700 leading-relaxed"
          >
            {fullText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
