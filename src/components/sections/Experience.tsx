"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { experiences } from "@/data/experience";
import LogoPlate from "../LogoPlate";

const highlight = (text: string) =>
  text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <span key={i} className="text-ink font-medium">
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );

/* ─── Duration parsing ────────────────────────────────────
   Handles "Jun 2025 - Present", "May 2021 - Jun 2025",
   "Aug 2020 - Oct 2020", etc. Returns start/end/months.
   ────────────────────────────────────────────────────── */

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseMonthYear(s: string): Date | "now" | null {
  const t = s.trim();
  if (/^present$/i.test(t) || /^now$/i.test(t)) return "now";
  const m = t.match(/^([A-Za-z]{3,})\.?\s+(\d{4})$/);
  if (!m) return null;
  const mi = MONTHS.findIndex((mm) => m[1].toLowerCase().startsWith(mm.toLowerCase()));
  if (mi < 0) return null;
  return new Date(parseInt(m[2], 10), mi, 1);
}

function parseDuration(duration: string): { start: Date; end: Date; current: boolean; months: number } | null {
  const parts = duration.split(/[-–—]/).map((p) => p.trim());
  if (parts.length !== 2) return null;
  const start = parseMonthYear(parts[0]);
  const end = parseMonthYear(parts[1]);
  if (!start || !end || start === "now") return null;
  const current = end === "now";
  const endDate = current ? new Date(2026, 6, 1) : (end as Date);
  const months =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth()) +
    1;
  return { start, end: endDate, current, months };
}

function fmtSpan(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y > 0 && m > 0) return `${y}y ${m}m`;
  if (y > 0) return `${y}y`;
  return `${m}m`;
}

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [openTab, setOpenTab] = useState<"achievements" | "roles" | "awards" | null>(
    "achievements"
  );

  const meta = useMemo(() => {
    return experiences.map((e) => ({
      exp: e,
      parsed: parseDuration(e.duration),
    }));
  }, []);

  return (
    <section id="work" ref={ref} className="page-shell py-28 md:py-36">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">ii.</span>
          <div>
            <span className="eyebrow">The Log</span>
            <h2 className="font-display text-display-3 text-ink">
              A working history<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-lg font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          Six chapters · five companies · one open-source SDK · countless late-night deploys
        </p>
      </motion.div>

      {/* Timeline body with a spine on the left */}
      <div className="relative mt-14 md:mt-16">
        {/* ─── Saffron spine down the node column ─── */}
        <motion.span
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="pointer-events-none absolute inset-y-4 hidden origin-top md:block"
          style={{
            left: "calc(90px + 30px)",
            width: 1,
            background:
              "linear-gradient(to bottom, rgb(232 106 43 / 0), rgb(232 106 43 / 0.35), rgb(232 106 43 / 0))",
          }}
        />

        {/* Rows */}
        <ol className="relative">
          {meta.map(({ exp, parsed }, idx) => {
            const open = openIdx === idx;
            const hasAch = !!exp.achievements?.length;
            const hasRoles = !!exp.previousRoles?.length;
            const hasMedia = !!exp.media?.length;
            const anyExtras = hasAch || hasRoles || hasMedia;
            const isLast = idx === meta.length - 1;
            const zigLeft = idx % 2 === 0;

            return (
              <motion.li
                key={exp.company + idx}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="group relative"
              >
                {/* Row content */}
                <button
                  onClick={() => {
                    const willOpen = !open;
                    setOpenIdx(willOpen ? idx : null);
                    if (willOpen) {
                      setOpenTab(
                        hasAch ? "achievements" : hasRoles ? "roles" : hasMedia ? "awards" : null
                      );
                    }
                  }}
                  disabled={!anyExtras}
                  className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 py-8 text-left md:grid-cols-[90px_60px_1fr_auto] md:items-center md:gap-6 md:pl-16"
                >
                  {/* Duration + elapsed */}
                  <div className="col-span-full order-3 md:order-1 md:col-span-1">
                    <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                      {exp.duration}
                    </div>
                    {parsed && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.15em] ${
                            parsed.current
                              ? "border-saffron bg-saffron/10 text-saffron"
                              : "border-rule bg-paper text-ink-2"
                          }`}
                        >
                          {parsed.current && (
                            <span className="mr-1 h-1 w-1 rounded-full bg-saffron animate-pulse" />
                          )}
                          {fmtSpan(parsed.months)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Node dot + logo — both live on the spine */}
                  <div className="relative order-1 flex items-center justify-center md:order-2">
                    <TimelineNode
                      current={!!parsed?.current}
                      idx={idx}
                    />
                    <div className="relative z-10">
                      <LogoPlate
                        src={exp.logo}
                        alt={exp.company}
                        size={44}
                        pad={9}
                        surface="paper"
                      />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="order-2 md:order-3">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-2xl text-ink md:text-3xl">
                        {exp.position}
                      </h3>
                      <span className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-saffron">
                        @ {exp.company}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-[15px] leading-[1.6] text-ink-2">
                      {exp.description}
                    </p>

                    {/* Impact ledger — one dot per achievement */}
                    {hasAch && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
                          Impact
                        </span>
                        <span className="flex gap-1">
                          {exp.achievements!.slice(0, 8).map((_, i) => (
                            <motion.span
                              key={i}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={inView ? { scale: 1, opacity: 1 } : {}}
                              transition={{ duration: 0.3, delay: idx * 0.08 + i * 0.06 + 0.4 }}
                              className="h-1.5 w-1.5 rounded-full bg-saffron"
                            />
                          ))}
                          {exp.achievements!.length > 8 && (
                            <span className="font-mono text-[9.5px] uppercase tracking-[0.15em] text-muted">
                              +{exp.achievements!.length - 8}
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {exp.technologies.map((t) => (
                          <span key={t} className="chip">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expand chevron */}
                  {anyExtras && (
                    <span
                      className={`order-4 flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink-2 transition-transform ${
                        open ? "rotate-180 border-ink text-ink" : "group-hover:border-ink"
                      }`}
                    >
                      <FaChevronDown className="h-3 w-3" />
                    </span>
                  )}
                </button>

                {/* Zigzag connector to next row (svg) */}
                {!isLast && (
                  <div className="hidden md:block pointer-events-none absolute left-[90px] right-16 -bottom-0 h-8 z-0">
                    <ZigzagConnector left={zigLeft} inView={inView} delay={idx * 0.08 + 0.3} />
                  </div>
                )}

                {/* Row divider (mobile + desktop fallback) */}
                {!isLast && (
                  <div className="md:hidden h-px bg-rule" />
                )}

                {/* Expanded body */}
                <AnimatePresence initial={false}>
                  {open && anyExtras && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mb-8 ml-0 rounded-2xl border border-rule bg-paper-2 p-6 md:ml-[calc(90px+60px+1.5rem+4rem)]">
                        {/* Tabs */}
                        <div className="mb-5 flex flex-wrap gap-2">
                          {hasAch && (
                            <TabBtn
                              active={openTab === "achievements"}
                              onClick={() => setOpenTab("achievements")}
                            >
                              Key Achievements
                            </TabBtn>
                          )}
                          {hasRoles && (
                            <TabBtn
                              active={openTab === "roles"}
                              onClick={() => setOpenTab("roles")}
                            >
                              Role History
                            </TabBtn>
                          )}
                          {hasMedia && (
                            <TabBtn
                              active={openTab === "awards"}
                              onClick={() => setOpenTab("awards")}
                            >
                              Awards & Media
                            </TabBtn>
                          )}
                        </div>

                        {openTab === "achievements" && hasAch && (
                          <ul className="grid gap-3 md:grid-cols-2">
                            {exp.achievements!.map((a, i) => (
                              <li key={i} className="flex gap-3 text-[15px] leading-[1.6] text-ink-2">
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-saffron" />
                                <span>{highlight(a)}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {openTab === "roles" && hasRoles && (
                          <div className="space-y-4">
                            {exp.previousRoles!.map((r, i) => (
                              <div key={i} className="rounded-xl border border-rule bg-paper p-4">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <h4 className="font-display text-lg text-ink">{r.position}</h4>
                                  <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                                    {r.duration}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm text-ink-2">{r.description}</p>
                                {r.achievements?.length > 0 && (
                                  <ul className="mt-3 space-y-1.5">
                                    {r.achievements.map((a, j) => (
                                      <li key={j} className="flex gap-2 text-sm text-ink-2">
                                        <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-seal" />
                                        <span>{a}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {openTab === "awards" && hasMedia && (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {exp.media!.map((m, i) => (
                              <figure
                                key={i}
                                className="overflow-hidden rounded-xl border border-rule bg-paper"
                              >
                                <div className="relative aspect-video">
                                  <Image src={m.src} alt={m.caption} fill className="object-cover" />
                                </div>
                                <figcaption className="p-3 text-center font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                                  {m.caption}
                                </figcaption>
                              </figure>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>

        {/* Terminal stamp at the bottom of the spine */}
        <div className="relative mt-6 hidden md:flex items-center gap-3 pl-[calc(90px+60px+0.5rem)]">
          <span className="h-2 w-2 rounded-full bg-ink" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
            Earlier chapters lost to the archives
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─── Timeline node ──────────────────────────────────── */

function TimelineNode({ current, idx }: { current: boolean; idx: number }) {
  return (
    <>
      {/* Small radar pulse behind the logo if current */}
      {current && (
        <>
          <motion.span
            aria-hidden
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            className="absolute h-12 w-12 rounded-full border border-saffron"
          />
          <motion.span
            aria-hidden
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.2,
            }}
            className="absolute h-12 w-12 rounded-full border border-saffron"
          />
        </>
      )}
      {/* Chapter numeral behind the logo */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 font-display italic text-[10px] text-muted"
      >
        {String(idx + 1).padStart(2, "0")}
      </span>
    </>
  );
}

/* ─── Zigzag SVG connector between rows ──────────────── */

function ZigzagConnector({ left, inView, delay }: { left: boolean; inView: boolean; delay: number }) {
  // A short curved path: starts at the spine (x=0), swings out to the right,
  // then comes back. Alternates side per row via `left`.
  const swing = left ? 40 : -40;
  const d = `M 0 0 C 0 12, ${swing} 16, ${swing} 32 S 0 44, 0 56`;
  return (
    <svg
      viewBox="-60 0 120 56"
      preserveAspectRatio="none"
      className="h-full w-full"
      style={{ overflow: "visible" }}
    >
      <motion.path
        d={d}
        fill="none"
        stroke="rgb(232 106 43 / 0.5)"
        strokeWidth="1.25"
        strokeDasharray="4 4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </svg>
  );
}

/* ─── Tab button ──────────────────────────────────────── */

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-all ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule bg-paper text-ink-2 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
