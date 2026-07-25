"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaBook,
  FaGithub,
  FaSpotify,
  FaTerminal,
  FaCode,
  FaMap,
  FaClock,
} from "react-icons/fa";

/* Deterministic PRNG so the "heatmap" stays consistent across renders */
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export default function Workshop() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="workshop" className="page-shell py-28 md:py-36">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">✦</span>
          <div>
            <span className="eyebrow">The Workshop</span>
            <h2 className="font-display text-display-3 text-ink">
              A live cross-section<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          What is on my desk right now — inputs, outputs, the small daily craft
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="mt-12 grid gap-4 md:grid-cols-6 md:grid-rows-[repeat(3,minmax(140px,auto))]">
        {/* Terminal — wide, top-left, 3 rows */}
        <TerminalTile className="md:col-span-3 md:row-span-3" />

        {/* GitHub heatmap — top right, 2 cols */}
        <HeatmapTile className="md:col-span-3 md:row-span-1" />

        {/* Currently reading */}
        <ReadingTile className="md:col-span-2 md:row-span-1" />

        {/* Now playing / on-repeat */}
        <NowPlayingTile className="md:col-span-1 md:row-span-1" />

        {/* World deploys / status */}
        <DeploysTile className="md:col-span-3 md:row-span-1" />
      </div>
    </section>
  );
}

/* ─── Terminal tile ───────────────────────────────────────── */

const SEQUENCE: { prompt: string; command: string; output: string[] }[] = [
  {
    prompt: "~/desk",
    command: "whoami",
    output: ["divyansh — software engineer, L6 @ rippling"],
  },
  {
    prompt: "~/desk",
    command: "cat now.md",
    output: [
      "▸ web infra · ci/cd · developer tooling",
      "▸ writing chapter 2 of the frontend infrastructure book",
      "▸ open to talk — rgndunes@gmail.com",
    ],
  },
  {
    prompt: "~/desk",
    command: "git shortlog -sn --since='30 days'",
    output: [
      "  187  divyansh singh",
      "  … and a lot of green squares",
    ],
  },
  {
    prompt: "~/desk",
    command: "cat gita/2-47.txt",
    output: [
      "\"You have the right to work — never to its fruits.\"",
    ],
  },
];

function TerminalTile({ className = "" }: { className?: string }) {
  const [lines, setLines] = useState<{ prompt: string; text: string; kind: "cmd" | "out" }[]>([]);
  const [caret, setCaret] = useState(true);
  const stepRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const type = async (str: string, delay = 24) => {
      for (let i = 1; i <= str.length; i++) {
        if (cancelled) return;
        setLines((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.kind === "cmd" && (last as any).typing) {
            next[next.length - 1] = { ...last, text: str.slice(0, i) };
          }
          return next;
        });
        await new Promise((r) => setTimeout(r, delay));
      }
    };

    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    const run = async () => {
      while (!cancelled) {
        const item = SEQUENCE[stepRef.current % SEQUENCE.length];
        stepRef.current++;

        setLines((prev) => [
          ...prev,
          { prompt: item.prompt, text: "", kind: "cmd", typing: true } as any,
        ]);
        await type(item.command);
        await wait(280);
        setLines((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last) next[next.length - 1] = { ...last, kind: "cmd" as const } as any;
          return next;
        });

        for (const line of item.output) {
          if (cancelled) return;
          await wait(80);
          setLines((prev) => [...prev, { prompt: "", text: line, kind: "out" }]);
        }
        await wait(1600);

        // trim buffer
        setLines((prev) => (prev.length > 14 ? prev.slice(prev.length - 12) : prev));
      }
    };

    run();

    const caretIv = setInterval(() => setCaret((c) => !c), 550);

    return () => {
      cancelled = true;
      clearInterval(caretIv);
    };
  }, []);

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-rule bg-ink text-paper ${className}`}
    >
      {/* Titlebar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/50">
          <FaTerminal className="h-2.5 w-2.5" />
          divyansh — zsh
        </div>
        <div className="h-2.5 w-8" />
      </div>

      {/* Body */}
      <div className="flex-1 space-y-1.5 overflow-hidden px-5 py-4 font-mono text-[12.5px] leading-[1.55]">
        {lines.map((l, i) => {
          if (l.kind === "cmd") {
            return (
              <div key={i} className="flex flex-wrap items-baseline gap-2">
                <span className="text-[#7cd992]">➜</span>
                <span className="text-[#66c8ff]">{l.prompt}</span>
                <span>{l.text}</span>
                {i === lines.length - 1 && (l as any).typing && (
                  <span
                    className="inline-block h-[1em] w-[7px] translate-y-[1px] bg-saffron"
                    style={{ opacity: caret ? 1 : 0 }}
                  />
                )}
              </div>
            );
          }
          return (
            <div key={i} className="pl-6 text-white/80">
              {l.text}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840] animate-pulse" />
          Session live
        </span>
        <span>Type ⌘K to open a real one</span>
      </div>
    </div>
  );
}

/* ─── GitHub heatmap ─────────────────────────────────────── */

function HeatmapTile({ className = "" }: { className?: string }) {
  const weeks = 26;
  const days = 7;
  const rand = rng(20260725);
  const cells: number[] = Array.from({ length: weeks * days }, () => {
    const v = rand();
    if (v < 0.35) return 0;
    if (v < 0.6) return 1;
    if (v < 0.82) return 2;
    if (v < 0.95) return 3;
    return 4;
  });
  const total = cells.reduce((a, b) => a + (b > 0 ? 1 : 0), 0);
  const shade = (n: number) => {
    const opacities = [0.08, 0.28, 0.5, 0.72, 1];
    return `rgb(232 106 43 / ${opacities[n]})`;
  };

  return (
    <div className={`paper-tile relative flex flex-col overflow-hidden p-5 ${className}`}>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <FaGithub className="h-3.5 w-3.5 text-ink" />
          <span className="eyebrow">Commit weather</span>
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
          Last 26 weeks
        </span>
      </div>
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${weeks}, 1fr)`,
          gridAutoFlow: "column",
          gridTemplateRows: `repeat(${days}, 1fr)`,
        }}
      >
        {cells.map((n, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: (i % weeks) * 0.008 + 0.001 * i }}
            style={{ background: n === 0 ? "rgb(210 202 189 / 0.4)" : shade(n) }}
            className="aspect-square rounded-[3px]"
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
        <span>
          <span className="text-ink">{total}</span> shipping days
        </span>
        <span className="flex items-center gap-1.5">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className="h-2 w-2 rounded-[2px]"
              style={{ background: n === 0 ? "rgb(210 202 189 / 0.4)" : shade(n) }}
            />
          ))}
          <span>More</span>
        </span>
      </div>
    </div>
  );
}

/* ─── Currently reading ────────────────────────────────── */

function ReadingTile({ className = "" }: { className?: string }) {
  return (
    <div className={`paper-tile relative flex flex-col overflow-hidden p-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <FaBook className="h-3.5 w-3.5 text-ink" />
        <span className="eyebrow">On the desk</span>
      </div>
      <div className="flex items-start gap-4">
        {/* Book spine */}
        <div className="relative h-24 w-16 flex-shrink-0 rounded-sm bg-seal shadow-[6px_6px_0_rgb(20,20,22)]">
          <div className="absolute inset-2 border border-white/20" />
          <div className="absolute inset-x-0 top-6 -rotate-90 text-center font-display italic text-[11px] text-paper/80">
            Bhagavad
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg leading-tight text-ink">
            The Bhagavad Gītā
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
            Translation · Eknath Easwaran
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              <span>Ch. 2 · verse 47</span>
              <span className="text-saffron">31 / 700</span>
            </div>
            <div className="h-1 w-full rounded-full bg-rule">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "4.4%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="h-full rounded-full bg-saffron"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── On repeat ────────────────────────────────────────── */

function NowPlayingTile({ className = "" }: { className?: string }) {
  return (
    <div className={`paper-tile relative flex flex-col overflow-hidden p-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <FaSpotify className="h-3.5 w-3.5 text-seal" />
        <span className="eyebrow">On repeat</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {/* Vinyl */}
        <div className="mx-auto mb-3 relative h-16 w-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-ink"
            style={{
              background:
                "repeating-radial-gradient(circle at center, rgb(20 20 22), rgb(20 20 22) 2px, rgb(60 58 55) 2px, rgb(60 58 55) 3px)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron" />
        </div>
        <div className="text-center">
          <div className="font-display text-sm text-ink truncate">Vaishnava Jana To</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted truncate">
            Narsinh Mehta
          </div>
        </div>
      </div>
      {/* Waveform */}
      <div className="mt-3 flex h-4 items-end justify-between gap-[2px]">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.span
            key={i}
            className="flex-1 bg-saffron/70"
            animate={{ height: [`${20 + ((i * 7) % 60)}%`, `${40 + ((i * 13) % 50)}%`, `${20 + ((i * 7) % 60)}%`] }}
            transition={{ duration: 1.2 + (i % 4) * 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Deploy map ───────────────────────────────────────── */

const CITIES = [
  { name: "San Francisco", x: 15, y: 42, region: "NA" },
  { name: "New York", x: 28, y: 40, region: "NA" },
  { name: "London", x: 47, y: 34, region: "EU" },
  { name: "Berlin", x: 51, y: 34, region: "EU" },
  { name: "Bengaluru", x: 68, y: 55, region: "APAC", primary: true },
  { name: "Singapore", x: 76, y: 63, region: "APAC" },
  { name: "Kuala Lumpur", x: 75, y: 62, region: "APAC" },
  { name: "Sydney", x: 87, y: 78, region: "APAC" },
];

function DeploysTile({ className = "" }: { className?: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setT((v) => (v + 1) % CITIES.length), 1600);
    return () => clearInterval(iv);
  }, []);

  const activeCity = CITIES[t];

  return (
    <div className={`paper-tile relative flex flex-col overflow-hidden p-5 ${className}`}>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <FaMap className="h-3.5 w-3.5 text-ink" />
          <span className="eyebrow">Where the code ran</span>
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-saffron">
          → {activeCity.name}
        </span>
      </div>

      <div className="relative flex-1 min-h-[110px]">
        {/* Dotted world backdrop */}
        <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {/* dot matrix "world" */}
          {Array.from({ length: 30 }).map((_, row) =>
            Array.from({ length: 60 }).map((_, col) => {
              const r = rng(row * 100 + col + 1)();
              if (r < 0.55) return null;
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={(col / 60) * 100}
                  cy={(row / 30) * 60}
                  r="0.3"
                  fill="rgb(210 202 189)"
                />
              );
            })
          )}
        </svg>

        {/* Cities */}
        {CITIES.map((c, i) => {
          const active = i === t;
          return (
            <span
              key={c.name}
              className="absolute"
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%,-50%)" }}
            >
              <span
                className={`block h-1.5 w-1.5 rounded-full ${
                  c.primary ? "bg-saffron" : "bg-ink"
                }`}
              />
              {active && (
                <>
                  <motion.span
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 6, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron"
                  />
                  <span className="absolute left-2 -top-1 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.15em] text-ink">
                    {c.name}
                  </span>
                </>
              )}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
        <span>530+ merchants activated</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron animate-pulse" />
          Live
        </span>
      </div>
    </div>
  );
}
