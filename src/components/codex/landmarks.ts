import type { Landmark } from "./types";

/**
 * The six chapters of the Codex, positioned on a ~30×20 tile grid.
 * Each card carries REAL portfolio data — no invented stats.
 */
export const LANDMARKS: Landmark[] = [
  {
    id: "about",
    name: "The Well",
    chapter: "i.",
    tile: { x: 14, y: 10 },
    kind: "well",
    accent: "#27584A",
    card: {
      eyebrow: "i. About",
      title: "A note from the desk",
      body:
        "Divyansh Singh — software engineer building the plumbing of the modern web. Rippling (L6, Web Infrastructure) after four years at Razorpay. Bengaluru, IN. This is the writer of the notebook you are walking through.",
      artifacts: [
        { label: "Education", value: "B.Tech CS · KIIT · CGPA 9.65" },
        { label: "Currently", value: "Rippling · L6 · Web Infrastructure" },
        { label: "Elsewhere", value: "@rgndunes · GitHub · LinkedIn" },
      ],
      cta: { label: "Read the full note", href: "/#about" },
    },
  },
  {
    id: "rippling",
    name: "The Monolith",
    chapter: "ii.",
    tile: { x: 6, y: 5 },
    kind: "monolith",
    accent: "#E86A2B",
    card: {
      eyebrow: "ii. Rippling · L6",
      title: "Web Infrastructure",
      body:
        "CI/CD pipelines, developer tooling, E2E observability, deployment infrastructure. Every commit at Rippling passes through code I have shaped.",
      artifacts: [
        { label: "Auth migration", value: "Package tokens → AWS Secrets Manager, zero developer downtime" },
        { label: "Flakiness Detection", value: "Statistical scoring across N runs, Datadog HTML dashboards" },
        { label: "Route attribution", value: "String match → object-based query compare (order-independent)" },
        { label: "On-call analytics", value: "Stateless ETL via Buildkite + Slack API (weekly)" },
      ],
      cta: { label: "Read the achievements", href: "/#work" },
    },
  },
  {
    id: "razorpay",
    name: "The Arch",
    chapter: "iii.",
    tile: { x: 21, y: 5 },
    kind: "arch",
    accent: "#0F4C81",
    card: {
      eyebrow: "iii. Razorpay · Senior FE",
      title: "International expansion",
      body:
        "Led the frontend charter for Razorpay's push into Malaysia and Singapore, then shipped Mastercard Biometric Authentication and open-sourced i18nify-js.",
      artifacts: [
        { label: "MY/SG onboarding", value: "530 merchants · 80M MYR monthly GMV" },
        { label: "Biometric Auth", value: "35% higher success vs 3DS OTP · demoed at GFF 2024" },
        { label: "Micro-frontend migration", value: "Build time −67% · unit tests −67% · E2E −70%" },
        { label: "Awards", value: "Esprit De Corps × 2 · Winner of the Week" },
      ],
      cta: { label: "Read the achievements", href: "/#work" },
    },
  },
  {
    id: "i18nify",
    name: "The Obelisk",
    chapter: "iv.",
    tile: { x: 4, y: 15 },
    kind: "obelisk",
    accent: "#E86A2B",
    card: {
      eyebrow: "iv. Featured · Open Source",
      title: "@razorpay/i18nify-js",
      body:
        "An SDK for locale-based formatting, translations, and region-aware UI rendering. Adopted by 27+ teams inside Razorpay before it was open-sourced.",
      artifacts: [
        { label: "npm", value: "100K+ weekly downloads" },
        { label: "Bundling", value: "Rollup migration cut bundle size by 30%" },
        { label: "Adoption", value: "27+ internal teams · 19+ product surfaces" },
        { label: "Repo", value: "razorpay/i18nify" },
      ],
      cta: {
        label: "View on npm",
        href: "https://www.npmjs.com/package/@razorpay/i18nify-js",
        external: true,
      },
    },
  },
  {
    id: "blog",
    name: "The Library",
    chapter: "v.",
    tile: { x: 25, y: 15 },
    kind: "library",
    accent: "#5A3A6E",
    card: {
      eyebrow: "v. Writing",
      title: "Engineering Diaries",
      body:
        "Long-form essays on frontend architecture, system design, and the small unglamorous rituals of shipping software at scale. New entries every few weeks.",
      artifacts: [
        { label: "Topics", value: "Frontend Infrastructure · React · Tooling · Performance" },
        { label: "Cadence", value: "Weekly-ish · deep dives, not tutorials" },
        { label: "Recent", value: "AI model paralysis · npm supply chain · React 19 Actions" },
      ],
      cta: { label: "Open the notebook", href: "/blog" },
    },
  },
  {
    id: "contact",
    name: "The Gateway",
    chapter: "vi.",
    tile: { x: 14, y: 17 },
    kind: "gateway",
    accent: "#141416",
    card: {
      eyebrow: "vi. Contact",
      title: "Say hello",
      body:
        "The quickest way to reach me is email. LinkedIn is the second quickest. I answer both, sometimes even quickly. Open to interesting problems, thoughtful teams, and long walks in the debugger.",
      artifacts: [
        { label: "Email", value: "rgndunes@gmail.com" },
        { label: "LinkedIn", value: "/in/rgndunes" },
        { label: "GitHub", value: "@RgnDunes" },
      ],
      cta: { label: "Write a letter", href: "mailto:rgndunes@gmail.com", external: true },
    },
  },
];

/** World size in tiles. */
export const WORLD = { w: 30, h: 22 };
/** Tile size in pixels. */
export const TILE = 44;
/** Where the reader starts, in tiles. */
export const START: { x: number; y: number } = { x: 14, y: 12 };
/** How close (in tiles) you need to be to open a landmark. */
export const READ_RADIUS = 1.8;
