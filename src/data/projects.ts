import { FaGithub, FaExternalLinkAlt, FaNpm, FaGoogle } from "react-icons/fa";
import { StaticImageData } from "next/image";
import i18nifyImg from "../assets/images/portfolio-logo.png";
import compliqImg from "../assets/images/compliq-logo.png";
import dominatorImg from "../assets/images/dominator-logo.png";
import reRouteImg from "../assets/images/reroute-logo.png";

export interface ProjectLink {
  label: string;
  href: string;
  icon: typeof FaGithub | typeof FaExternalLinkAlt | typeof FaNpm;
}

export interface Project {
  title: string;
  description: string;
  image: string | StaticImageData;
  technologies: string[];
  links: ProjectLink[];
  stats?: string;
}

export const projects: Project[] = [
  {
    title: "i18nify-js",
    description:
      "Open-source JavaScript, React, and Go internationalization monorepo with automated testing, modular documentation, and 100,000+ weekly npm downloads.",
    image: i18nifyImg,
    technologies: ["JavaScript", "Rollup"],
    links: [
      {
        label: "npm",
        href: "https://www.npmjs.com/package/@razorpay/i18nify-js",
        icon: FaNpm,
      },
      {
        label: "GitHub",
        href: "https://github.com/razorpay/i18nify",
        icon: FaGithub,
      },
    ],
    stats: "100K+ weekly downloads",
  },
  {
    title: "CompliQ - Accessibility Simulator",
    description:
      "Simulate accessibility issues like color-blindness, keyboard navigation, and screen readers to build inclusive web experiences. A powerful Chrome extension that helps developers and designers visualize and test web accessibility issues in real-time.",
    image: compliqImg,
    technologies: ["JavaScript"],
    links: [
      {
        label: "Extension",
        href: "https://chromewebstore.google.com/detail/compliq-accessibility-sim/gjimcjigkhkbnhdfcbbdchoelfffdakl",
        icon: FaGoogle,
      },
      {
        label: "GitHub",
        href: "https://github.com/RgnDunes/CompliQ-Extension",
        icon: FaGithub,
      },
    ],
    stats: "N/A",
  },
  {
    title: "DOMinator",
    description:
      "DOMinator is a powerful Chrome extension designed for web developers that transforms how you interact with and analyze the Document Object Model (DOM). This developer tool provides an intuitive interface for visualizing, navigating, and modifying webpage structures with advanced features like AI-powered explanations and suggestions.",
    image: dominatorImg,
    technologies: ["JavaScript"],
    links: [
      {
        label: "Extension",
        href: "https://chromewebstore.google.com/detail/dominator/oiiapedghomjfbefgbdaflgjpafeamda",
        icon: FaGoogle,
      },
      {
        label: "GitHub",
        href: "https://github.com/RgnDunes/DOMinator",
        icon: FaGithub,
      },
    ],
    stats: "N/A",
  },
  {
    title: "ReRoute",
    description:
      "A modern Chrome Extension that allows you to define URL redirect rules and automatically apply them when matching URLs are visited.",
    image: reRouteImg,
    technologies: ["JavaScript"],
    links: [
      {
        label: "Extension",
        href: "https://chromewebstore.google.com/detail/reroute/kcacpjogbigeelajjnmdpellcjjkpmbg",
        icon: FaGoogle,
      },
      {
        label: "GitHub",
        href: "https://github.com/RgnDunes/ReRoute",
        icon: FaGithub,
      },
    ],
    stats: "N/A",
  },
];
