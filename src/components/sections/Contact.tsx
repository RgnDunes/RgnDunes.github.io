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

    </section>
  );
}
