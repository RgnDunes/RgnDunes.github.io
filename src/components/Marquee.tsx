"use client";

import { FaCode, FaInfinity, FaStar } from "react-icons/fa";

const items: { label: string; kind: "stat" | "sep" | "word" | "icon" }[] = [
  { label: "100K+", kind: "stat" },
  { label: "Weekly downloads", kind: "word" },
  { label: "❋", kind: "sep" },
  { label: "530", kind: "stat" },
  { label: "Merchants activated", kind: "word" },
  { label: "❋", kind: "sep" },
  { label: "L6", kind: "stat" },
  { label: "Software engineer", kind: "word" },
  { label: "❋", kind: "sep" },
  { label: "27+", kind: "stat" },
  { label: "Teams adopting", kind: "word" },
  { label: "❋", kind: "sep" },
  { label: "6", kind: "stat" },
  { label: "Companies", kind: "word" },
  { label: "❋", kind: "sep" },
  { label: "∞", kind: "stat" },
  { label: "Deploys", kind: "word" },
  { label: "❋", kind: "sep" },
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-rule bg-ink py-5 text-paper">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

      <div className="marquee items-center whitespace-nowrap">
        {/* twice for seamless loop */}
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center gap-10 pr-10">
            {items.map((item, i) => {
              if (item.kind === "sep") {
                return (
                  <span
                    key={`${k}-${i}`}
                    className="text-saffron text-xl leading-none"
                  >
                    {item.label}
                  </span>
                );
              }
              if (item.kind === "stat") {
                return (
                  <span
                    key={`${k}-${i}`}
                    className="font-display text-3xl italic text-paper md:text-4xl"
                  >
                    {item.label}
                  </span>
                );
              }
              return (
                <span
                  key={`${k}-${i}`}
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-paper/70"
                >
                  {item.label}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
