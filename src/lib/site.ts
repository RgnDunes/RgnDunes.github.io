/**
 * Single source of truth for site-wide URLs / identity used by
 * metadata, sitemap, robots, JSON-LD, RSS, OG images.
 */

const isProd = process.env.NODE_ENV === "production";

export const BASE_PATH = isProd ? "/Portfolio-v5" : "";
export const SITE_ORIGIN = "https://rgndunes.github.io";
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export const SITE = {
  name: "Divyansh Singh",
  shortName: "Divyansh Singh",
  role: "Software Engineer II",
  title: "Divyansh Singh — Software Engineer II at Rippling",
  description:
    "Working notebook of Divyansh Singh — Software Engineer II at Rippling, building frontend infrastructure, developer tooling, and CI/CD systems.",
  keywords: [
    "Divyansh Singh",
    "rgndunes",
    "Software Engineer",
    "Senior Frontend Engineer",
    "Rippling",
    "Razorpay",
    "Web Infrastructure",
    "CI/CD",
    "Developer Tooling",
    "React",
    "TypeScript",
    "Node.js",
  ],
  locale: "en_US",
  language: "en",
  siteName: "Divyansh Singh — Notebook",
  author: {
    name: "Divyansh Singh",
    handle: "rgndunes",
    email: "rgndunes@gmail.com",
    url: SITE_URL,
    image: `${SITE_URL}/og-default.png`,
    location: "Bengaluru, India",
    jobTitle: "Software Engineer II",
    worksFor: "Rippling",
    sameAs: [
      "https://github.com/RgnDunes",
      "https://www.linkedin.com/in/rgndunes/",
      "https://x.com/rgndunes",
      "https://www.youtube.com/@rgndunes",
    ],
  },
  ogDefault: `${SITE_URL}/og-default.png`,
  twitter: {
    site: "@rgndunes",
    creator: "@rgndunes",
  },
};

export function absoluteUrl(pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${clean}`;
}

export function withBasePath(pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${BASE_PATH}${clean}`;
}
