import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { SITE, SITE_URL, absoluteUrl, withBasePath } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Playfair Display", "Georgia", "serif"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.siteName,
  authors: [{ name: SITE.author.name, url: SITE.author.url }],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  category: "technology",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: `${SITE.name} — RSS Feed` },
      ],
    },
  },
  robots: {
    // index/follow default to true — only override googleBot for the
    // enhanced-preview signals which are non-default.
    googleBot: {
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.siteName,
    locale: SITE.locale,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogDefault,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter.site,
    creator: SITE.twitter.creator,
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogDefault],
  },
  icons: {
    icon: [
      { url: withBasePath("/favicon.ico"), sizes: "any" },
      { url: withBasePath("/icon.png"), type: "image/png", sizes: "32x32" },
    ],
    shortcut: [{ url: withBasePath("/favicon.ico") }],
    apple: [
      {
        url: withBasePath("/apple-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: withBasePath("/manifest.json"),
  // Search-engine ownership tokens — populated when Search Console
  // sends them. Blank strings are ignored by Next.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F0E7" },
    { media: "(prefers-color-scheme: dark)", color: "#141416" },
  ],
};

function siteJsonLd() {
  const websiteId = `${SITE_URL}#website`;
  const personId = `${SITE_URL}#person`;
  const orgId = `${SITE_URL}#publisher`;
  const logoImage = {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon.png`,
    width: 512,
    height: 512,
  };
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL,
      name: SITE.siteName,
      inLanguage: SITE.language,
      description: SITE.description,
      publisher: { "@id": orgId },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": orgId,
      name: SITE.siteName,
      url: SITE_URL,
      logo: logoImage,
      founder: { "@id": personId },
      sameAs: SITE.author.sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      name: SITE.author.name,
      alternateName: SITE.author.handle,
      url: SITE_URL,
      image: {
        "@type": "ImageObject",
        url: SITE.author.image,
        width: 1200,
        height: 630,
      },
      email: `mailto:${SITE.author.email}`,
      jobTitle: SITE.author.jobTitle,
      worksFor: { "@type": "Organization", name: SITE.author.worksFor },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressCountry: "IN",
      },
      knowsAbout: SITE.keywords,
      sameAs: SITE.author.sameAs,
    },
  ];
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = siteJsonLd();
  return (
    <html
      lang={SITE.language}
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://api.counterapi.dev" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.counterapi.dev" />
      </head>
      <body className="bg-paper text-ink-2 antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
