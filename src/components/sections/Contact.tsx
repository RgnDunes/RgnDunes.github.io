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
        {/* Left - the letter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="font-display text-3xl leading-[1.2] text-ink md:text-4xl">
            The quickest way to reach me is <span className="italic text-saffron">by email</span>.
            The second quickest is LinkedIn. I answer both, sometimes even quickly.
          </p>

          {/* Email row - styled as an envelope with a wax seal */}
          <div className="mt-10 grid gap-3">
            <div className="eyebrow">Email</div>
            <div className="relative overflow-hidden rounded-2xl border border-rule bg-paper-2 p-4">
              {/* Envelope flap in the top-right */}
              <EnvelopeFlap />

              <div className="relative flex flex-wrap items-center gap-3 pr-14">
                <WaxSeal />
                <a
                  href={`mailto:${email}`}
                  className="font-mono text-[15px] text-ink hover:text-saffron"
                >
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

          {/* Signature sign-off */}
          <Signature />
        </motion.div>

        {/* Right - social directory */}
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
                    rel="me noopener noreferrer"
                    aria-label={`${s.label} — ${s.handle}`}
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
              Shipping web infrastructure
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Bengaluru · GMT+5:30
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}

/* ─── Wax seal ───────────────────────────────────────
   A small circular saffron seal with a "ds" monogram.
   ──────────────────────────────────────────────────── */

function WaxSeal() {
  return (
    <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center">
      {/* Outer ring (jagged wax edge) */}
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="wax" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F09456" />
            <stop offset="100%" stopColor="#C24E16" />
          </radialGradient>
        </defs>
        {/* Slightly irregular polygon → wax "spread" */}
        <polygon
          points="20,2 26,4 30,8 36,10 37,16 39,22 36,28 32,32 26,36 20,38 14,36 8,32 4,28 2,22 3,16 6,10 12,6 16,4"
          fill="url(#wax)"
        />
        {/* Inner concentric ring */}
        <circle cx="20" cy="20" r="12" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
        {/* Monogram */}
        <text
          x="20"
          y="24"
          textAnchor="middle"
          fontFamily="Fraunces, Georgia, serif"
          fontStyle="italic"
          fontWeight="500"
          fontSize="13"
          fill="#F6F0E7"
        >
          ds
        </text>
      </svg>
    </div>
  );
}

/* ─── Envelope flap corner ───────────────────────────
   A folded-paper triangle in the top-right of the email
   card, hinting at "letter". Subtle drop shadow.
   ──────────────────────────────────────────────────── */

function EnvelopeFlap() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 h-16 w-16"
      viewBox="0 0 64 64"
    >
      <polygon points="64,0 64,32 32,0" fill="rgb(var(--paper))" stroke="rgb(var(--rule))" strokeWidth="0.75" />
      <line x1="64" y1="0" x2="32" y2="32" stroke="rgb(var(--rule))" strokeWidth="0.75" />
    </svg>
  );
}

/* ─── Signature sign-off ─────────────────────────────
   A cursive "DS" drawn with an SVG path, animated to
   look like it is being written on the page.
   ────────────────────────────────────────────────── */

function Signature() {
  return (
    <div className="mt-10 flex items-center gap-4">
      <span className="h-px flex-1 max-w-[3rem] bg-rule" />
      <div className="flex flex-col items-start gap-1">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
          Yours,
        </span>
        <svg
          viewBox="0 0 200 80"
          width="140"
          height="56"
          className="text-ink"
          aria-label="Signed, Divyansh Singh"
        >
          {/* D */}
          <motion.path
            d="M 10 60 C 8 34, 18 12, 30 12 C 62 12, 70 62, 40 62 C 34 62, 24 60, 20 58"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          />
          {/* S curl */}
          <motion.path
            d="M 90 22 C 74 18, 62 30, 74 40 C 90 50, 110 40, 106 56 C 102 68, 84 68, 76 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          />
          {/* Long underline flourish */}
          <motion.path
            d="M 20 70 C 60 74, 110 66, 170 72"
            fill="none"
            stroke="#E86A2B"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 1.3, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          Divyansh Singh · Bengaluru
        </span>
      </div>
    </div>
  );
}
