"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA",
];

export default function EasterEgg() {
  const [buf, setBuf] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in an input
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;

      setBuf((prev) => {
        const next = [...prev, e.code].slice(-CODE.length);
        if (next.length === CODE.length && next.every((k, i) => k === CODE[i])) {
          setUnlocked(true);
          setTimeout(() => setUnlocked(false), 6000);
          return [];
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.div
          key="egg"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-2xl border border-ink bg-paper px-6 py-4 shadow-[0_20px_60px_-20px_rgba(20,20,22,0.5)]">
            {/* sun rays */}
            <motion.span
              aria-hidden
              initial={{ scale: 0, opacity: 0.4 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute left-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-saffron"
            />

            <div className="relative flex items-center gap-4">
              {/* Ganesha sigil — a stylized Om with a tilak */}
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-ink bg-paper">
                <span className="font-display text-2xl text-saffron leading-none">ॐ</span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-6px] rounded-full border border-dashed border-saffron/40"
                />
              </div>

              <div className="min-w-0">
                <div className="font-display italic text-lg leading-tight text-ink">
                  Śrī Gaṇeśāya Namaḥ
                </div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
                  Salutations to Gaṇeśa · Remover of obstacles
                </div>
              </div>

              <span className="ml-6 kbd">↑↑↓↓←→←→BA</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
