"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import CodexCanvas from "./CodexCanvas";
import { LANDMARKS } from "./landmarks";
import type { Landmark } from "./types";

interface Props {
  onExit: () => void;
}

export default function CodexShell({ onExit }: Props) {
  const [read, setRead] = useState<Set<string>>(new Set());
  const [nearId, setNearId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);

  // Load session progress
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("codex-read");
      if (raw) setRead(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  // Persist progress
  useEffect(() => {
    try {
      sessionStorage.setItem("codex-read", JSON.stringify(Array.from(read)));
    } catch {}
  }, [read]);

  const openLm = openId ? LANDMARKS.find((l) => l.id === openId) || null : null;
  const nearLm = nearId ? LANDMARKS.find((l) => l.id === nearId) || null : null;

  const handleEnter = (id: string) => {
    setOpenId(id);
    setRead((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const closeCard = () => setOpenId(null);

  // ESC handling — closes card first, then exits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showIntro) setShowIntro(false);
        else if (openId) closeCard();
        else onExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, showIntro, onExit]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-paper">
      {/* World */}
      <CodexCanvas
        read={read}
        onNear={setNearId}
        onEnter={handleEnter}
        reduced={reduced}
      />

      {/* Editorial masthead */}
      <Masthead readCount={read.size} onExit={onExit} />

      {/* Journal — bottom left, shows chapters read */}
      <Journal read={read} />

      {/* Approach hint — bottom center */}
      <ApproachHint nearLm={nearLm} />

      {/* Intro invitation */}
      <AnimatePresence>
        {showIntro && <Intro onBegin={() => setShowIntro(false)} onExit={onExit} />}
      </AnimatePresence>

      {/* Artifact modal */}
      <AnimatePresence>
        {openLm && <ArtifactModal lm={openLm} onClose={closeCard} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── Masthead ────────────────────────────────────────── */

function Masthead({ readCount, onExit }: { readCount: number; onExit: () => void }) {
  return (
    <>
      <div className="pointer-events-none fixed left-1/2 top-4 z-40 -translate-x-1/2">
        <div className="rounded-full border border-rule bg-paper/85 px-5 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-ink-2">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron animate-pulse" />
            <span>The Codex</span>
            <span className="text-muted">·</span>
            <span className="text-muted">An interactive reading</span>
          </div>
        </div>
      </div>

      <div className="fixed right-4 top-4 z-40 flex items-center gap-2">
        <div className="rounded-full border border-rule bg-paper/85 px-4 py-2 backdrop-blur-sm">
          <div className="flex items-baseline gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
            <span>Chapters</span>
            <span className="text-ink">
              {String(readCount).padStart(2, "0")}
              <span className="text-muted"> / 06</span>
            </span>
          </div>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-2 rounded-full border border-rule bg-paper/85 px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-2 backdrop-blur-sm transition-all hover:border-ink hover:text-ink"
        >
          <FaTimes className="h-2.5 w-2.5" />
          Leave
        </button>
      </div>
    </>
  );
}

/* ─── Journal (bottom-left) ───────────────────────────── */

function Journal({ read }: { read: Set<string> }) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40">
      <div className="rounded-2xl border border-rule bg-paper/90 p-3 backdrop-blur-sm">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          The Journal
        </div>
        <ul className="space-y-1.5">
          {LANDMARKS.map((lm) => {
            const isRead = read.has(lm.id);
            return (
              <li
                key={lm.id}
                className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em]"
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    isRead ? "bg-saffron" : "border border-rule"
                  }`}
                />
                <span className={isRead ? "text-ink" : "text-muted line-through decoration-rule"}>
                  {lm.chapter} {lm.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ─── Approach hint (bottom center) ───────────────────── */

function ApproachHint({ nearLm }: { nearLm: Landmark | null }) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <AnimatePresence>
        {nearLm ? (
          <motion.div
            key="near"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="rounded-full border border-ink bg-ink px-5 py-2.5 text-paper shadow-lg"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span className="text-saffron">{nearLm.chapter}</span>
              <span className="font-display italic normal-case tracking-normal text-[14px]">
                {nearLm.name}
              </span>
              <span className="text-paper/50">·</span>
              <span className="text-paper/70">Press</span>
              <span className="kbd bg-paper/10 border-paper/20 text-paper">Enter</span>
              <span className="text-paper/70">to read</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-full border border-rule bg-paper/85 px-5 py-2 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
              <span>Walk</span>
              <span className="kbd">W</span>
              <span className="kbd">A</span>
              <span className="kbd">S</span>
              <span className="kbd">D</span>
              <span className="text-rule">·</span>
              <span>or click the map</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Intro invitation ────────────────────────────────── */

function Intro({ onBegin, onExit }: { onBegin: () => void; onExit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 w-[min(560px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-rule bg-paper shadow-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(232,106,43,0.14), transparent 55%), radial-gradient(circle at 100% 100%, rgba(39,88,74,0.10), transparent 55%)",
        }}
      >
        <span className="pointer-events-none absolute left-4 top-4 h-5 w-5 border-l border-t border-ink/30" />
        <span className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r border-t border-ink/30" />
        <span className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b border-l border-ink/30" />
        <span className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 border-b border-r border-ink/30" />

        <div className="px-8 py-10 md:px-12 md:py-12">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
            An interlude
          </div>

          <h2 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] italic leading-[0.95] text-ink">
            The <span className="text-saffron">Codex</span><span className="text-ink">.</span>
          </h2>

          <p className="mt-5 max-w-[46ch] font-body text-[15px] leading-[1.65] text-ink-2">
            The portfolio, rendered as a small isometric world. Six landmarks — one
            per chapter of the notebook. Walk up to any of them to open its page.
            Everything you find here is real: real numbers, real work, real writing.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-6 md:grid-cols-3">
            <ControlRow keys={["W", "A", "S", "D"]} label="Walk" />
            <ControlRow keys={["↑", "←", "↓", "→"]} label="Same, arrows" />
            <ControlRow keys={["Click"]} label="Tap-to-move" />
            <ControlRow keys={["↵"]} label="Read a landmark" />
            <ControlRow keys={["Esc"]} label="Close · leave" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button onClick={onBegin} className="btn-primary">
              Begin the walk <FaArrowRight className="h-3 w-3" />
            </button>
            <button
              onClick={onExit}
              className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
            >
              Back to the notebook
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ControlRow({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {keys.map((k) => (
          <span key={k} className="kbd">
            {k}
          </span>
        ))}
      </div>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
    </div>
  );
}

/* ─── Artifact modal ─────────────────────────────────── */

function ArtifactModal({ lm, onClose }: { lm: Landmark; onClose: () => void }) {
  const { card } = lm;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" />
      <motion.div
        role="dialog"
        aria-label={card.title}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-rule bg-paper shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
      >
        {/* header ribbon */}
        <div
          className="flex items-center justify-between border-b border-rule px-6 py-3"
          style={{ background: `${card.accent || "#E86A2B"}18` }}
        >
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.24em] text-ink">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: card.accent || "#E86A2B" }}
            />
            {card.eyebrow}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink hover:text-ink"
          >
            <FaTimes className="h-3 w-3" />
          </button>
        </div>

        <div className="px-6 py-8 md:px-10 md:py-10">
          <h2 className="font-display text-4xl italic leading-[1.02] text-ink md:text-5xl">
            {card.title}<span className="text-saffron">.</span>
          </h2>
          <p className="mt-5 max-w-[54ch] text-[15.5px] leading-[1.65] text-ink-2">
            {card.body}
          </p>

          {card.artifacts && card.artifacts.length > 0 && (
            <ul className="mt-8 divide-y divide-rule border-y border-rule">
              {card.artifacts.map((a) => (
                <li key={a.label} className="grid grid-cols-[140px_1fr] gap-4 py-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
                    {a.label}
                  </span>
                  <span className="text-[14.5px] leading-[1.55] text-ink">
                    {a.value}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {card.cta && (
            <div className="mt-8 flex items-center gap-3">
              <a
                href={card.cta.href}
                target={card.cta.external ? "_blank" : undefined}
                rel={card.cta.external ? "noopener noreferrer" : undefined}
                className="btn-primary"
              >
                {card.cta.label} <FaArrowRight className="h-3 w-3" />
              </a>
              <button
                onClick={onClose}
                className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
              >
                Keep walking
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
