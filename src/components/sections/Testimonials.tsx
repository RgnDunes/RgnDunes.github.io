"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % testimonials.length), 8000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[i];

  return (
    <section ref={ref} className="page-shell py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">viii.</span>
          <div>
            <span className="eyebrow">The Testimony</span>
            <h2 className="font-display text-display-3 text-ink">
              Kind words<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          From colleagues, mentors, and the people I have worked alongside
        </p>
      </motion.div>

      <div className="mt-14 grid gap-12 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
        <div className="relative">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-paper-2" />
          <AnimatePresence mode="wait">
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
              className="relative h-40 w-40 overflow-hidden rounded-2xl border border-rule md:h-52 md:w-52"
            >
              <Image src={t.image} alt={t.name} fill className="object-cover" sizes="208px" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <span className="folio text-6xl leading-none">"</span>
              <blockquote className="mt-2 font-display text-2xl leading-[1.35] text-ink md:text-[28px]">
                {t.testimonial}
              </blockquote>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-lg text-ink">{t.name}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  {t.role} · {t.company}
                </span>
              </div>
              <a
                href={t.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet mt-3 font-mono text-[11px] uppercase tracking-[0.2em]"
              >
                <FaLinkedin className="h-3 w-3" /> View profile
              </a>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-3 border-t border-rule pt-4">
            <button
              onClick={() => setI((x) => (x - 1 + testimonials.length) % testimonials.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink hover:text-ink"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  className={`h-1 rounded-full transition-all ${
                    idx === i ? "w-8 bg-saffron" : "w-4 bg-rule"
                  }`}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((x) => (x + 1) % testimonials.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink hover:text-ink"
              aria-label="Next testimonial"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
            <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
              {String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
