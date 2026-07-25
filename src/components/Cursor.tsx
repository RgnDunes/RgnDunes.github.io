"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Kind = "default" | "link" | "external" | "text" | "drag";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  const [kind, setKind] = useState<Kind>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Disable on touch or reduced-motion
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const noMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || noMotion) return;
    setEnabled(true);

    document.documentElement.classList.add("cursor-hidden");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [role=button], input, textarea, [data-cursor]"
      ) as HTMLElement | null;
      if (!el) {
        setKind("default");
        setLabel(null);
        return;
      }
      const dc = el.getAttribute("data-cursor");
      if (dc) {
        setKind((dc as Kind) || "link");
        setLabel(el.getAttribute("data-cursor-label"));
        return;
      }
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        setKind("text");
        setLabel(null);
        return;
      }
      if (el.tagName === "A") {
        const href = (el as HTMLAnchorElement).getAttribute("href") || "";
        const external =
          (el as HTMLAnchorElement).target === "_blank" ||
          href.startsWith("http") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:");
        setKind(external ? "external" : "link");
        setLabel(external ? "↗" : "READ");
        return;
      }
      setKind("link");
      setLabel(null);
    };

    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, [x, y]);

  if (!enabled) return null;

  const bigSize = kind === "link" || kind === "external" ? 56 : 32;
  const dotSize = kind === "text" ? 2 : 6;

  return (
    <>
      {/* Halo ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[100] mix-blend-difference"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: bigSize,
            height: bigSize,
            borderRadius: kind === "text" ? 3 : 9999,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="flex items-center justify-center border border-[#F6F0E7]"
        >
          <AnimatePresence>
            {label && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-[#F6F0E7]"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[100] rounded-full bg-saffron"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: dotSize,
          height: dotSize,
        }}
      />
    </>
  );
}
