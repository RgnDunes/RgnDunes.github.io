"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowRight,
  FaCheck,
  FaExclamationTriangle,
  FaFire,
  FaPlay,
  FaTimes,
} from "react-icons/fa";
import EvidenceTile from "./EvidenceTile";
import LogTail from "./LogTail";
import { INCIDENTS } from "./incidents";
import type { Hypothesis, Incident, ShiftStats } from "./types";

interface Props {
  onExit: () => void;
}

type Phase = "intro" | "playing" | "resolved" | "failed" | "shift-over";

interface Attempt {
  incident: Incident;
  timeLeft: number;
  timeSpent: number;
  expanded: Set<string>;
  chosen: string | null;
  strikeUsed: boolean;
  wrongGuesses: number;
  resolved: boolean;
  hoverCluster: string | null;
}

/**
 * Ripple - a debugging deduction game.
 *
 * You are on-call. Five incidents queue up. For each one you get a
 * time budget, a dashboard of evidence tiles, and four possible root
 * causes. Expanding a tile costs 2 seconds. Wrong hypothesis eats a
 * strike (one allowed) and 15 more seconds. Time out or two wrong
 * = incident escalates unresolved.
 *
 * All incidents drawn from real production engineering scenarios.
 */
export default function RippleShell({ onExit }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(m.matches);
  }, []);

  useEffect(() => {
    if (phase === "intro" || phase === "playing" || phase === "shift-over") {
      shellRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [index, phase]);

  const startShift = useCallback(() => {
    setIndex(0);
    setAttempts([]);
    setPhase("playing");
  }, []);

  const currentIncident = INCIDENTS[index];
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const attemptTimeLeft = attempt?.timeLeft;

  // Initialise attempt when phase becomes playing
  useEffect(() => {
    if (phase !== "playing") return;
    if (!currentIncident) {
      setPhase("shift-over");
      return;
    }
    setAttempt({
      incident: currentIncident,
      timeLeft: currentIncident.seconds,
      timeSpent: 0,
      expanded: new Set(),
      chosen: null,
      strikeUsed: false,
      wrongGuesses: 0,
      resolved: false,
      hoverCluster: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || attemptTimeLeft === undefined) return;
    if (attemptTimeLeft <= 0) {
      // Time up → fail
      setPhase("failed");
      return;
    }
    const iv = setInterval(() => {
      setAttempt((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
          timeSpent: prev.timeSpent + 1,
        };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, attemptTimeLeft]);

  // ESC handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  const expandEvidence = (id: string) => {
    setAttempt((prev) => {
      if (!prev) return prev;
      if (prev.expanded.has(id)) return prev;
      const next = new Set(prev.expanded);
      next.add(id);
      return {
        ...prev,
        expanded: next,
        timeLeft: Math.max(0, prev.timeLeft - 2),
      };
    });
  };

  const setHoverCluster = (c: string | null) => {
    setAttempt((prev) => (prev ? { ...prev, hoverCluster: c } : prev));
  };

  const submitHypothesis = (h: Hypothesis) => {
    setAttempt((prev) => {
      if (!prev) return prev;
      if (h.correct) {
        return { ...prev, chosen: h.id, resolved: true };
      }
      // Wrong
      if (prev.strikeUsed) {
        return { ...prev, chosen: h.id, wrongGuesses: 2 };
      }
      return {
        ...prev,
        chosen: h.id,
        strikeUsed: true,
        wrongGuesses: 1,
        timeLeft: Math.max(0, prev.timeLeft - 15),
      };
    });
  };

  // React to attempt state changes → resolve / fail
  useEffect(() => {
    if (!attempt || phase !== "playing") return;
    if (attempt.resolved) {
      setPhase("resolved");
    } else if (
      attempt.chosen &&
      attempt.wrongGuesses >= 2 &&
      !attempt.resolved
    ) {
      // Both strikes used and still wrong
      // (chose again after strike was already true)
      const chosenH = attempt.incident.hypotheses.find(
        (h) => h.id === attempt.chosen,
      );
      if (chosenH && !chosenH.correct) {
        setPhase("failed");
      }
    }
  }, [attempt?.chosen, attempt?.resolved, attempt?.wrongGuesses, phase]);

  // When strike happens, clear the chosen so player can pick again
  useEffect(() => {
    if (!attempt) return;
    if (
      attempt.chosen &&
      !attempt.resolved &&
      attempt.wrongGuesses === 1 &&
      phase === "playing"
    ) {
      const chosenH = attempt.incident.hypotheses.find(
        (h) => h.id === attempt.chosen,
      );
      if (chosenH && !chosenH.correct) {
        // If they just used their strike (first wrong), clear selection to allow retry.
        const t = setTimeout(() => {
          setAttempt((prev) => (prev ? { ...prev, chosen: null } : prev));
        }, 1600);
        return () => clearTimeout(t);
      }
    }
  }, [attempt?.chosen, attempt?.resolved, attempt?.wrongGuesses, phase]);

  const nextIncident = () => {
    // Commit the finished attempt to history
    if (attempt) {
      setAttempts((prev) => [...prev, attempt]);
    }
    setAttempt(null);
    if (index + 1 >= INCIDENTS.length) {
      setPhase("shift-over");
    } else {
      setIndex((i) => i + 1);
      setPhase("playing");
    }
  };

  const stats = useMemo<ShiftStats>(() => {
    const all = [...attempts];
    // include the current attempt if we're on scorecard
    if (phase === "shift-over" && attempt) all.push(attempt);
    const resolved = all.filter((a) => a.resolved).length;
    const firstTry = all.filter((a) => a.resolved && !a.strikeUsed).length;
    const expanded = all.reduce((s, a) => s + a.expanded.size, 0);
    const time = all.reduce((s, a) => s + a.timeSpent, 0);
    return {
      incidentsAttempted: all.length,
      incidentsResolved: resolved,
      totalTimeSpent: time,
      firstTryResolutions: firstTry,
      evidenceExpanded: expanded,
    };
  }, [attempts, phase, attempt]);

  return (
    <div
      ref={shellRef}
      className="ripple-shell fixed inset-0 z-50 overflow-y-auto"
    >
      <RippleBackdrop />

      {/* Top masthead */}
      <div className="ripple-masthead sticky top-0 z-40">
        <div className="page-shell flex h-16 items-center justify-between">
          <div className="ripple-ident flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-ink">
            <span className="ripple-live-dot" />
            <span>Ripple</span>
            <span className="text-muted">/</span>
            <span className="text-muted">Incident command</span>
          </div>

          {phase === "playing" && attempt && (
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted md:flex">
                <span>Incident</span>
                <span className="text-ink">
                  {index + 1} / {INCIDENTS.length}
                </span>
              </div>
              <TimerPill
                timeLeft={attempt.timeLeft}
                total={attempt.incident.seconds}
              />
              {attempt.strikeUsed && (
                <span className="hidden items-center gap-1.5 rounded-full border border-saffron/40 bg-saffron/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-saffron sm:flex">
                  <FaExclamationTriangle className="h-2.5 w-2.5" />
                  strike used
                </span>
              )}
            </div>
          )}

          <button
            onClick={onExit}
            className="ripple-exit flex items-center gap-2 px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-2 transition-all hover:text-ink"
          >
            <FaTimes className="h-2.5 w-2.5" />
            Leave
          </button>
        </div>
      </div>

      {/* Intro */}
      <AnimatePresence>
        {phase === "intro" && <Intro onStart={startShift} onExit={onExit} />}
      </AnimatePresence>

      {/* Playing */}
      {(phase === "playing" || phase === "resolved" || phase === "failed") &&
        attempt && (
          <IncidentView
            attempt={attempt}
            phase={phase}
            onExpand={expandEvidence}
            onHover={setHoverCluster}
            onSubmit={submitHypothesis}
            onNext={nextIncident}
            reducedMotion={reducedMotion}
          />
        )}

      {/* Shift over */}
      <AnimatePresence>
        {phase === "shift-over" && (
          <Scorecard stats={stats} onExit={onExit} onReplay={startShift} />
        )}
      </AnimatePresence>
    </div>
  );
}

function RippleBackdrop() {
  return (
    <div className="ripple-backdrop" aria-hidden="true">
      <div className="ripple-grid-plane" />
      <div className="ripple-core">
        <span />
      </div>
      <div className="ripple-orbit ripple-orbit-one" />
      <div className="ripple-orbit ripple-orbit-two" />
      <div className="ripple-signal-path">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

/* ─── Intro ──────────────────────────────────────────── */

function Intro({
  onStart,
  onExit,
}: {
  onStart: () => void;
  onExit: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") onStart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onStart]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="ripple-intro page-shell"
    >
      <div className="ripple-intro-copy">
        <div className="ripple-kicker flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
          Shift 01 · five live incidents
        </div>

        <h1 className="font-display leading-[0.92] text-ink">
          Debug the <span>fire</span>
          <small>before it spreads.</small>
        </h1>

        <p className="max-w-[54ch] text-[16px] leading-[1.65] text-ink-2">
          You are on-call. Read the production evidence, isolate the root cause,
          and resolve five incidents before their clocks run out.
        </p>

        <div className="ripple-intro-actions flex flex-wrap items-center gap-4">
          <button onClick={onStart} className="ripple-primary-action">
            <FaPlay className="h-3 w-3" />
            Start the shift
          </button>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
            Enter <span className="ripple-key">↵</span>
          </span>
          <button onClick={onExit} className="ripple-text-action">
            Return to portfolio
          </button>
        </div>
      </div>

      <div className="ripple-protocol" aria-label="How the game works">
        <header>
          <span>Response protocol</span>
          <small>Signal → decision → outcome</small>
        </header>
        <RuleCard
          n="01"
          title="Inspect"
          body="Open only the evidence you need. Every inspection costs two seconds."
        />
        <RuleCard
          n="02"
          title="Correlate"
          body="Separate related signals from harmless noise and deliberate red herrings."
        />
        <RuleCard
          n="03"
          title="Decide"
          body="File the root cause. A wrong call costs fifteen seconds; two close the incident."
        />
        <RuleCard
          n="04"
          title="Stabilize"
          body="Resolve all five incidents as severity escalates from P3 to SEV-1."
        />
      </div>
    </motion.div>
  );
}

function RuleCard({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="ripple-rule">
      <span>{n}</span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
}

/* ─── Timer pill ─────────────────────────────────────── */

function TimerPill({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = Math.max(0, Math.min(1, timeLeft / total));
  const danger = pct < 0.3;
  return (
    <div
      className={`ripple-timer flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] ${
        danger ? "is-danger" : ""
      }`}
    >
      <span className="relative block h-1.5 w-16 overflow-hidden rounded-full bg-rule">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: danger ? "#E86A2B" : "#4FB493" }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </span>
      <span className="tabular-nums">
        {String(Math.max(0, timeLeft)).padStart(2, "0")}s
      </span>
    </div>
  );
}

/* ─── Incident view ──────────────────────────────────── */

function IncidentView({
  attempt,
  phase,
  onExpand,
  onHover,
  onSubmit,
  onNext,
  reducedMotion,
}: {
  attempt: Attempt;
  phase: Phase;
  onExpand: (id: string) => void;
  onHover: (cluster: string | null) => void;
  onSubmit: (h: Hypothesis) => void;
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const {
    incident,
    expanded,
    hoverCluster,
    strikeUsed,
    chosen,
    resolved,
    timeLeft,
  } = attempt;
  const chosenH = chosen
    ? incident.hypotheses.find((h) => h.id === chosen) || null
    : null;
  const isDone = phase === "resolved" || phase === "failed";

  return (
    <div className="ripple-play page-shell py-8 md:py-12">
      {/* Incident header */}
      <div className="ripple-incident-banner p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
              <SeverityChip d={incident.difficulty} />
              <span className="text-ink">{incident.service}</span>
            </div>
            <h2 className="mt-3 font-display text-[26px] leading-[1.1] text-ink md:text-[32px]">
              <span className="text-saffron">
                <FaFire className="mr-2 inline h-4 w-4" />
              </span>
              {incident.title}
            </h2>
            <p className="mt-2 max-w-[64ch] text-[14.5px] leading-[1.55] text-ink-2">
              {incident.context}
            </p>
          </div>
        </div>
      </div>

      {/* Wrong-answer strike toast */}
      <AnimatePresence>
        {strikeUsed && !resolved && chosenH && !chosenH.correct && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="ripple-strike mt-4 px-4 py-3"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-saffron">
              <FaExclamationTriangle className="h-3 w-3" />
              Wrong path · −15s · one more chance
            </div>
            <div className="mt-1 text-[13.5px] text-ink-2">
              <span className="font-medium text-ink">Rejected: </span>
              {chosenH.postmortem}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="ripple-console mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Evidence grid */}
        <div className="ripple-evidence-grid grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {incident.evidence.map((ev) => (
            <EvidenceTile
              key={ev.id}
              ev={ev}
              expanded={expanded.has(ev.id)}
              onOpen={() => onExpand(ev.id)}
              onHover={(c) => onHover(c)}
              highlighted={!!hoverCluster && ev.cluster === hoverCluster}
              used={expanded.has(ev.id)}
            />
          ))}
        </div>

        {/* Side: log tail + hypothesis submit */}
        <div className="ripple-diagnosis flex flex-col gap-6">
          <LogTail />

          <div className="ripple-hypothesis p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
              <span>File a hypothesis</span>
              <span className="text-ink">
                {expanded.size}
                <span className="text-muted">
                  /{incident.evidence.length} read
                </span>
              </span>
            </div>
            <ul className="space-y-2">
              {incident.hypotheses.map((h) => {
                const isChosen = chosen === h.id;
                const revealed = isDone;
                const isCorrect = h.correct;
                return (
                  <li key={h.id}>
                    <button
                      onClick={() => !isDone && !chosen && onSubmit(h)}
                      disabled={isDone || !!chosen}
                      className={`ripple-hypothesis-option w-full px-3.5 py-2.5 text-left text-[13.5px] leading-[1.4] transition-all
                        ${
                          revealed && isCorrect
                            ? "border-seal bg-seal/10 text-ink"
                            : revealed && isChosen && !isCorrect
                              ? "border-saffron bg-saffron/10 text-ink"
                              : isChosen && !revealed
                                ? "border-saffron bg-saffron/10 text-ink"
                                : "text-ink-2 hover:text-ink"
                        }
                        ${isDone || chosen ? "cursor-default" : "cursor-pointer"}
                      `}
                    >
                      <div className="flex items-start gap-2">
                        {revealed && isCorrect && (
                          <FaCheck className="mt-0.5 h-3 w-3 text-seal" />
                        )}
                        {revealed && isChosen && !isCorrect && (
                          <FaTimes className="mt-0.5 h-3 w-3 text-saffron" />
                        )}
                        <span>{h.label}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* End-of-incident panel */}
      <AnimatePresence>
        {isDone && chosenH && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="ripple-outcome mt-8 overflow-hidden"
          >
            <div
              className={`ripple-result-bar flex items-center justify-between px-6 py-3 font-mono text-[10.5px] uppercase tracking-[0.24em] ${
                phase === "resolved" ? "is-resolved" : "is-escalated"
              }`}
            >
              <span className="flex items-center gap-2">
                {phase === "resolved" ? (
                  <>
                    <FaCheck className="h-3 w-3" /> Incident resolved
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle className="h-3 w-3" /> Incident
                    escalated
                  </>
                )}
              </span>
              <span>
                MTTR <span>{String(attempt.timeSpent).padStart(2, "0")}s</span>
              </span>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-start md:gap-10">
              <div>
                <div className="eyebrow mb-2">Postmortem</div>
                <p className="max-w-[64ch] text-[15px] leading-[1.65] text-ink-2">
                  {
                    (phase === "resolved"
                      ? incident.hypotheses.find((h) => h.correct)!
                      : incident.hypotheses.find((h) => h.correct)!
                    ).postmortem
                  }
                </p>
                <div className="mt-5 eyebrow mb-1">Fix shipped</div>
                <p className="max-w-[64ch] text-[14.5px] leading-[1.6] text-ink">
                  {incident.hypotheses.find((h) => h.correct)!.fix}
                </p>
              </div>
              <button
                onClick={onNext}
                className="ripple-primary-action self-start"
              >
                Next incident <FaArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SeverityChip({ d }: { d: Incident["difficulty"] }) {
  const map: Record<string, string> = {
    P3: "text-muted border-rule",
    P2: "text-ink border-rule",
    P1: "text-saffron border-saffron/40 bg-saffron/10",
    "SEV-2": "text-saffron border-saffron/40 bg-saffron/10",
    "SEV-1": "text-paper bg-ink border-ink",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.24em] ${map[d]}`}
    >
      {d}
    </span>
  );
}

/* ─── Scorecard ──────────────────────────────────────── */

function Scorecard({
  stats,
  onExit,
  onReplay,
}: {
  stats: ShiftStats;
  onExit: () => void;
  onReplay: () => void;
}) {
  const passRate = stats.incidentsAttempted
    ? (stats.incidentsResolved / stats.incidentsAttempted) * 100
    : 0;

  const grade =
    passRate === 100 && stats.firstTryResolutions === stats.incidentsResolved
      ? "Staff-worthy"
      : passRate === 100
        ? "Solid on-call"
        : passRate >= 60
          ? "Kept the fire small"
          : passRate >= 40
            ? "Rough shift"
            : "Rough night";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ripple-scorecard page-shell"
    >
      <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
        End of shift
      </div>
      <h2
        className="mt-4 font-display leading-[0.95] text-ink"
        style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
      >
        {grade}
        <span className="text-saffron">.</span>
      </h2>

      <div className="ripple-stats mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <Stat
          n={`${String(stats.incidentsResolved).padStart(2, "0")}/${String(stats.incidentsAttempted).padStart(2, "0")}`}
          k="Resolved"
        />
        <Stat n={`${passRate.toFixed(0)}%`} k="Pass rate" />
        <Stat
          n={String(stats.firstTryResolutions).padStart(2, "0")}
          k="First try"
        />
        <Stat
          n={`${Math.round(stats.totalTimeSpent / Math.max(1, stats.incidentsAttempted))}s`}
          k="Avg MTTR"
        />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button onClick={onReplay} className="ripple-primary-action">
          Play the shift again
        </button>
        <button onClick={onExit} className="ripple-secondary-action">
          Return to portfolio
        </button>
      </div>

      <p className="mt-10 max-w-[54ch] font-body text-[14.5px] leading-[1.65] text-ink-2">
        Every incident here is a shape you have probably seen in production: a
        silent deploy, a flaky test spike, a route-attribution drift, a weekly
        job that dies at 3am, a rollout stuck at 20%. Resolving them is what a
        senior engineer's day-to-day actually looks like.
      </p>
    </motion.div>
  );
}

function Stat({ n, k }: { n: string; k: string }) {
  return (
    <div className="ripple-stat p-5">
      <div className="eyebrow mb-2">{k}</div>
      <div className="font-display text-3xl italic text-ink">{n}</div>
    </div>
  );
}
