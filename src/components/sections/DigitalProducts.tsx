"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import { products } from "@/data/products";

export default function DigitalProducts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="products" ref={ref} className="page-shell py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">v.</span>
          <div>
            <h2 className="font-display text-display-3 text-ink">
              Books I have written<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          Long-form on JavaScript, CSS, and frontend system design
        </p>
      </motion.div>

      {/* A stylised bookshelf strip underneath the section header —
          a row of book spines that hints at "the shelf". Purely decorative. */}
      <Bookshelf />

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {products.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group flex flex-col"
          >
            <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-rule bg-paper-2">
              <div className="relative flex h-72 items-center justify-center p-8">
                {p.image && (
                  <div className="relative h-full w-40 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                    <Image src={p.image} alt={p.title} fill className="object-contain drop-shadow-xl" />
                  </div>
                )}
              </div>
              <div className="absolute -inset-6 -z-10 bg-saffron/0 blur-3xl transition-all group-hover:bg-saffron/20" />
            </div>
            <div className="flex flex-1 flex-col rounded-b-2xl border border-t border-rule bg-paper p-6">
              <div className="mb-2 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                <span>{p.type}</span>
                <span>·</span>
                <span className="text-saffron">{p.stats}</span>
              </div>
              <h3 className="font-display text-xl text-ink transition-colors group-hover:text-saffron">
                {p.title}
              </h3>
              <p className="mt-3 clamp-3 text-[14px] leading-[1.55] text-ink-2">
                {p.description}
              </p>
              <div className="mt-auto flex items-center justify-between pt-5">
                <div className="flex flex-wrap gap-1.5">
                  {p.techStack.slice(0, 2).map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
                <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-all group-hover:text-saffron group-hover:gap-2">
                  Read <FaArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/**
 * A decorative bookshelf strip - a row of thin coloured spines
 * with typographic labels, resting on a paper "shelf" rule.
 */
function Bookshelf() {
  const spines = [
    { h: 92, w: 16, fill: "#27584A", label: "System Design", color: "#F6F0E7" },
    { h: 108, w: 22, fill: "#141416", label: "JavaScript", color: "#F6F0E7" },
    { h: 96, w: 14, fill: "#E86A2B", label: "", color: "#F6F0E7" },
    { h: 118, w: 26, fill: "#F6F0E7", label: "CSS Unmasked", color: "#141416", stroked: true },
    { h: 88, w: 18, fill: "#5A3A6E", label: "Frontend", color: "#F6F0E7" },
    { h: 100, w: 14, fill: "#0F4C81", label: "", color: "#F6F0E7" },
    { h: 108, w: 20, fill: "#141416", label: "React", color: "#F6F0E7" },
    { h: 84, w: 12, fill: "#E86A2B", label: "", color: "#F6F0E7" },
    { h: 110, w: 22, fill: "#F0E9DD", label: "Node", color: "#141416", stroked: true },
    { h: 96, w: 18, fill: "#27584A", label: "", color: "#F6F0E7" },
    { h: 116, w: 24, fill: "#141416", label: "Full Spectrum", color: "#F6F0E7" },
    { h: 100, w: 14, fill: "#E86A2B", label: "", color: "#F6F0E7" },
    { h: 92, w: 18, fill: "#5A3A6E", label: "", color: "#F6F0E7" },
  ];

  return (
    <div className="mt-10 md:mt-12">
      <div className="relative">
        <div className="flex items-end justify-center gap-1">
          {spines.map((s, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              style={{
                width: s.w,
                height: s.h,
                background: s.fill,
                border: s.stroked ? "1px solid rgb(var(--rule))" : "none",
                transformOrigin: "bottom",
                borderRadius: "2px 2px 0 0",
              }}
              className="relative flex-shrink-0"
            >
              {s.label && (
                <span
                  className="absolute left-1/2 top-1/2 origin-center whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.15em]"
                  style={{
                    color: s.color,
                    transform: "translate(-50%, -50%) rotate(-90deg)",
                  }}
                >
                  {s.label}
                </span>
              )}
            </motion.div>
          ))}
        </div>
        {/* Shelf rule underneath */}
        <div className="h-[3px] w-full bg-ink" />
        <div className="mt-1 flex justify-center font-mono text-[9.5px] uppercase tracking-[0.24em] text-muted">
          on the shelf
        </div>
      </div>
    </div>
  );
}
