"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/**
 * Sections referenced in the running folio + spine. The IDs match
 * the anchors used in each section component. Titles are short —
 * they show in the margin as tiny mono labels.
 */
const SECTIONS: { id: string; title: string; folio: string }[] = [
  { id: "top", title: "Cover", folio: "I" },
  { id: "about", title: "The Feature", folio: "II" },
  { id: "work", title: "The Log", folio: "III" },
  { id: "skills", title: "The Toolkit", folio: "IV" },
  { id: "notebook", title: "The Notebook", folio: "V" },
  { id: "products", title: "The Shelf", folio: "VI" },
  { id: "publications", title: "The Archive", folio: "VII" },
  { id: "writing", title: "Dispatches", folio: "VIII" },
  { id: "contact", title: "Colophon", folio: "IX" },
];

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [pct, setPct] = useState(0);
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const un = scrollYProgress.on("change", (v) => setPct(Math.round(v * 100)));
    return () => un();
  }, [scrollYProgress]);

  // Observe sections to know which one is currently in view
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's
        // at least partially visible.
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (!best || e.intersectionRatio > best.intersectionRatio) {
            best = e;
          }
        }
        if (best?.target?.id) setActiveId(best.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.01, 0.25, 0.5] }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const activeIdx = useMemo(
    () => Math.max(0, SECTIONS.findIndex((s) => s.id === activeId)),
    [activeId]
  );
  const activeSection = SECTIONS[activeIdx];

  const opacity = useTransform(scrollYProgress, [0, 0.03, 0.98, 1], [0, 1, 1, 0]);

  return (
    <>
      {/* thin top rule */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-saffron"
        style={{ scaleX }}
      />

      {/* ─── Left-margin scroll spine ───────────────────
          A slim vertical rule down the left edge. Fills
          saffron as you scroll. Tick marks at each section
          boundary. Hidden on small viewports.
          ───────────────────────────────────────────── */}
      <motion.div
        style={{ opacity }}
        aria-hidden
        className="pointer-events-none fixed left-3 top-[15%] z-[55] hidden h-[70vh] w-4 md:block"
      >
        {/* Base rule (dim) */}
        <span className="absolute inset-y-0 left-2 w-px bg-rule" />
        {/* Filled portion */}
        <motion.span
          className="absolute inset-x-2 top-0 origin-top w-px bg-saffron"
          style={{ scaleY, height: "100%" }}
        />

        {/* Section tick marks */}
        {SECTIONS.map((s, i) => {
          const pos = i / Math.max(1, SECTIONS.length - 1);
          const isActive = i === activeIdx;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="pointer-events-auto absolute -translate-y-1/2"
              style={{ top: `${pos * 100}%`, left: 0 }}
              aria-label={`Jump to ${s.title}`}
              title={s.title}
            >
              <span className="group relative flex items-center">
                <span
                  className={`h-[1px] transition-all duration-300 ${
                    isActive ? "w-4 bg-saffron" : "w-2 bg-rule group-hover:w-3 group-hover:bg-ink"
                  }`}
                />
                {/* Section label appears on hover, or when active */}
                <span
                  className={`absolute left-6 whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.22em] transition-opacity duration-300 ${
                    isActive
                      ? "text-ink opacity-90"
                      : "text-muted opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <span className="text-saffron">{s.folio}.</span> {s.title}
                </span>
              </span>
            </a>
          );
        })}
      </motion.div>

      {/* ─── Running folio · top-right corner ─────────
          A small "Folio III · 3/9 · The Log" note in the
          top-right corner. Shows current section + folio +
          progress. Editorial book-page feel.
          ─────────────────────────────────────────── */}
      <motion.div
        style={{ opacity }}
        className="pointer-events-none fixed right-4 top-1/2 z-[55] hidden -translate-y-1/2 flex-col items-end gap-2 md:flex"
      >
        <div className="flex flex-col items-end">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-muted">
            Folio
          </span>
          <span className="mt-0.5 font-display italic text-2xl leading-none text-saffron">
            {activeSection.folio}.
          </span>
        </div>
        <span className="h-8 w-px bg-rule" />
        <span className="rotate-90 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.34em] text-muted origin-center pt-8">
          {String(pct).padStart(3, "0")}
        </span>
      </motion.div>
    </>
  );
}
