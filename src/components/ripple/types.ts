/**
 * Ripple - a debugging deduction game.
 * Each incident presents evidence across 4 lanes: charts, logs, PRs,
 * alerts. Some evidence is signal, some is noise. The player has to
 * click the right pieces (each click costs seconds), then submit a
 * hypothesis pointing at the correct root cause.
 */

export type EvidenceKind = "chart" | "log" | "pr" | "alert";

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  /** Short label shown in the tile ("error rate p95"). */
  label: string;
  /** Longer description shown when expanded. */
  detail: string;
  /**
   * A signal weight: how much this evidence points at the truth.
   *   +2 = smoking gun for the correct cause
   *   +1 = supportive
   *    0 = neutral / noise
   *   -1 = misleading (looks damning but isn't)
   */
  weight: number;
  /**
   * Chart-only. Series of numbers 0..1 for a mini sparkline.
   * Values > 0.8 are visually red-tinted.
   */
  series?: number[];
  /** Chart-only. Whether the anomaly is visually a spike or a flatline. */
  anomaly?: "spike" | "flatline" | "creep" | "normal";
  /** Log-only. Timestamp (fake, mm:ss). */
  ts?: string;
  /** PR-only. Author + branch. */
  pr?: { title: string; author: string; branch: string; number: number };
  /** Which "correlation cluster" this belongs to - hovering any evidence
   *  in the cluster highlights the others (visual guide). */
  cluster?: string;
}

export interface Hypothesis {
  id: string;
  label: string;
  /** Descriptive text of what fix this implies. */
  fix: string;
  /** True if this is the correct root cause. */
  correct: boolean;
  /** Only revealed after submission. */
  postmortem: string;
}

export interface Incident {
  id: string;
  /** Short PagerDuty-style headline. */
  title: string;
  /** The service that is on fire. */
  service: string;
  /** Sub-line context. */
  context: string;
  /** Time budget in seconds. */
  seconds: number;
  /** Editorial difficulty label. */
  difficulty: "P3" | "P2" | "P1" | "SEV-2" | "SEV-1";
  /** All evidence for this incident. */
  evidence: Evidence[];
  /** Possible root causes - one is correct. */
  hypotheses: Hypothesis[];
}

export interface ShiftStats {
  incidentsAttempted: number;
  incidentsResolved: number;
  totalTimeSpent: number;
  firstTryResolutions: number;
  evidenceExpanded: number;
}
