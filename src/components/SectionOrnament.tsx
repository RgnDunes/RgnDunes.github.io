"use client";

import { motion } from "framer-motion";

/**
 * A small centered ornament used between sections to give rhythm.
 * Rotates through three glyphs so no two consecutive dividers look
 * identical. Each one is a fleuron flanked by short rules.
 */
const GLYPHS = ["✦", "❦", "☙"];

interface Props {
  index?: number;
  /** Tone: paper (default) or ink (for use on dark strips). */
  tone?: "paper" | "ink";
}

export default function SectionOrnament({ index = 0, tone = "paper" }: Props) {
  const g = GLYPHS[index % GLYPHS.length];
  const isInk = tone === "ink";
  return (
    <div className="page-shell flex items-center justify-center py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="flex items-center gap-4"
      >
        <span className={`h-px w-16 ${isInk ? "bg-paper/25" : "bg-rule"}`} />
        <span
          className={`font-display italic text-lg leading-none ${
            isInk ? "text-paper/60" : "text-saffron"
          }`}
          aria-hidden
        >
          {g}
        </span>
        <span className={`h-px w-16 ${isInk ? "bg-paper/25" : "bg-rule"}`} />
      </motion.div>
    </div>
  );
}
