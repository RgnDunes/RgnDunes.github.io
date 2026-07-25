export interface Vec2 {
  x: number;
  y: number;
}

/** Semantic types of landmarks — controls the illustration used on the map. */
export type LandmarkKind =
  | "monolith"    // large stone pillar — Rippling
  | "arch"        // triumphal arch — Razorpay
  | "obelisk"     // slim pillar — i18nify
  | "library"     // domed hut — Blog
  | "gateway"     // torii gate — Contact
  | "well";       // circular well — About

export interface Landmark {
  id: string;
  /** Fraunces italic display name. */
  name: string;
  /** Section number shown in the editorial style. */
  chapter: string;
  /** World coordinates in tiles (not pixels). */
  tile: Vec2;
  kind: LandmarkKind;
  /** Accent color for the ring, base, and card ribbon. */
  accent?: string;
  /** The card that opens when the reader reaches this landmark. */
  card: LandmarkCard;
}

export interface LandmarkCard {
  eyebrow: string;
  title: string;
  /** Prose paragraph in the site voice. */
  body: string;
  /** Optional bullet artifacts — pulled from real data. */
  artifacts?: { label: string; value: string }[];
  /** Optional deep-link into the main site. */
  cta?: { label: string; href: string; external?: boolean };
  /** Accent color for the card and the landmark base. */
  accent?: string;
}
