import { FaMedium, FaDev, FaBookmark, FaLinkedin } from "react-icons/fa";

export interface Article {
  title: string;
  type: string;
  description: string;
  link: string;
  icon: typeof FaMedium | typeof FaDev;
  date: string;
  stats: string;
}

export const articles: Article[] = [
  {
    title: "What \"Zero Bundle Size\" Frameworks Actually Cost in Developer Experience",
    type: "Performance",
    description:
      "The pitch is very attractive: ship no JavaScript, score 100 on Lighthouse. But the developer experience of working with Qwik, Astro Islands, and their cousins is a different story altogether.",
    link: "/blog/zero-bundle-size-dx-cost_article.html",
    icon: FaBookmark,
    date: "May 2025",
    stats: "Blog",
  },
  {
    title: "Rollup Is Not Just for Libraries Anymore",
    type: "Tooling",
    description:
      "For years we quietly assumed Rollup was the library bundler and Webpack was the application bundler. That line has blurred considerably. Here is why Rollup deserves a second look for your next production application.",
    link: "/blog/rollup_article.html",
    icon: FaBookmark,
    date: "April 2025",
    stats: "Blog",
  },
  {
    title: "React 19 Actions Are Not a State Management Solution",
    type: "React",
    description:
      "The new Actions API is a solid improvement for handling async mutations and form submissions. But teams are already reaching for it as a Zustand or Redux replacement, and that's a category error that will bite them at scale.",
    link: "/blog/react19_actions_article.html",
    icon: FaBookmark,
    date: "April 2025",
    stats: "Blog",
  },
  {
    title: "No Isolation in npm Workspaces, And Why That Matters",
    type: "Tooling",
    description:
      "npm workspaces make monorepo dependency management feel very convenient, but they deliberately share a single node_modules tree across every package. This design has consequences that quietly break reproducibility.",
    link: "/blog/npm_workspaces_isolation.html",
    icon: FaBookmark,
    date: "April 2025",
    stats: "Blog",
  },
  {
    title: "npm Supply Chain Attacks: What Actually Happens Inside Your Registry",
    type: "Security & Testing",
    description:
      "A proper look at how attackers get into your dependency tree, what they do once they are in, and why your lockfile alone is not going to save you.",
    link: "/blog/npm_supply_chain_attacks.html",
    icon: FaBookmark,
    date: "April 2025",
    stats: "Blog",
  },
  {
    title: "Frontend Observability is Not a Backend Problem",
    type: "Performance",
    description:
      "Your servers are green. Your APIs are healthy. Your dashboards look perfectly fine. And somewhere out there, a real user is staring at a blank white screen. Here is why that gap exists, and what you can actually do about it.",
    link: "/blog/frontend_observability_article.html",
    icon: FaBookmark,
    date: "April 2025",
    stats: "Blog",
  },
  {
    title: "The Death of the Traditional CI/CD Pipeline",
    type: "Tooling",
    description:
      "How AI-assisted deployments, platform engineering, and a new generation of tooling are dismantling the pipeline model we've relied on for a decade, and what actually comes next.",
    link: "/blog/cicd_pipeline_article.html",
    icon: FaBookmark,
    date: "April 2025",
    stats: "Blog",
  },
  {
    title: "Buildkite vs GitHub Actions: A Web Infrastructure Engineer's Honest Take",
    type: "Tooling",
    description:
      "I have spent the better part of two years running both of these in production across teams of different shapes and sizes. Here is everything I wish someone had told me before I started forming opinions.",
    link: "/blog/buildkite_vs_github_actions.html",
    icon: FaBookmark,
    date: "April 2025",
    stats: "Blog",
  },
  {
    title: "AI Code Review Is Making Your Codebase Harder to Maintain",
    type: "Best Practices",
    description:
      "Everyone is merging faster, the PR backlog is clean, and the dashboards look very good. So why does opening a module from eight months ago feel like reading someone else's fever dream?",
    link: "/blog/ai_code_review_article.html",
    icon: FaBookmark,
    date: "April 2025",
    stats: "Blog",
  },
  {
    title: "I Let Claude & GPT-4 Play My Board Game Until It Was Bug-Free",
    type: "Security & Testing",
    description:
      "How I used two competing AI models as adversarial test players to stress-test a web version of Monopoly Deal and Scotland Yard - and what the simulation taught me about edge cases no human tester would ever find.",
    link: "/blog/ai_boardgame_testing_article.html",
    icon: FaBookmark,
    date: "March 2025",
    stats: "Blog",
  },
  {
    title: "Frontend System Design of Google Docs (High-Level Design)",
    type: "System Design",
    description:
      "A Comprehensive Look at Designing an Interactive, Secure, and Scalable Document Editing Experience",
    link: "https://rgndunes.substack.com/p/frontend-system-design-of-google",
    icon: FaBookmark,
    date: "March 2025",
    stats: "Substack",
  },
  {
    title: "Frontend System Design of Uber (High-Level Design)",
    type: "System Design",
    description:
      "A Deep Dive into Building a Seamless, Responsive, and Scalable Frontend Architecture for Uber",
    link: "https://rgndunes.substack.com/p/frontend-system-design-of-uber-high",
    icon: FaBookmark,
    date: "March 2025",
    stats: "Substack",
  },
  {
    title: "Advanced TypeScript Techniques",
    type: "React",
    description: "Generics, Decorators, and Type Inference",
    link: "https://rgndunes.substack.com/p/advanced-typescript-techniques",
    icon: FaBookmark,
    date: "March 2025",
    stats: "Substack",
  },
  {
    title:
      "Memory Management and Performance Profiling in JavaScript Applications",
    type: "Performance",
    description:
      "JavaScript has evolved into the core of modern web development, driving everything from dynamic UIs to backend services. This section highlights its importance and the need for strong memory management and performance profiling to build scalable, efficient apps.",
    link: "https://medium.com/@rgndunes/memory-management-and-performance-profiling-in-javascript-applications-e5b60b6873d1",
    icon: FaMedium,
    date: "February 2025",
    stats: "27 min read",
  },
  {
    title: "Exploring JavaScript Engines: How V8 Optimises Code Execution",
    type: "JavaScript",
    description:
      "This article dives into the inner workings of JavaScript engines, focusing on how V8 compiles and optimizes code for high performance. From parsing to execution, it breaks down the behind-the-scenes magic that powers modern JavaScript.",
    link: "https://medium.com/@rgndunes/exploring-javascript-engines-how-v8-optimises-code-execution-9d54ef1e551c",
    icon: FaMedium,
    date: "January 2025",
    stats: "9 min read",
  },
  {
    title:
      "The Shadow DOM Explained: Achieving True Encapsulation in Web Components",
    type: "UI / CSS",
    description:
      "This article unpacks the Shadow DOM  - a powerful browser feature that enables true encapsulation in web components. Learn how it helps isolate styles and structure, making your components more modular and maintainable.",
    link: "https://medium.com/@rgndunes/exploring-javascript-engines-how-v8-optimises-code-execution-9d54ef1e551c",
    icon: FaMedium,
    date: "December 2024",
    stats: "4 min read",
  },
  {
    title:
      "Performance Optimisation Techniques: Reducing JavaScript Bundle Size",
    type: "Performance",
    description:
      "This article covers essential performance optimization techniques focused on reducing JavaScript bundle size. It explores strategies like code-splitting, tree shaking, and lazy loading to boost load times and user experience.",
    link: "https://medium.com/@rgndunes/performance-optimisation-techniques-reducing-javascript-bundle-size-026f173ac47c",
    icon: FaMedium,
    date: "November 2024",
    stats: "40 min read",
  },
  {
    title:
      "Advanced JavaScript Concepts: The Event Loop, Promises, and Async/Await",
    type: "JavaScript",
    description:
      "This article dives into advanced JavaScript concepts like the Event Loop, Promises, and async/await, explaining how JavaScript handles asynchronous operations under the hood for smooth and non-blocking execution.",
    link: "https://medium.com/@rgndunes/performance-optimisation-techniques-reducing-javascript-bundle-size-026f173ac47c",
    icon: FaMedium,
    date: "October 2024",
    stats: "26 min read",
  },
  {
    title:
      "The Ultimate Guide to Web Graphics: Enhancing Performance and Ensuring Cross-Platform Compatibility",
    type: "Performance",
    description:
      "This comprehensive guide explores best practices for optimizing web graphics, focusing on performance, efficient formats, and ensuring consistent rendering across devices and browsers.",
    link: "https://medium.com/@rgndunes/the-ultimate-guide-to-web-graphics-enhancing-performance-and-ensuring-cross-platform-compatibility-c18f44851404",
    icon: FaMedium,
    date: "September 2024",
    stats: "47 min read",
  },
  {
    title: "Mastering Cross-Window Communication",
    type: "Browser APIs",
    description:
      "This article demystifies cross-window communication in web applications, covering techniques like postMessage, BroadcastChannel, and storage events to securely and efficiently share data between browser contexts.",
    link: "https://medium.com/@rgndunes/mastering-cross-window-communication-2c8f65d6ad93",
    icon: FaMedium,
    date: "August 2024",
    stats: "35 min read",
  },
  {
    title:
      "Building a Secure Web: Strategies and Case Studies for a Safer Internet",
    type: "Security & Testing",
    description:
      "This article explores practical strategies and real-world case studies to strengthen web application security, addressing common threats like XSS, CSRF, and insecure storage to help developers build a safer internet.",
    link: "https://medium.com/@rgndunes/the-future-of-web-development-in-2024-599999999999",
    icon: FaMedium,
    date: "July 2024",
    stats: "28 min read",
  },
  {
    title:
      "Playing with Binary data  - ArrayBuffer, TypedArray (Uint8, Uint16), DataView, Blob",
    type: "Browser APIs",
    description:
      "This article breaks down how JavaScript handles binary data using ArrayBuffer, TypedArray, DataView, and Blob. It’s a hands-on guide for developers looking to work with low-level binary formats and memory-efficient data structures.",
    link: "https://medium.com/@rgndunes/playing-with-binary-data-arraybuffer-typedarray-uint8-uint16-dataview-blob-c29ff690f593",
    icon: FaMedium,
    date: "July 2024",
    stats: "23 min read",
  },
  {
    title:
      "Comprehensive Guide to JavaScript Package Managers: pnpm, npm, and yarn",
    type: "Tooling",
    description:
      "Exploring emerging technologies and trends that will shape web development in the coming year, from AI integration to new frameworks.",
    link: "https://medium.com/@rgndunes/comprehensive-guide-to-javascript-package-managers-pnpm-npm-and-yarn-a0e4fd1280bd",
    icon: FaMedium,
    date: "May 2024",
    stats: "2 min read",
  },
  {
    title:
      "Balancing Act: Navigating Choices in Frontend Architecture  - Micro-frontends vs. Monoliths",
    type: "System Design",
    description:
      "This article explores the trade-offs between micro-frontends and monolithic architectures in frontend development. It helps developers and teams make informed decisions based on scalability, maintainability, and team structure.",
    link: "https://medium.com/@rgndunes/balancing-act-navigating-choices-in-frontend-architecture-micro-frontends-vs-monoliths-f4b5c72cb9bc",
    icon: FaMedium,
    date: "April 2024",
    stats: "6 min read",
  },
  {
    title:
      "DOM - DOM API, Intersection observer, Mutation observer, Resize observer, iframes",
    type: "Browser APIs",
    description:
      "This article dives deep into the DOM and its powerful APIs  - covering essentials like the DOM API, Intersection Observer, Mutation Observer, Resize Observer, and working with iframes  - to help developers build responsive, dynamic interfaces.",
    link: "https://www.linkedin.com/pulse/dom-api-intersection-observer-mutation-resize-iframes-singh-azufc/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "August 2024",
    stats: "15 min read",
  },
  {
    title: "Maximising Web Performance: Asset Management Techniques",
    type: "Performance",
    description:
      "This article focuses on effective asset management techniques -like compression, caching, lazy loading, and CDN usage -to improve web performance, reduce load times, and enhance user experience.",
    link: "https://www.linkedin.com/pulse/maximising-web-performance-asset-management-techniques-divyansh-singh-9dnvc/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "April 2024",
    stats: "4 min read",
  },
  {
    title: "The Power of CSS Preprocessors - Sass vs. Less vs. Stylus",
    type: "UI / CSS",
    description:
      "This article compares popular CSS preprocessors -Sass, Less, and Stylus -highlighting their features, syntax differences, and use cases to help developers choose the right tool for scalable and maintainable stylesheets.",
    link: "https://www.linkedin.com/pulse/power-css-preprocessors-sass-vs-less-stylus-divyansh-singh-kiwtc/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "February 2024",
    stats: "3 min read",
  },
  {
    title: "Building Efficient Web Applications - A Layman's Guide",
    type: "Beginner",
    description:
      "This article simplifies the principles behind building fast, user-friendly web applications for non-technical readers. It covers core ideas like performance, responsiveness, and best practices in an easy-to-understand way.",
    link: "https://www.linkedin.com/pulse/building-efficient-web-applications-laymans-guide-divyansh-singh-sxqoc/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "February 2024",
    stats: "5 min read",
  },
  {
    title: "Debugging Techniques in JavaScript: Tools and Strategies",
    type: "Best Practices",
    description:
      "This article covers practical debugging techniques in JavaScript using tools like Chrome DevTools, breakpoints, and logging. It also shares strategies for diagnosing and fixing bugs efficiently in modern web applications.",
    link: "https://www.linkedin.com/pulse/debugging-techniques-javascript-tools-strategies-divyansh-singh-rzajc/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "January 2024",
    stats: "6 min read",
  },
  {
    title: "The Evolution of JavaScript: From ES5 to ESNext",
    type: "JavaScript",
    description:
      "This article traces the evolution of JavaScript from ES5 to ESNext, highlighting key language features introduced in each version and how they’ve transformed modern web development.",
    link: "https://www.linkedin.com/pulse/evolution-javascript-from-es5-esnext-divyansh-singh-7hnkc/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "January 2024",
    stats: "9 min read",
  },
  {
    title: "Exploring Modern JavaScript Tooling: Babel, Webpack, and Rollup",
    type: "",
    description:
      "This article explores essential modern JavaScript tools -Babel, Webpack, and Rollup -detailing how they transform, bundle, and optimize code for efficient and scalable application development.",
    link: "https://www.linkedin.com/pulse/exploring-modern-javascript-tooling-babel-webpack-rollup-singh-d6a0c/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "January 2024",
    stats: "2 min read",
  },
  {
    title:
      "Best Practices for Writing Clean and Maintainable Code in Frontend Development",
    type: "Best Practices",
    description:
      "This article shares proven best practices for writing clean, readable, and maintainable code in frontend development, covering naming conventions, modular architecture, code reviews, and more.",
    link: "https://www.linkedin.com/pulse/best-practices-writing-clean-maintainable-code-frontend-singh-jkfdc/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "November 2023",
    stats: "4 min read",
  },
  {
    title: "Responsive Web Design: Creating Websites for All Devices",
    type: "UI / CSS",
    description:
      "This article explains the principles of responsive web design, teaching how to build websites that adapt seamlessly to different screen sizes using flexible layouts, media queries, and modern CSS techniques.",
    link: "https://www.linkedin.com/pulse/responsive-web-design-creating-websites-all-devices-divyansh-singh-lemnc/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "November 2024",
    stats: "6 min read",
  },
  {
    title: "Data Fetching Techniques in React Applications",
    type: "React",
    description:
      "This article explores various data fetching techniques in React applications, including fetch, axios, React Query, SWR, and custom hooks -highlighting when and how to use each for efficient and scalable state management.",
    link: "https://www.linkedin.com/pulse/data-fetching-techniques-react-applications-divyansh-singh-whoac/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "October 2024",
    stats: "5 min read",
  },
  {
    title: "Understanding Browser Rendering: The Critical Rendering Path",
    type: "Performance",
    description:
      "This article breaks down the browser’s Critical Rendering Path -explaining how HTML, CSS, and JavaScript are processed to render pixels on screen -and offers tips to optimize rendering performance for faster load times.",
    link: "https://www.linkedin.com/pulse/understanding-browser-rendering-critical-path-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "October 2024",
    stats: "5 min read",
  },
  {
    title: "Implementing Internationalisation (i18n) in React Applications",
    type: "React",
    description:
      "This article walks through implementing internationalization (i18n) in React applications, covering libraries like react-intl and i18next, locale handling, dynamic translations, and best practices for global-ready apps.",
    link: "https://www.linkedin.com/pulse/implementing-internationalisation-i18n-react-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "October 2024",
    stats: "4 min read",
  },
  {
    title: "Exploring Decorators in JavaScript",
    type: "JavaScript",
    description:
      "This article explores decorators in JavaScript  - a powerful proposed feature for adding behavior to classes and methods  - explaining their syntax, use cases, and real-world applications in modern development.",
    link: "https://www.linkedin.com/pulse/exploring-decorators-javascript-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "September 2023",
    stats: "4 min read",
  },
  {
    title: "Design Patterns in Frontend Development",
    type: "System Design",
    description:
      "This article explores common design patterns in frontend development -such as Singleton, Observer, and Component patterns -helping developers write scalable, maintainable, and efficient UI code.",
    link: "https://www.linkedin.com/pulse/design-patterns-frontend-development-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "September 2023",
    stats: "12 min read",
  },
  {
    title: "Reconciliation in ReactJS",
    type: "React",
    description:
      "This article explains the concept of reconciliation in ReactJS -how React efficiently updates the DOM by comparing virtual DOM trees -and explores the heuristics it uses to ensure optimal rendering performance.",
    link: "https://www.linkedin.com/pulse/reconciliation-reactjs-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "September 2023",
    stats: "4 min read",
  },
  {
    title:
      "The Importance of Events Tracking and Analytics in Frontend Development",
    type: "Best Practices",
    description:
      "This article highlights the critical role of event tracking and analytics in frontend development, showing how user behavior data can drive product decisions, improve UX, and enable data-informed optimizations.",
    link: "https://www.linkedin.com/pulse/importance-events-tracking-analytics-frontend-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "September 2023",
    stats: "4 min read",
  },
  {
    title: "Leveraging Browser Caching for Improved Website Performance",
    type: "Performance",
    description:
      "This article explores how browser caching works and how developers can leverage cache-control headers, service workers, and asset versioning to significantly improve website load times and performance.",
    link: "https://www.linkedin.com/pulse/leveraging-browser-caching-improved-website-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "September 2023",
    stats: "3 min read",
  },
  {
    title: "Choosing the Right State Management Solution for Your React App",
    type: "React",
    description:
      "This article helps developers navigate the landscape of state management in React, comparing tools like Context API, Redux, Zustand, and Recoil to choose the best fit based on app complexity and team needs.",
    link: "https://www.linkedin.com/pulse/choosing-right-state-management-solution-your-react-app-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "September 2023",
    stats: "4 min read",
  },
  {
    title: "Modern CSS Techniques for Creating Stunning Animations",
    type: "UI / CSS",
    description:
      "This article explores modern CSS techniques for creating smooth, visually engaging animations using transitions, keyframes, transform properties, and tools like @keyframes and animation-timing-function.",
    link: "https://www.linkedin.com/pulse/modern-css-techniques-creating-stunning-animations-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "August 2023",
    stats: "3 min read",
  },
  {
    title: "Best Practices for Cross-Browser Testing in Frontend Projects",
    type: "Security & Testing",
    description:
      "This article delves into best practices for cross-browser testing in frontend development, offering strategies to ensure consistent functionality and user experience across various browsers and devices.",
    link: "https://www.linkedin.com/pulse/best-practices-cross-browser-testing-frontend-projects-divyansh-singh/?trackingId=vam50i31Qve44T6uX0Rgvw%3D%3D",
    icon: FaLinkedin,
    date: "August 2023",
    stats: "4 min read",
  },
  {
    title: "How to Effectively Manage State and Side Effects using React Hooks",
    type: "React",
    description:
      "This article explains how to effectively manage state and side effects in React using hooks like useState, useEffect, useReducer, and useCallback, with practical examples for clean and predictable component behavior.",
    link: "https://www.linkedin.com/pulse/how-effectively-manage-state-side-effects-using-react-divyansh-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "August 2023",
    stats: "12 min read",
  },
  {
    title: "The Role of Data Structures and Algorithms in Frontend Development",
    type: "Beginner",
    description:
      "This article highlights how data structures and algorithms play a crucial role in frontend development -from optimizing rendering and DOM manipulation to improving performance and handling complex UI interactions.",
    link: "https://www.linkedin.com/pulse/role-data-structures-algorithms-frontend-development-divyansh-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "August 2023",
    stats: "7 min read",
  },
  {
    title:
      "Web Security in Frontend Development: Common Vulnerabilities and How to Prevent Them",
    type: "Security & Testing",
    description:
      "This article covers common web security vulnerabilities in frontend development -like XSS, CSRF, and insecure storage -and provides practical strategies to prevent them and build safer user-facing applications.",
    link: "https://www.linkedin.com/pulse/web-security-frontend-development-common-how-prevent-them-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "July 2023",
    stats: "5 min read",
  },
  {
    title: "Understanding Webhooks and Their Role in Web Development",
    type: "Browser APIs",
    description:
      "This article explains what webhooks are, how they enable real-time communication between services, and how to implement and secure them effectively in modern web applications.",
    link: "https://www.linkedin.com/pulse/understanding-webhooks-role-web-development-divyansh-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "July 2023",
    stats: "5 min read",
  },
  {
    title:
      "A Guide to Browser Storage: Cookies, Local Storage, and Session Storage",
    type: "Browser APIs",
    description:
      "This article explores the different browser storage options -Cookies, Local Storage, and Session Storage -comparing their use cases, limitations, and best practices for managing client-side data securely and efficiently.",
    link: "https://www.linkedin.com/pulse/guide-browser-storage-cookies-local-session-divyansh-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "July 2023",
    stats: "5 min read",
  },
  {
    title:
      "Unit Test Cases vs. E2E Test Cases vs. Split Test Cases in Frontend Development",
    type: "Security & Testing",
    description:
      "This article compares Unit Tests, End-to-End (E2E) Tests, and Split (A/B) Tests in frontend development, outlining their purposes, tools, and when to use each for ensuring functionality, user experience, and performance.",
    link: "https://www.linkedin.com/pulse/unit-test-cases-vs-e2e-split-frontend-development-divyansh-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "July 2023",
    stats: "6 min read",
  },
  {
    title: "Polyfill in Javascript",
    type: "JavaScript",
    description:
      "This article explains what polyfills are in JavaScript, how they enable modern features to work in older browsers, and when to use them to ensure backward compatibility in web applications.",
    link: "https://www.linkedin.com/pulse/polyfill-javascript-divyansh-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "May 2023",
    stats: "2 min read",
  },
  {
    title: "What is 'combineReducers'​ ?",
    type: "React",
    description:
      "This article explains combineReducers in Redux -how it helps split the Redux state into multiple slices, each managed by its own reducer, for better scalability and maintainability of application state.",
    link: "https://www.linkedin.com/pulse/what-combinereducers-divyansh-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "February 2023",
    stats: "4 min read",
  },
  {
    title:
      "What are Promises ? What is the difference between a Promise and Async/Await ?",
    type: "JavaScript",
    description:
      "This article explains JavaScript Promises -objects that represent the eventual completion or failure of asynchronous operations -and compares them with async/await, highlighting syntax differences, readability, and error handling.",
    link: "https://www.linkedin.com/pulse/what-promises-difference-between-promise-asyncawait-divyansh-singh/?trackingId=NSce1cTiR2SoRZy%2BTZZsbw%3D%3D",
    icon: FaLinkedin,
    date: "May 2023",
    stats: "2 min read",
  },
];
