"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import ProfileImage from "../../assets/images/profile.jpg";
import KiitLogo from "../../assets/images/logos/kiit-logo.png";
import LogoPlate from "../LogoPlate";

const stats = [
  { n: "530+", k: "Merchants onboarded", note: "MY / SG expansion" },
  { n: "100K+", k: "Weekly downloads", note: "i18nify-js (npm)" },
  { n: "100+", k: "Students mentored", note: "AccioJob · Airtribe" },
  { n: "27+", k: "Teams adopting", note: "Internal SDKs" },
];

const socials = [
  { icon: FaGithub, href: "https://github.com/RgnDunes", label: "GitHub" },
  { icon: FaLinkedin, href: "https://linkedin.com/in/rgndunes", label: "LinkedIn" },
  { icon: MdEmail, href: "mailto:rgndunes@gmail.com", label: "Email" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="page-shell py-28 md:py-36">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">i.</span>
          <div>
            <span className="eyebrow">The Feature</span>
            <h2 className="font-display text-display-3 text-ink">
              A note from the desk<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          Written, edited, and typeset by the subject himself
        </p>
      </motion.div>

      <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Left — portrait column */}
        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="md:col-span-4"
        >
          <figure className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[20px] bg-paper-2" />
            <div className="relative overflow-hidden rounded-[16px] border border-rule">
              <Image
                src={ProfileImage}
                alt="Divyansh Singh"
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-square-3 object-cover object-top"
                priority
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
                Fig. 1 · The subject
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
                {new Date().getFullYear()}
              </span>
            </figcaption>
          </figure>

          {/* Contact quick row */}
          <div className="mt-6 flex gap-2">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink hover:bg-ink hover:text-paper"
                  aria-label={s.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          {/* Education pill */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-rule bg-paper-2 p-4">
            <LogoPlate src={KiitLogo} alt="KIIT" size={44} pad={8} surface="paper" />
            <div>
              <div className="font-display text-base text-ink">B.Tech, KIIT University</div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                CGPA 9.65 · Class of 2019
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Middle — long-form column */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-5"
        >
          <p className="drop-cap font-display text-[19px] leading-[1.55] text-ink-2 md:text-[20px]">
            I write software for a living. Specifically, I write the software that
            other engineers depend on to write their software — the pipelines,
            the tooling, the SDKs, the observability. It is the plumbing of
            the modern web, and it is more interesting than it sounds.
          </p>

          <p className="mt-6 font-body text-[16.5px] leading-[1.68] text-ink-2">
            At <span className="text-ink">Rippling</span>, I work on the Web
            Infrastructure team — migrating package auth to AWS Secrets Manager
            with zero downtime, building a flakiness detection system on top of
            Datadog, and redesigning route attribution so it stops silently
            drifting. Before that, four years at{" "}
            <span className="text-ink">Razorpay</span>: leading the international
            expansion into Malaysia and Singapore, shipping the Mastercard
            Biometric Authentication demoed at GFF 2024, and open-sourcing{" "}
            <span className="marker">i18nify-js</span> — an SDK now downloaded
            over 100,000 times a week.
          </p>

          <p className="mt-6 font-body text-[16.5px] leading-[1.68] text-ink-2">
            Outside the day job, I teach React at <span className="text-ink">AccioJob</span>,
            mentor students at <span className="text-ink">Airtribe</span>, sat on the
            jury for <span className="text-ink">Flipkart GRID 6.0</span>, and write
            long-form essays about frontend infrastructure — the ones you'll find in the notebook below.
          </p>

          <div className="mt-8 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
            <span className="h-px w-6 bg-rule" />
            <span>— DS, Bengaluru</span>
          </div>
        </motion.article>

        {/* Right — stats sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="md:col-span-3"
        >
          <div className="eyebrow mb-4">By the numbers</div>
          <ul className="divide-y divide-rule border-y border-rule">
            {stats.map((s) => (
              <li key={s.k} className="grid grid-cols-[auto_1fr] items-baseline gap-4 py-4">
                <span className="font-display text-3xl text-ink">{s.n}</span>
                <span>
                  <span className="block text-sm font-medium text-ink">{s.k}</span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                    {s.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}
