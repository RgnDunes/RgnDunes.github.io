import { StaticImageData } from "next/image";
import razorpayLogo from "../assets/images/logos/razorpay-logo.png";
import gfgLogo from "../assets/images/logos/gfg-logo.png";
import ripplingLogo from "../assets/images/logos/rippling-logo.png";
import acciojobLogo from "../assets/images/logos/acciojob.jpeg";
import airtribeLogo from "../assets/images/logos/airtribe.png";
import correlationsLogo from "../assets/images/logos/correlations.png";
import taghiveLogo from "../assets/images/logos/taghive.jpg";

// Media imports
import espritDeCorp1 from "../assets/media/espirit_de_corp_rzp.jpeg";
import espritDeCorp2 from "../assets/media/espirit_de_corp_rzp_2.jpeg";
import winnerOfWeek from "../assets/media/winner_of_the_week_rzp.jpeg";
import rzpInternCert from "../assets/media/rzp_internship_cert.jpeg";
import gfgInternCert from "../assets/media/gfg_internship_cert.png";
import correlationsInternCert from "../assets/media/correlations_ai_internship_certificate.png";
import taghiveInternCert from "../assets/media/Taghive_internship_cert.png";

interface MediaItem {
  src: StaticImageData;
  caption: string;
}

interface PreviousRole {
  position: string;
  duration: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  media?: MediaItem[];
}

interface AchievementGroup {
  title: string;
  items: string[];
}

interface Experience {
  company: string;
  position: string;
  roleDuration?: string;
  roleStartDate?: string;
  roleEndDate?: string;
  duration: string;
  startDate: string;
  endDate?: string;
  track: "primary" | "concurrent";
  description: string;
  achievements?: string[];
  achievementGroups?: AchievementGroup[];
  previousRoles?: PreviousRole[];
  logo: string | StaticImageData;
  technologies?: string[];
  media?: MediaItem[];
}

export const experiences: Experience[] = [
  {
    company: "Rippling",
    position: "Software Engineer II, Web Infrastructure",
    duration: "Jun 2025 - Present",
    startDate: "2025-06",
    track: "primary",
    description:
      "Frontend infrastructure, developer tooling, CI/CD systems, test reliability, and incident response.",
    achievements: [
      "Reworked eager route imports after a Vite 8 benchmark identified them as the larger local-development bottleneck, cutting one product's import graph from 11,516 modules to 54 and finished-loading time from 90 seconds to 10.54 seconds; applied the analysis across six product areas.",
      "Converted safe integration-test suites from serial to parallel execution across ten product and platform domains, reducing successful-build P90 from 81 to 52 minutes, backend pull-request P90 from 76 to 40 minutes, and frontend pull-request P90 from 88 to 58 minutes.",
      "Replaced permanent package credentials with 12-hour IAM-backed tokens across three repositories and verified five CI scenarios; moved the flow to AWS Secrets Manager after CodeArtifact reached a quota limit.",
      "Created a flaky-test detection pipeline that runs the full suite 20 times against a known-green commit, calculates scores at test and module level, and publishes results to Datadog, an S3-hosted dashboard, and Slack.",
      "Split deployment-blockage telemetry into four six-hour windows after finding that Datadog rejects timestamps older than 18 hours, allowing missed runs to recover data without gaps or duplicates.",
      "Moved an internal developer CLI into the primary frontend monorepo, raised function coverage to approximately 100%, and removed its root-directory assumption so independently deployed applications can resolve shared configuration and binaries.",
      "Centralized service-ownership metadata from backend, frontend, and mobile repositories, updated Python, JavaScript, and Terraform consumers, and added CI checks for mass deletion, missing owners, and reintroduced fields.",
      "Replaced weekly manual on-call reporting with a Buildkite job backed by the Slack API, categorizing 50+ support queries and reporting response time, timezone, ownership, and query trends to save 1-2 hours per week.",
      "Designed owner-first P1 incident automation after analyzing about 90 on-call engagements across 11 weeks; replaying the reference week showed 6 of 9 incidents would not have paged Web Infrastructure first.",
      "Added a browser beacon and backend endpoint to capture bundle failures before Datadog RUM, LogRocket, or Sentry initialize, recording the failure mode, deployment context, and affected script.",
    ],
    achievementGroups: [
      {
        title: "Developer speed",
        items: [
          "Reworked eager route imports: 11,516 → 54 modules and 90s → 10.54s finished loading; extended the analysis across six product areas.",
          "Moved an internal developer CLI into the frontend monorepo, reached ~100% function coverage, and added independently deployed app support.",
        ],
      },
      {
        title: "CI and test reliability",
        items: [
          "Parallelized safe integration suites across ten domains: build P90 81 → 52m, backend PR P90 76 → 40m, and frontend PR P90 88 → 58m.",
          "Built flaky-test detection with 20× reruns, test and module scoring, and Datadog, S3 dashboard, and Slack reporting.",
        ],
      },
      {
        title: "Platform and security",
        items: [
          "Replaced permanent package credentials with 12-hour IAM tokens across three repositories and moved the flow to AWS Secrets Manager.",
          "Centralized service ownership for backend, frontend, and mobile; updated Python, JavaScript, and Terraform consumers with CI safeguards.",
        ],
      },
      {
        title: "Observability and incident response",
        items: [
          "Split deployment telemetry into four six-hour recovery windows so missed runs retain complete, duplicate-free data.",
          "Automated reporting for 50+ weekly support queries, saving 1–2 hours of manual on-call work each week.",
          "Designed owner-first P1 automation from ~90 engagements; 6 of 9 reference-week incidents would avoid paging Web Infrastructure first.",
          "Captured bundle failures before RUM, LogRocket, or Sentry startup with a browser beacon and backend endpoint.",
        ],
      },
    ],
    logo: ripplingLogo,
    technologies: [
      "React",
      "TypeScript",
      "AWS",
      "Datadog",
      "Buildkite",
      "Playwright",
      "Slack API",
    ],
  },
  {
    company: "Razorpay",
    position: "Senior Frontend Engineer, Internationalization",
    roleDuration: "Nov 2024 - Jun 2025",
    roleStartDate: "2024-11",
    roleEndDate: "2025-06",
    duration: "May 2021 - Jun 2025",
    startDate: "2021-05",
    endDate: "2025-06",
    track: "primary",
    description:
      "International expansion, i18n infrastructure, and payment authentication across Malaysia, Singapore, and India.",
    achievements: [
      "Shipped region-aware payment flows for Malaysia and Singapore, enabling 530 merchant activations and supporting MYR 80 million in monthly gross merchandise value.",
      "Owned the architecture and roadmap for @razorpay/i18nify-js, an open-source internationalization SDK used by 27+ teams and downloaded 100,000+ times per week.",
      "Replaced Webpack with Rollup and cut the SDK bundle by 30%; partial imports removed another 1.6 MB from consumer bundles while retaining ESM, CommonJS, and UMD distributions.",
      "Added RTL-ready components to the company design system, reaching 19+ product teams, and mentored five frontend engineers who went on to own features independently.",
      "Earned four Razorpay SPOT awards for ownership and engineering impact.",
    ],
    logo: razorpayLogo,
    technologies: [
      "React",
      "TypeScript",
      "Rollup",
      "Blade UI",
      "Playwright",
      "Jest",
    ],
    media: [
      { src: espritDeCorp1, caption: "Esprit De Corps Award" },
      { src: espritDeCorp2, caption: "Esprit De Corps Award" },
      { src: winnerOfWeek, caption: "Winner of the Week" },
    ],
    previousRoles: [
      {
        position: "Software Development Engineer I",
        duration: "Aug 2022 - Oct 2024",
        startDate: "2022-08",
        endDate: "2024-10",
        description:
          "Payment authentication, tokenization, and frontend infrastructure.",
        achievements: [
          "Shipped a Mastercard biometric authentication experience demonstrated at Global Fintech Fest 2024, improving payment success by 35% over 3DS OTP and increasing card payments by 33%.",
          "Cut the time needed to launch a new geography from 8-9 months to one month by extracting reusable internationalization and region-aware platform layers.",
          "Created an LLM-assisted static-analysis CLI for localization gaps and region-specific hardcoding, reaching 97.3% accuracy across 1,000+ scenarios and adoption by seven frontend teams.",
          "Split the Merchant Dashboard into micro-frontends, reducing build and unit-test time by 67% and end-to-end test time by 70%.",
          "Delivered a token lifecycle system for four banks that enabled 800,000+ tokenizations and reduced risk by 40%.",
        ],
      },
      {
        position: "Frontend Engineer Intern",
        duration: "May 2021 - Jul 2022",
        startDate: "2021-05",
        endDate: "2022-07",
        description: "Payment disputes and fraud detection UI for RazorpayX.",
        achievements: [
          "Halved payment-dispute resolution time from 20 to 10 minutes.",
          "Revamped a risk-management interface, increasing engagement by 33% while reducing load time by 21%.",
        ],
        media: [{ src: rzpInternCert, caption: "Internship Certificate" }],
      },
    ],
  },
  {
    company: "AccioJob",
    position: "React & Redux Instructor",
    duration: "Jan 2023 - May 2025",
    startDate: "2023-01",
    endDate: "2025-05",
    track: "concurrent",
    description:
      "Freelance instructor teaching frontend development from HTML/CSS/JS through advanced React, state management, and modern frontend patterns.",
    achievements: undefined,
    logo: acciojobLogo,
    technologies: ["React", "Redux", "JavaScript", "HTML", "CSS"],
  },
  {
    company: "Airtribe",
    position: "Full Stack Mentor",
    duration: "Apr 2024 - Oct 2024",
    startDate: "2024-04",
    endDate: "2024-10",
    track: "concurrent",
    description:
      "Mentored 100+ students preparing for frontend and backend roles. Invited as Jury Member for a Tech-AI Hackathon held in Bangalore.",
    achievements: undefined,
    logo: airtribeLogo,
    technologies: ["React", "Node.js", "JavaScript", "TypeScript"],
  },
  {
    company: "GeeksforGeeks",
    position: "Technical Content Writer Intern",
    duration: "Oct 2020 - Aug 2021",
    startDate: "2020-10",
    endDate: "2021-08",
    track: "concurrent",
    description:
      "Published 11+ technical articles and enhanced 2 existing ones covering Linked Lists, Python, Git, ReactJS, Firestore, Flask, and more.",
    achievements: undefined,
    logo: gfgLogo,
    technologies: ["Python", "ReactJS", "Flask", "Git"],
    media: [{ src: gfgInternCert, caption: "Internship Certificate" }],
  },
  {
    company: "Correlations.ai",
    position: "SWE Intern",
    duration: "Dec 2020 - Feb 2021",
    startDate: "2020-12",
    endDate: "2021-02",
    track: "primary",
    description:
      "Worked on Login Infrastructure and Mail Templating Services using ReactJS, Flask, and MongoDB.",
    achievements: undefined,
    logo: correlationsLogo,
    technologies: ["ReactJS", "Flask", "MongoDB"],
    media: [{ src: correlationsInternCert, caption: "Internship Certificate" }],
  },
  {
    company: "TagHive Inc.",
    position: "Android Developer Intern",
    duration: "Aug 2020 - Oct 2020",
    startDate: "2020-08",
    endDate: "2020-10",
    track: "primary",
    description:
      "Contributed to the Android development of Class Saathi, an ed-tech app by TagHive (South Korea).",
    achievements: undefined,
    logo: taghiveLogo,
    technologies: ["Android", "Java"],
    media: [{ src: taghiveInternCert, caption: "Internship Certificate" }],
  },
] as const;
