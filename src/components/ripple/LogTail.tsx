"use client";

import { useEffect, useState } from "react";

const AMBIENT_LOGS = [
  "GET /api/v1/health 200 · 8ms",
  "POST /login 200 · 42ms · user=usr_9x2",
  "GET /invoices?tab=paid 200 · 61ms",
  "auth.token.refresh ok · rotate_in=54min",
  "ci: runner-42 idle",
  "GET /api/v1/health 200 · 7ms",
  "e2e: worker 3/12 started",
  "metrics: ingested · service.rps",
  "GET /assets/index-3b0eaa.js 200 · 4ms · cache=hit",
  "GET /api/v1/health 200 · 9ms",
  "cdn: cache TTL 300s",
  "auth.check ok · latency=12ms",
];

/**
 * A subtle ambient log stream that keeps ticking - evokes a live
 * dashboard. It's cosmetic. The real evidence lives in the tiles.
 */
export default function LogTail() {
  const [lines, setLines] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    let n = 0;
    const push = () => {
      const t = AMBIENT_LOGS[Math.floor(Math.random() * AMBIENT_LOGS.length)];
      setLines((prev) => {
        const next = [...prev, { id: n++, text: t }];
        return next.length > 8 ? next.slice(next.length - 8) : next;
      });
    };
    push();
    const iv = setInterval(push, 900);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="rounded-2xl border border-rule bg-ink p-4">
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840] animate-pulse" />
          Live log tail
        </span>
        <span>tail -f prod</span>
      </div>
      <div className="h-40 overflow-hidden font-mono text-[11px] text-paper/75">
        {lines.map((l, i) => (
          <div
            key={l.id}
            className="truncate leading-[1.6]"
            style={{ opacity: 0.35 + (i / lines.length) * 0.65 }}
          >
            <span className="text-paper/40">{fakeTs(l.id)}</span>{" "}
            <span>{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function fakeTs(seed: number) {
  const mm = String((seed * 7 + 3) % 60).padStart(2, "0");
  const ss = String((seed * 11 + 17) % 60).padStart(2, "0");
  return `14:${mm}:${ss}`;
}
