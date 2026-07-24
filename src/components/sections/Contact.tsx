"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaCopy,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const email = "rgndunes@gmail.com";

const socials = [
  { icon: FaGithub, label: "GitHub", href: "https://github.com/RgnDunes", handle: "@RgnDunes" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com/in/rgndunes", handle: "/in/rgndunes" },
  { icon: FaTwitter, label: "X / Twitter", href: "https://twitter.com/rgndunes", handle: "@rgndunes" },
  { icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@rgndunes", handle: "@rgndunes" },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <section id="contact" ref={ref} className="page-shell py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">ix.</span>
          <div>
            <span className="eyebrow">The Colophon</span>
            <h2 className="font-display text-display-3 text-ink">
              Say hello<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          Open to interesting problems, thoughtful teams, and long walks in the debugger
        </p>
      </motion.div>

      <div className="mt-14 grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
        {/* Left — the letter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="font-display text-3xl leading-[1.2] text-ink md:text-4xl">
            The quickest way to reach me is <span className="italic text-saffron">by email</span>.
            The second quickest is LinkedIn. I answer both, sometimes even quickly.
          </p>

          {/* Email row */}
          <div className="mt-10 grid gap-3">
            <div className="eyebrow">Email</div>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-rule bg-paper-2 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-paper">
                <MdEmail className="h-5 w-5" />
              </div>
              <a href={`mailto:${email}`} className="font-mono text-[15px] text-ink hover:text-saffron">
                {email}
              </a>
              <button
                onClick={copyEmail}
                className="ml-auto flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-all hover:border-ink"
              >
                {copied ? <FaCheck className="h-3 w-3 text-seal" /> : <FaCopy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`mailto:${email}`} className="btn-primary">
              Write me a letter <FaArrowRight className="h-3 w-3" />
            </a>
            <Link href="/blog" className="btn-ghost">
              Or read the notebook
            </Link>
          </div>
        </motion.div>

        {/* Right — social directory */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="eyebrow mb-4">Elsewhere</div>
          <ul className="divide-y divide-rule border-y border-rule">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 py-4 transition-colors hover:text-saffron"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-base font-medium text-ink">{s.label}</span>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                        {s.handle}
                      </span>
                    </span>
                    <FaArrowRight className="ml-auto h-3 w-3 text-muted transition-transform group-hover:translate-x-1 group-hover:text-saffron" />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-2xl border border-rule bg-paper-2 p-5">
            <div className="eyebrow">Currently</div>
            <div className="mt-2 font-display text-lg text-ink">
              Building at Rippling · L6
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Bengaluru · GMT+5:30
            </div>
          </div>
        </motion.div>
      </div>

      {/* Colophon — the last page of the notebook */}
      <Colophon />
    </section>
  );
}

/* ─── Colophon ────────────────────────────────────────────────
   The final spread. A specimen sheet + credits, framed by
   ornamental rules. The way a book ends.
   ────────────────────────────────────────────────────────── */

function Colophon() {
  const year = new Date().getFullYear();
  const specimens = [
    { face: "Fraunces", role: "Display · Serif", sample: "Aa", weight: "italic" as const },
    { face: "Inter", role: "Body · Sans", sample: "Aa", weight: "regular" as const },
    { face: "JetBrains Mono", role: "Caption · Mono", sample: "Aa", weight: "mono" as const },
  ];

  return (
    <footer className="mt-32 md:mt-40">
      {/* Ornamental rule with center medallion */}
      <div className="relative flex items-center justify-center py-8">
        <span className="h-px flex-1 bg-rule" />
        <div className="mx-6 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.32em] text-muted">
          <span>❋</span>
          <span>End of Volume V</span>
          <span>❋</span>
        </div>
        <span className="h-px flex-1 bg-rule" />
      </div>

      {/* The Fin. plate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-rule bg-paper-2 px-6 py-14 md:px-16 md:py-20"
      >
        {/* Corner brackets — like a manuscript folio */}
        <span className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l border-t border-ink" />
        <span className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r border-t border-ink" />
        <span className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b border-l border-ink" />
        <span className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b border-r border-ink" />

        {/* Warm halo behind Fin. */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron/15 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <span className="eyebrow">The last page</span>

          {/* Colossal Fin. flourish */}
          <div className="relative mt-4">
            <span className="font-display italic text-ink text-[clamp(6rem,18vw,14rem)] leading-none tracking-[-0.04em]">
              Fin
            </span>
            <span className="font-display italic text-saffron text-[clamp(6rem,18vw,14rem)] leading-none tracking-[-0.04em]">
              .
            </span>
          </div>

          {/* Sanskrit sign-off */}
          <div className="mt-6 flex flex-col items-center gap-1">
            <span className="font-display text-2xl text-ink md:text-3xl">
              ॐ शान्तिः शान्तिः शान्तिः
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
              Oṁ · Peace, peace, peace
            </span>
          </div>
        </div>

        {/* Type specimen row */}
        <div className="relative mt-14">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-rule" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.32em] text-muted">
              Set in
            </span>
            <span className="h-px w-10 bg-rule" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {specimens.map((s) => (
              <div
                key={s.face}
                className="group flex items-center gap-4 rounded-2xl border border-rule bg-paper p-4 transition-all hover:border-ink"
              >
                <span
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-rule bg-paper-2 text-[28px] leading-none text-ink transition-transform group-hover:-rotate-3 group-hover:scale-105 ${
                    s.weight === "italic"
                      ? "font-display italic"
                      : s.weight === "mono"
                      ? "font-mono"
                      : "font-body"
                  }`}
                >
                  {s.sample}
                </span>
                <div className="min-w-0">
                  <div
                    className={`truncate text-base text-ink ${
                      s.weight === "italic"
                        ? "font-display italic"
                        : s.weight === "mono"
                        ? "font-mono"
                        : "font-body font-medium"
                    }`}
                  >
                    {s.face}
                  </div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
                    {s.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credits grid */}
        <div className="relative mt-12 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2 md:grid-cols-4">
          <CreditCell k="Author" v="Divyansh Singh" />
          <CreditCell k="Typesetter" v="The subject himself" />
          <CreditCell k="Printed on" v="Paper made of pixels" />
          <CreditCell k="Bound in" v="React · Next.js 14" />
        </div>

        {/* Bottom line */}
        <div className="relative mt-10 flex flex-col items-center gap-2 text-center font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
          <span>
            © {year} Divyansh Singh · All spellings intentional
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron animate-pulse" />
            Still writing, Bengaluru — {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      </motion.div>

      {/* Publisher's mark */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <span className="h-px w-20 bg-rule" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-ink">
          <span className="absolute inset-1 rounded-full border border-rule" />
          <span className="font-display italic text-ink text-xl leading-none">ds</span>
        </div>
        <span className="h-px w-20 bg-rule" />
      </div>
    </footer>
  );
}

function CreditCell({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="eyebrow mb-1.5">{k}</div>
      <div className="font-display text-base text-ink">{v}</div>
    </div>
  );
}
