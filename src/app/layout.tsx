import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Playfair Display", "Georgia", "serif"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  title: "Divyansh Singh - Software Engineer",
  description:
    "The working notebook of Divyansh Singh, a software engineer building web infrastructure, developer tooling, and CI/CD systems at Rippling. Previously Razorpay.",
  keywords: [
    "Divyansh Singh",
    "Software Engineer",
    "Frontend Engineer",
    "Web Infrastructure",
    "Developer Tooling",
    "CI/CD",
    "React",
    "TypeScript",
    "Rippling",
    "Razorpay",
  ],
  authors: [{ name: "Divyansh Singh" }],
  openGraph: {
    title: "Divyansh Singh - Software Engineer",
    description:
      "Web infrastructure, CI/CD, and developer tooling. A working notebook.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="shortcut icon"
          href="/Portfolio-v5/favicon.ico"
          type="image/x-icon"
        />
        <link rel="icon" href="/Portfolio-v5/favicon.ico" type="image/x-icon" />
      </head>
      <body className="bg-paper text-ink-2 antialiased">{children}</body>
    </html>
  );
}
