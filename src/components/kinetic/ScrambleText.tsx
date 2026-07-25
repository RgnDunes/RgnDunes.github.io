"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  /** ms per character reveal step */
  step?: number;
  /** number of scramble frames per character before it locks */
  scrambles?: number;
  /** delay before starting */
  delay?: number;
  /** trigger on mount vs on view */
  trigger?: "mount" | "view";
}

const GLYPHS = "ĂĖÑŔŤĠİñŠıØŴæł§ð⌇◊∴※★∆";

/**
 * Reveals `text` by scrambling each character through random glyphs
 * before settling on the correct one. Preserves spaces and punctuation.
 * Falls back to the plain text if prefers-reduced-motion is set.
 */
export default function ScrambleText({
  text,
  className,
  as: Tag = "span",
  step = 42,
  scrambles = 6,
  delay = 0,
  trigger = "mount",
}: Props) {
  const [display, setDisplay] = useState(() =>
    trigger === "mount" ? scrambledInitial(text) : text
  );
  const ref = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const noMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      setDisplay(text);
      return;
    }

    const start = () => {
      if (started.current) return;
      started.current = true;
      let cancelled = false;
      const chars = text.split("");
      let idx = 0;

      const revealNext = () => {
        if (cancelled || idx > chars.length) return;
        let frame = 0;

        const tick = () => {
          if (cancelled) return;
          const out = chars.map((c, i) => {
            if (i < idx) return c;
            if (i === idx && frame >= scrambles) return c;
            if (c === " " || c === "." || c === "," || c === "!") return c;
            return GLYPHS[Math.floor((i + frame + idx) * 7.31) % GLYPHS.length];
          });
          setDisplay(out.join(""));
          frame++;
          if (frame > scrambles) {
            idx++;
            revealNext();
          } else {
            setTimeout(tick, step);
          }
        };

        tick();
      };

      setTimeout(revealNext, delay);
      return () => {
        cancelled = true;
      };
    };

    if (trigger === "mount") {
      const cleanup = start();
      return cleanup;
    }

    // trigger === "view"
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      const cleanup = start();
      return cleanup;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, step, scrambles, delay, trigger]);

  const El = Tag as unknown as React.ElementType;
  return (
    <El
      ref={ref}
      className={className}
      aria-label={text}
    >
      {display}
    </El>
  );
}

function scrambledInitial(text: string) {
  return text
    .split("")
    .map((c) => (c === " " || c === "." ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join("");
}
