"use client";

import { ReactNode, useEffect, useState } from "react";

interface Props {
  /** Two ReactNode states to cycle between. Each keeps its own typography. */
  states: [ReactNode, ReactNode];
  /** Plain text label describing both states for a11y. */
  ariaLabel: string;
  /** ms each state stays fully legible */
  hold?: number;
  /** ms the pre-swap glitch runs */
  glitchMs?: number;
  /** ms the post-swap settle glitch runs */
  settleMs?: number;
  className?: string;
}

/**
 * A legible RGB-split "VHS" glitch swap between two states.
 *
 * Per cycle:
 *   1. hold  → state fully readable, no effect
 *   2. glitch → RGB text-shadow split + subtle x/y jitter (still readable)
 *   3. swap   → the current state changes
 *   4. settle → shorter glitch tail after the swap
 *   5. idle
 *
 * The RGB split uses `text-shadow` (inherits any typography), so both
 * states can carry their own colors/weights/italics without breaking.
 * Falls back to a plain crossfade for prefers-reduced-motion.
 */
export default function GlitchSwap({
  states,
  ariaLabel,
  hold = 2200,
  glitchMs = 420,
  settleMs = 180,
  className = "",
}: Props) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "glitch" | "settle">("idle");
  const [shake, setShake] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);

  // Main loop - one `cancelled` flag PER effect run so Strict Mode's
  // double-mount can't leak two overlapping loops (that was cancelling
  // the swaps out and making it look stuck).
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = setTimeout(() => {
          timeoutId = null;
          resolve();
        }, ms);
      });

    (async () => {
      // Let the mount fade-in finish first
      await wait(1000);
      if (cancelled) return;

      while (!cancelled) {
        if (reduced) {
          setIdx((i) => (i + 1) % 2);
          await wait(hold);
          continue;
        }

        setPhase("glitch");
        await wait(glitchMs);
        if (cancelled) return;

        setIdx((i) => (i + 1) % 2);
        setPhase("settle");
        await wait(settleMs);
        if (cancelled) return;

        setPhase("idle");
        await wait(hold);
      }
    })();

    return () => {
      cancelled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [hold, glitchMs, settleMs, reduced]);

  // Jitter shake - updates every ~50ms while glitching
  useEffect(() => {
    if (phase === "idle" || reduced) {
      setShake({ x: 0, y: 0 });
      return;
    }
    const iv = setInterval(() => {
      setShake({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 4,
      });
    }, 50);
    return () => clearInterval(iv);
  }, [phase, reduced]);

  const isGlitch = phase !== "idle" && !reduced;

  // RGB split via text-shadow - inherits any color, italic, weight.
  const textShadow = isGlitch
    ? `${(-3 - shake.x * 0.4).toFixed(2)}px ${(1 + shake.y * 0.3).toFixed(2)}px 0 #00e0ff, ${(3 + shake.x * 0.4).toFixed(2)}px ${(-1 - shake.y * 0.3).toFixed(2)}px 0 #ff2b7f`
    : "none";

  const transform = isGlitch
    ? `translate(${(shake.x * 0.5).toFixed(2)}px, ${(shake.y * 0.4).toFixed(2)}px)`
    : "none";

  return (
    <span
      className={`relative inline-block ${className}`}
      aria-label={ariaLabel}
      data-glitch={phase}
    >
      {/* Scanline overlay - only during glitch */}
      {isGlitch && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(20,20,22,0.35) 3px, rgba(20,20,22,0.35) 4px)",
          }}
        />
      )}

      <span
        className="relative inline-block"
        style={{
          textShadow,
          transform,
          transition: phase === "idle" ? "text-shadow 120ms ease, transform 120ms ease" : "none",
          willChange: isGlitch ? "transform" : "auto",
        }}
      >
        {states[idx]}
      </span>
    </span>
  );
}
