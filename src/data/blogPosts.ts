export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content?: string; // Markdown or HTML content (inline)
  contentPath?: string; // Path to HTML file in /public/blog/ directory
  contentType?: "markdown" | "html"; // Default: markdown
  publishedAt: string; // ISO date
  tags: string[];
  readingTime: string;
  featured?: boolean;
  author: {
    name: string;
    image?: string;
  };
  coverImage?: string;
}

// Your blog posts go here - add new posts to this array
export const blogPosts: BlogPost[] = [
  {
    slug: "ai-model-paralysis",
    title: "There Are 47 AI Models. I Have Credits for 12 of Them. I Still Don't Know Which One to Use.",
    description: "When your org gives you access to Claude, Gemini, ChatGPT, and a dozen others - each with different models, effort levels, and credit caps - how do you decide? A framework for choosing AI models that maximises accuracy without burning through your budget.",
    contentPath: "/blog/ai-model-paralysis_article.html",
    publishedAt: "2026-07-20",
    tags: ["AI Tools", "Developer Experience", "Decision Frameworks"],
    readingTime: "~12 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "i-stopped-using-npm-install-heres-the-40-second-trick-that-changed-how-i-debug-dependencies",
    title: "I Stopped Using npm install. Here's the 40-Second Trick That Changed How I Debug Dependencies.",
    description: "Most engineers reinstall node_modules when debugging dependency issues. There's a faster way that lets you patch, test, and iterate on third-party packages in seconds - without waiting for CI or publishing to a test registry.",
    contentPath: "/blog/i-stopped-using-npm-install-heres-the-40-second-trick-that-changed-how-i-debug-dependencies_article.html?v=2",
    publishedAt: "2026-07-11",
    tags: ["Frontend Infrastructure", "npm", "Developer Experience"],
    readingTime: "~17 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "ai-token-limits-pxpipe-solution",
    title: "I Was Drowning in AI Token Limits. Then I Found a Hack That Compresses Text Into Images.",
    description: "How one developer's frustration with Claude's token costs led to discovering pxpipe - a tool that packs 18 million characters into a 1M token window by converting text to images.",
    contentPath: "/blog/ai-token-limits-pxpipe-solution_article.html",
    publishedAt: "2026-07-10",
    tags: ["AI Tooling", "Cost Optimisation", "Claude", "Developer Tools", "Performance"],
    readingTime: "~12 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "react-server-components-data-leak",
    title: "Your React Server Components Are Leaking User Data Through Client Boundaries. Here's How.",
    description: "Why the server/client boundary in React Server Components is a security minefield that most teams are crossing blindly - and how serialisation turns your careful access control into a data exposure incident waiting to happen.",
    contentPath: "/blog/react-server-components-data-leak_article.html",
    publishedAt: "2026-07-10",
    tags: ["React", "Security", "Server Components", "Next.js", "Architecture"],
    readingTime: "~12 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "your-rust-build-tool-is-slower-than-webpack",
    title: "Your 100x Faster Rust Build Tool Is Slower Than Webpack. Here's Why.",
    description: "Turbopack, SWC, and esbuild promise instant builds. But in real-world monorepos with warm caches and incremental compilation, Webpack still wins. Here's the nuanced truth about build tool performance that benchmark charts don't show.",
    contentPath: "/blog/your-rust-build-tool-is-slower-than-webpack_article.html",
    publishedAt: "2026-07-07",
    tags: ["Build Tools", "Webpack", "Rust", "Performance", "Developer Experience"],
    readingTime: "~12 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "prompting-vs-looping-in-ai",
    title: "Prompting vs Looping: Why Most Engineers Are Burning Through AI Credits Wrong",
    description: "The difference between prompting and looping in AI models like Claude isn't about cost - it's about control. Here's what every engineer building with LLMs needs to know about determinism, context retention, and when to let the model think versus when to take control.",
    contentPath: "/blog/prompting-vs-looping-in-ai_article.html",
    publishedAt: "2026-06-28",
    tags: ["AI Engineering", "LLM", "Architecture", "Production Patterns"],
    readingTime: "~10 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "tree-shaking-is-a-lie",
    title: "Tree Shaking Is a Lie: Why Your Bundle Still Ships Dead Code",
    description: "The frontend community sold you on tree shaking as the silver bullet for bundle size. But your production bundles are still bloated with unused code. Here's why the promise was always incomplete - and what actually works.",
    contentPath: "/blog/tree-shaking-is-a-lie_article.html",
    publishedAt: "2026-06-23",
    tags: ["Build Systems", "Performance", "Webpack", "Rollup", "Vite", "esbuild"],
    readingTime: "~12 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "react-useeffect-memory-leaks",
    title: "I Audited 40 React Codebases. Every Single One Had a useEffect Memory Leak.",
    description: "After reviewing over 40 production React codebases, the pattern is impossible to ignore: useEffect-related memory leaks are everywhere. Here is what every team is getting wrong, and how to audit your own code before users start noticing.",
    contentPath: "/blog/react-useeffect-memory-leaks_article.html",
    publishedAt: "2026-06-08",
    tags: ["React", "Memory Leaks", "Performance", "JavaScript", "Frontend Engineering"],
    readingTime: "~16 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "source-maps-security-vulnerability",
    title: "Your Production Source Maps Are Leaking Your Entire Codebase to Anyone Who Knows Where to Look",
    description: "Most frontend teams ship source maps to production without realising they're handing anyone a complete, readable copy of their application code. Here's what's actually inside them, how they get exploited, and what to do about it today.",
    contentPath: "/blog/source-maps-security-vulnerability_article.html",
    publishedAt: "2026-06-03",
    tags: ["Security", "Build Systems", "Frontend Infrastructure", "webpack", "Vite"],
    readingTime: "~14 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "vibe-coding-technical-debt-report",
    title: "12 Months of Vibe Coding in Production: The Technical Debt Report Nobody's Publishing",
    description: "We shipped more features in 12 months than in the previous three years combined. We also quietly built the most confusing codebase of my career. Here is the honest audit.",
    contentPath: "/blog/vibe-coding-technical-debt-report_article.html",
    publishedAt: "2026-06-02",
    tags: ["AI", "Technical Debt", "Production Engineering", "Frontend"],
    readingTime: "~18 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "hydration-is-the-most-expensive-lie-in-frontend",
    title: "Hydration Is the Most Expensive Lie in Frontend",
    description: "Hydration makes your browser rebuild the entire page a second time just to make it interactive. Here is what it actually costs, and how islands, resumability, and Server Components are quietly replacing it.",
    contentPath: "/blog/hydration-is-the-most-expensive-lie-in-frontend_article.html",
    publishedAt: "2026-05-26",
    tags: ["Hydration", "React", "Performance", "Frontend Architecture", "Web Performance"],
    readingTime: "~22 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "replaced-npm-with-browser-apis",
    title: "I Replaced 12 npm Packages With Browser APIs Nobody Uses. Here's What Happened.",
    description: "How I audited our production app's dependency tree, replaced a dozen packages with native browser APIs, and cut our bundle by 58%. A practical guide to the platform features hiding in plain sight.",
    contentPath: "/blog/replaced-npm-with-browser-apis_article.html",
    publishedAt: "2026-05-21",
    tags: ["Frontend", "Dependencies", "Browser APIs", "Performance"],
    readingTime: "~16 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "developer-infrastructure-is-on-fire",
    title: "The Developer Infrastructure Is on Fire: GitHub Outages, npm Breaches, and the Crisis Nobody Prepared For",
    description: "257 GitHub incidents in one year. Axios backdoored by North Korea. TanStack hijacked in 6 minutes. A self-replicating worm loose in the npm registry. The tools you trust with your code are under siege.",
    contentPath: "/blog/developer-infrastructure-is-on-fire_article.html",
    publishedAt: "2026-05-13",
    tags: ["Security", "Supply Chain", "npm", "Infrastructure"],
    readingTime: "~14 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "typescript-doesnt-protect-you-at-runtime",
    title: "TypeScript's Biggest Lie: Your Types Vanish the Moment Your Code Ships to Production",
    description: "We treat TypeScript like a runtime safety net. It is not one. Here is where the illusion breaks down - and what you actually need to protect your production code from the data it never expected.",
    contentPath: "/blog/typescript-doesnt-protect-you-at-runtime_article.html",
    publishedAt: "2026-05-13",
    tags: ["TypeScript", "Runtime Safety", "Architecture"],
    readingTime: "~16 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "cdn-cache-cors-poisoning",
    title: "Your CDN Cache Didn't Poison Itself: How Deployment Polling Services Silently Break CORS",
    description: "You added crossorigin='anonymous' to your script tags. You bumped the cache version. You tested in staging. And production still broke. Here is what nobody tells you about prefetch links, browser HTTP cache, and CORS mode transitions.",
    contentPath: "/blog/cdn-cache-cors-poisoning_article.html",
    publishedAt: "2026-05-08",
    tags: ["Frontend Infrastructure", "Browser Internals", "CORS"],
    readingTime: "~15 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "vercel-got-pwned-through-an-ai-tool",
    title: "Vercel Got Pwned Through an AI Tool Nobody Audited",
    description: "A third-party AI tool called Context.ai gave attackers a backdoor into Vercel's internal systems. Environment variables, API keys, deployment configs - all exposed. Here is what happened and what every frontend team needs to do right now.",
    contentPath: "/blog/vercel-got-pwned-through-an-ai-tool_article.html",
    publishedAt: "2026-04-20",
    tags: ["Security", "Vercel", "Infrastructure"],
    readingTime: "~14 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "claude-opus-4-7-what-it-means-for-your-role",
    title: "Claude Opus 4.7 Just Shipped. What It Means For You Depends Entirely on Your Job Title.",
    description: "Anthropic's newest flagship model landed yesterday. Whether it changes your Monday depends on whether you write code, manage people who write code, or recently approved a budget for people who write code.",
    contentPath: "/blog/claude-opus-4-7-what-it-means-for-your-role_article.html",
    publishedAt: "2026-04-17",
    tags: ["AI", "Career", "Industry Analysis"],
    readingTime: "~18 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "claude-mythos-escaped-its-sandbox",
    title: "Claude Mythos Escaped Its Own Sandbox and Emailed a Researcher: Why Every Developer Should Be Paying Attention",
    description: "Anthropic's most capable AI found zero-days in every major browser and OS, broke out of containment, and emailed a researcher about it. Here is what this means for every developer shipping code today.",
    contentPath: "/blog/claude-mythos-escaped-its-sandbox_article.html",
    publishedAt: "2026-04-15",
    tags: ["AI Security", "Cybersecurity", "Claude Mythos"],
    readingTime: "~18 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "signals-eating-react",
    title: "Signals Are Eating React: Why the Frontend World Is Quietly Abandoning Virtual DOM",
    description: "The frontend world is undergoing a quiet revolution. Signals-based reactivity is replacing the Virtual DOM paradigm, and React's dominance is being challenged not by a framework, but by a fundamentally better idea.",
    contentPath: "/blog/signals-eating-react_article.html",
    publishedAt: "2026-04-13",
    tags: ["React", "Signals", "Frontend Architecture"],
    readingTime: "~20 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "css-has-changed-everything",
    title: "CSS :has() Changed Everything: The Selector That Eliminated JavaScript From My Stylesheets",
    description: "A deep dive into CSS :has() - the parent selector that finally arrived, and how it fundamentally changes the relationship between CSS and JavaScript in modern web development.",
    contentPath: "/blog/css-has-changed-everything_article.html",
    publishedAt: "2026-04-13",
    tags: ["CSS", "Web Development", "Frontend"],
    readingTime: "~18 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "fetch-api-streams-cancellation-features",
    title: "The Fetch API Is Not What You Think: Streams, Cancellation, and the Features Nobody Uses",
    description: "Most developers treat fetch() as a glorified XMLHttpRequest. This deep dive explores the powerful features hiding in plain sight - streaming, cancellation, caching, and the patterns that separate hobby projects from production-grade code.",
    contentPath: "/blog/fetch-api-streams-cancellation-features_article.html",
    publishedAt: "2026-04-05",
    tags: ["JavaScript", "Web APIs", "Fetch API"],
    readingTime: "~20 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "web-workers-are-not-threads",
    title: "Web Workers Are Not Threads: What JavaScript Developers Get Wrong About Browser Parallelism",
    description: "Most JavaScript developers think Web Workers give them multithreading. They don't. This deep dive explores what Web Workers actually are, how they differ from OS threads, and why the distinction matters for building performant web applications.",
    contentPath: "/blog/web-workers-are-not-threads_article.html",
    publishedAt: "2026-04-05",
    tags: ["JavaScript", "Web Workers", "Concurrency"],
    readingTime: "18 min read",
    author: {
      name: "Divyansh Singh",
    },
  },
  {
    slug: "ai-boardgame-testing",
    title: "I Let Claude & GPT-4 Play My Board Game Until It Was Bug-Free",
    description: "How I used two competing AI models as adversarial test players to stress-test a web version of Monopoly Deal and Scotland Yard - and what the simulation taught me about edge cases no human tester would ever find.",
    contentPath: "/blog/ai_boardgame_testing_article.html",
    publishedAt: "2026-03-28",
    tags: ["AI", "Testing", "Games"],
    readingTime: "18 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "ai-code-review",
    title: "AI Code Review Is Making Your Codebase Harder to Maintain",
    description: "Everyone is merging faster, the PR backlog is clean, and the dashboards look very good. So why does opening a module from eight months ago feel like reading someone else's fever dream?",
    contentPath: "/blog/ai_code_review_article.html",
    publishedAt: "2026-04-08",
    tags: ["AI", "Code Review", "Software Engineering"],
    readingTime: "10 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "buildkite-vs-github-actions",
    title: "Buildkite vs GitHub Actions: A Web Infrastructure Engineer's Honest Take",
    description: "I have spent the better part of two years running both of these in production across teams of different shapes and sizes. Here is everything I wish someone had told me before I started forming opinions.",
    contentPath: "/blog/buildkite_vs_github_actions.html",
    publishedAt: "2026-04-10",
    tags: ["CI/CD", "DevOps", "Infrastructure"],
    readingTime: "12 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "death-of-traditional-cicd",
    title: "The Death of the Traditional CI/CD Pipeline",
    description: "How AI-assisted deployments, platform engineering, and a new generation of tooling are dismantling the pipeline model we've relied on for a decade, and what actually comes next.",
    contentPath: "/blog/cicd_pipeline_article.html",
    publishedAt: "2026-04-01",
    tags: ["CI/CD", "DevOps", "AI"],
    readingTime: "12 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "frontend-observability",
    title: "Frontend Observability is Not a Backend Problem",
    description: "Your servers are green. Your APIs are healthy. Your dashboards look perfectly fine. And somewhere out there, a real user is staring at a blank white screen. Here is why that gap exists, and what you can actually do about it.",
    contentPath: "/blog/frontend_observability_article.html",
    publishedAt: "2026-04-15",
    tags: ["Observability", "Frontend", "Performance"],
    readingTime: "10 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "npm-supply-chain-attacks",
    title: "npm Supply Chain Attacks: What Actually Happens Inside Your Registry",
    description: "A proper look at how attackers get into your dependency tree, what they do once they are in, and why your lockfile alone is not going to save you.",
    contentPath: "/blog/npm_supply_chain_attacks.html",
    publishedAt: "2026-04-17",
    tags: ["Security", "npm", "Supply Chain"],
    readingTime: "12 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "npm-workspaces-isolation",
    title: "No Isolation in npm Workspaces, And Why That Matters",
    description: "npm workspaces make monorepo dependency management feel very convenient, but they deliberately share a single node_modules tree across every package. This design has consequences that quietly break reproducibility.",
    contentPath: "/blog/npm_workspaces_isolation.html",
    publishedAt: "2026-04-22",
    tags: ["npm", "Monorepo", "Tooling"],
    readingTime: "10 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "react19-actions",
    title: "React 19 Actions Are Not a State Management Solution",
    description: "The new Actions API is a solid improvement for handling async mutations and form submissions. But teams are already reaching for it as a Zustand or Redux replacement, and that's a category error that will bite them at scale.",
    contentPath: "/blog/react19_actions_article.html",
    publishedAt: "2026-04-24",
    tags: ["React", "State Management", "Frontend"],
    readingTime: "10 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "rollup-not-just-for-libraries",
    title: "Rollup Is Not Just for Libraries Anymore",
    description: "For years we quietly assumed Rollup was the library bundler and Webpack was the application bundler. That line has blurred considerably. Here is why Rollup deserves a second look for your next production application.",
    contentPath: "/blog/rollup_article.html",
    publishedAt: "2026-04-29",
    tags: ["Bundlers", "Rollup", "Tooling"],
    readingTime: "10 min read",
    author: { name: "Divyansh Singh" },
  },
  {
    slug: "zero-bundle-size-dx-cost",
    title: "What \"Zero Bundle Size\" Frameworks Actually Cost in Developer Experience",
    description: "The pitch is very attractive: ship no JavaScript, score 100 on Lighthouse. But the developer experience of working with Qwik, Astro Islands, and their cousins is a different story altogether.",
    contentPath: "/blog/zero-bundle-size-dx-cost_article.html",
    publishedAt: "2026-05-01",
    tags: ["Frameworks", "DX", "Performance"],
    readingTime: "12 min read",
    author: { name: "Divyansh Singh" },
  },
  // Example 1: Markdown blog post (write inline)
  // {
  //   slug: "my-markdown-post",
  //   title: "My Markdown Post",
  //   description: "A blog post written in markdown",
  //   content: `
  // # My First Blog Post
  //
  // Your markdown content goes here...
  //
  // ## Section heading
  //
  // Some text with **bold** and *italic*.
  //
  // \`\`\`typescript
  // const example = "code block";
  // \`\`\`
  //   `,
  //   publishedAt: "2026-03-25",
  //   tags: ["React", "JavaScript"],
  //   readingTime: "5 min read",
  //   author: {
  //     name: "Divyansh Singh",
  //   },
  // },

  // Example 2: HTML from file (easiest - just drop HTML file!)
  // {
  //   slug: "my-article-from-file",
  //   title: "My Article From File",
  //   description: "Import HTML article by file path",
  //   contentPath: "/blog/my-article.html",  // 👈 Just reference the file!
  //   publishedAt: "2026-03-25",
  //   tags: ["HTML", "Import"],
  //   readingTime: "8 min read",
  //   author: {
  //     name: "Divyansh Singh",
  //   },
  // },

  // Example 3: Inline HTML (if you prefer pasting)
  // {
  //   slug: "my-inline-html",
  //   title: "My Inline HTML",
  //   description: "HTML pasted directly",
  //   contentType: "html",
  //   content: `
  //     <h1>My HTML Article</h1>
  //     <p>Paste your HTML here...</p>
  //   `,
  //   publishedAt: "2026-03-25",
  //   tags: ["HTML"],
  //   readingTime: "5 min read",
  //   author: {
  //     name: "Divyansh Singh",
  //   },
  // },
];
