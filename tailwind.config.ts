import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        display: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        mono: [
          "var(--font-jetbrains)",
          "JetBrains Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        "paper-2": "rgb(var(--paper-2) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-2": "rgb(var(--ink-2) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        saffron: "rgb(var(--saffron) / <alpha-value>)",
        "saffron-deep": "rgb(var(--saffron-deep) / <alpha-value>)",
        seal: "rgb(var(--seal) / <alpha-value>)",
        highlight: "rgb(var(--highlight) / <alpha-value>)",
        // shadcn compat (kept)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "32px",
      },
      fontSize: {
        "display-1": ["clamp(3.5rem, 10vw, 8.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-2": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-3": ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
