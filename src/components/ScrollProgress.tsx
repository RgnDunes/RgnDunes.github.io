"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [pct, setPct] = useState(0);
  useEffect(() => {
    const un = scrollYProgress.on("change", (v) => setPct(Math.round(v * 100)));
    return () => un();
  }, [scrollYProgress]);

  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.98, 1], [0, 1, 1, 0]);

  return (
    <>
      {/* thin top rule */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-saffron"
        style={{ scaleX }}
      />

      {/* right-margin folio - page counter */}
      <motion.div
        style={{ opacity }}
        className="pointer-events-none fixed right-3 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="rotate-90 whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.32em] text-muted">
          {String(pct).padStart(3, "0")} / 100
        </span>
        <span className="h-16 w-px bg-rule" />
      </motion.div>
    </>
  );
}
