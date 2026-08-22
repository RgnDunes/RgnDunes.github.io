"use client";

import { motion } from "framer-motion";
import {
  FaChartLine,
  FaExclamationTriangle,
  FaCodeBranch,
  FaTerminal,
} from "react-icons/fa";
import type { Evidence } from "./types";

interface Props {
  ev: Evidence;
  expanded: boolean;
  onOpen: () => void;
  onHover: (cluster: string | null) => void;
  highlighted: boolean;
  used: boolean;
}

/**
 * A single evidence tile - small when collapsed, blooms when expanded.
 * Hovering highlights other evidence in the same cluster.
 */
export default function EvidenceTile({
  ev,
  expanded,
  onOpen,
  onHover,
  highlighted,
  used,
}: Props) {
  const Icon = ICONS[ev.kind];
  const isChart = ev.kind === "chart";

  return (
    <motion.button
      layout
      onClick={() => !expanded && onOpen()}
      onMouseEnter={() => ev.cluster && onHover(ev.cluster)}
      onMouseLeave={() => onHover(null)}
      className={`ripple-evidence group relative flex flex-col overflow-hidden p-4 text-left transition-all
        ${expanded ? "is-expanded cursor-default" : "cursor-pointer"}
        ${highlighted && !expanded ? "is-highlighted" : ""}
        ${used ? "is-read" : ""}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          <Icon className="h-3 w-3" />
          <span>{KIND_LABEL[ev.kind]}</span>
          {ev.ts && <span className="text-ink/40">{ev.ts}</span>}
        </div>
        {used && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-seal">
            · read
          </span>
        )}
      </div>

      {/* Label */}
      <div
        className={`mt-2 font-display text-ink ${
          expanded ? "text-2xl" : "text-[15px] leading-tight"
        }`}
      >
        {ev.label}
      </div>

      {/* Chart tile: sparkline */}
      {isChart && ev.series && (
        <Sparkline
          series={ev.series}
          anomaly={ev.anomaly}
          height={expanded ? 80 : 32}
        />
      )}

      {/* PR body */}
      {ev.kind === "pr" && ev.pr && (
        <div className="mt-2 font-mono text-[11px] text-ink-2">
          <div className="truncate">
            #{ev.pr.number} · {ev.pr.title}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted">
            <span>{ev.pr.author}</span>
            <span>·</span>
            <span className="truncate">{ev.pr.branch}</span>
          </div>
        </div>
      )}

      {/* Alert body */}
      {ev.kind === "alert" && !expanded && (
        <div className="mt-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-saffron">
            firing
          </span>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="ripple-evidence-detail mt-4 pt-4 text-[13.5px] leading-[1.6] text-ink-2"
        >
          {ev.detail}
        </motion.div>
      )}

      {!expanded && (
        <div className="pointer-events-none mt-auto pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted opacity-60 group-hover:opacity-100">
          Click to inspect · <span className="text-saffron">−2s</span>
        </div>
      )}
    </motion.button>
  );
}

const ICONS = {
  chart: FaChartLine,
  log: FaTerminal,
  pr: FaCodeBranch,
  alert: FaExclamationTriangle,
};

const KIND_LABEL = {
  chart: "Chart",
  log: "Log",
  pr: "Pull request",
  alert: "Alert",
};

/* ─── Sparkline ─────────────────────────────────────── */

function Sparkline({
  series,
  anomaly,
  height,
}: {
  series: number[];
  anomaly?: "spike" | "flatline" | "creep" | "normal";
  height: number;
}) {
  const w = 200;
  const h = height;
  const step = w / (series.length - 1);
  const pts = series
    .map(
      (v, i) => `${(i * step).toFixed(1)},${(h - v * h * 0.85 - 4).toFixed(1)}`,
    )
    .join(" ");

  const isHot = anomaly === "spike" || anomaly === "creep";
  const stroke = isHot
    ? "#E86A2B"
    : anomaly === "flatline"
      ? "#647386"
      : "#6F8FFF";

  return (
    <div className="mt-2" style={{ height }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {/* Baseline */}
        <line
          x1={0}
          y1={h - 4}
          x2={w}
          y2={h - 4}
          stroke="rgb(220 229 239 / 0.16)"
          strokeWidth="0.75"
        />
        {/* Threshold band (hot values above 0.7) */}
        {isHot && (
          <rect
            x={0}
            y={h - h * 0.85 * 0.7 - 4}
            width={w}
            height={h * 0.85 * 0.7}
            fill="rgb(232 106 43 / 0.1)"
          />
        )}
        {/* Line */}
        <polyline
          points={pts}
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots on values above threshold */}
        {series.map((v, i) => {
          const hot = v > 0.7;
          return (
            <circle
              key={i}
              cx={i * step}
              cy={h - v * h * 0.85 - 4}
              r={hot ? 2.2 : 1.2}
              fill={hot ? "#E86A2B" : "#6F8FFF"}
            />
          );
        })}
      </svg>
    </div>
  );
}
