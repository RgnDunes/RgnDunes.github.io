import { FaExternalLinkAlt } from "react-icons/fa";
import { StaticImageData } from "next/image";
import jsBookImg from "../assets/images/digital-products/javascript-book.jpg";
import hldBookImg from "../assets/images/digital-products/hld-book.png";
import cssUnmaskedBookImg from "../assets/images/digital-products/css-unmasked-book.png";

export interface Product {
  title: string;
  type: string;
  description: string;
  image?: string | StaticImageData;
  link: string;
  stats: string;
  techStack: string[];
}

export const products: Product[] = [
  {
    title: "Full Spectrum JavaScript",
    type: "Ebook",
    description: `This book is for:
        • Absolute Beginners who have little to no prior programming experience and want to learn JavaScript as their first programming language.
        • Aspiring Frontend Developers who want to understand JavaScript's role in web development and master the skills needed to build modern, interactive websites.
        • Backend Developers who want to expand their expertise into JavaScript and Node.js for full-stack development.
        • Intermediate Developers who want to fill in the gaps in their knowledge, dive deeper into JavaScript's advanced features, and improve their coding techniques.
        No matter where you are in your coding journey, this book has something to offer.`,
    image: jsBookImg,
    link: "https://rgndunes.gumroad.com/l/full-spectrum-javascript",
    stats: "200+ copies sold",
    techStack: ["JavaScript", "Web Development", "Programming"],
  },
  {
    title: "CSS Unmasked -- Styling Secrets They Never Told You",
    type: "Ebook",
    description: `This book is for:
        • Curious Beginners who have dabbled with HTML and want to finally understand how CSS actually works  - without copy-pasting random snippets.
        • Junior Developers who are tired of fighting with layout bugs, specificity wars, and mystery margins that won't behave.
        • Frontend Engineers who want to go beyond the basics and learn how to write scalable, performant, and maintainable CSS at a professional level.
        • Designers transitioning into code who want a fun, visual, and practical way to master the styling layer of the web.
        • Senior Developers who secretly Google “how to center a div” and want to confidently teach or lead CSS decisions on large teams.`,
    image: cssUnmaskedBookImg,
    link: "https://rgndunes.gumroad.com/l/css-unmasked",
    stats: "50+ copies sold",
    techStack: [
      "JavaScript",
      "Web Development",
      "Programming",
      "CSS",
      "Frontend",
    ],
  },
  {
    title: "Frontend System Design Decoded",
    type: "Ebook",
    description: `How do apps like Twitter, Google Maps, or GitHub handle millions of users, deliver blazing-fast experiences, and stay reliable at scale?

        Welcome to "Frontend System Design Decoded"  - a practical guide that unpacks the hidden architecture and design decisions behind the world’s most complex web platforms.

        • Dive deep into the frontend system design of apps like Twitter, Google Maps, GitHub, Confluence, OneDrive and more  
        • Learn the trade-offs that make these platforms scalable, performant, and resilient  
        • Explore patterns around rendering, caching, state management, data flows, and global user experience  
        • Designed for frontend engineers preparing for system design interviews  
        • A great resource for developers who want to move from building features to understanding systems  
        • Packed with practical breakdowns, diagrams, and insights you won’t find in tutorials`,
    image: hldBookImg,
    link: "https://rgndunes.gumroad.com/l/frontend-system-design-decoded",
    stats: "70+ copies sold",
    techStack: ["System Design", "Frontend", "HLD"],
  },
];
