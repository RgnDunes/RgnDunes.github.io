"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { experiences } from "@/data/experience";

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

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [openTab, setOpenTab] = useState<"achievements" | "roles" | "awards" | null>(
    "achievements"
  );

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

      {/* Timeline as a table */}
      <ol className="mt-10 divide-y divide-rule">
        {experiences.map((exp, idx) => {
          const open = openIdx === idx;
          const hasAch = !!exp.achievements?.length;
          const hasRoles = !!exp.previousRoles?.length;
          const hasMedia = !!exp.media?.length;
          const anyExtras = hasAch || hasRoles || hasMedia;

          return (
            <motion.li
              key={exp.company}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className="group"
            >
              {/* Row header */}
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
                className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 py-6 text-left md:grid-cols-[100px_44px_1fr_auto] md:items-center md:gap-6"
              >
                {/* Duration */}
                <div className="col-span-full order-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted md:order-1 md:col-span-1">
                  {exp.duration}
                </div>

                {/* Logo */}
                <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-rule bg-paper-2 p-1.5 order-1 md:order-2">
                  <Image src={exp.logo} alt={exp.company} fill className="object-contain p-1" />
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
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.technologies.map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expand */}
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
                    <div className="mb-8 ml-0 rounded-2xl border border-rule bg-paper-2 p-6 md:ml-[calc(100px+44px+3rem)]">
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
    </section>
  );
}

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
