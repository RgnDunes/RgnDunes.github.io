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
            <span className="eyebrow">The Shelf</span>
            <h2 className="font-display text-display-3 text-ink">
              Books I have written<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          Long-form on JavaScript, CSS, and frontend system design
        </p>
      </motion.div>

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
