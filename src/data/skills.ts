// Import skill icons
import reactIcon from "../assets/images/skills/react.png";
import tsIcon from "../assets/images/skills/ts.png";
import reduxIcon from "../assets/images/skills/redux.png";
import zustandIcon from "../assets/images/skills/zustand.png";
import jsIcon from "../assets/images/skills/js.png";
import htmlIcon from "../assets/images/skills/html.png";
import cssIcon from "../assets/images/skills/css.png";
import muiIcon from "../assets/images/skills/mui.png";
import bladeUiIcon from "../assets/images/skills/blade-ui.png";
import semanticUiIcon from "../assets/images/skills/semantic-ui.png";
import chakraUiIcon from "../assets/images/skills/chakra-ui.png";
import flaskIcon from "../assets/images/skills/flask.png";
import firebaseIcon from "../assets/images/skills/firebase.png";
import gitIcon from "../assets/images/skills/git.png";
import datadogIcon from "../assets/images/skills/datadog.svg";
import sentryIcon from "../assets/images/skills/sentry.svg";
import buildkiteIcon from "../assets/images/skills/buildkite.svg";
import playwrightIcon from "../assets/images/skills/playwright.svg";
import bashIcon from "../assets/images/skills/bash.svg";
import awsIcon from "../assets/images/skills/aws.svg";
import nodejsIcon from "../assets/images/skills/nodejs.svg";
import rollupIcon from "../assets/images/skills/rollup.svg";
import webpackIcon from "../assets/images/skills/webpack.svg";
import slackIcon from "../assets/images/skills/slack.svg";
import { StaticImageData } from "next/image";

export interface Skill {
  name: string;
  image: string | StaticImageData;
  experience: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend Development",
    skills: [
      {
        name: "ReactJS",
        image: reactIcon,
        experience: "5+ years",
      },
      {
        name: "TypeScript",
        image: tsIcon,
        experience: "5+ years",
      },
      {
        name: "Redux",
        image: reduxIcon,
        experience: "4+ years",
      },
      {
        name: "Zustand",
        image: zustandIcon,
        experience: "3+ years",
      },
      {
        name: "JavaScript",
        image: jsIcon,
        experience: "4+ years",
      },
      {
        name: "HTML",
        image: htmlIcon,
        experience: "6+ years",
      },
      {
        name: "CSS",
        image: cssIcon,
        experience: "6+ years",
      },
    ],
  },
  {
    name: "UI Templating Libraries",
    skills: [
      {
        name: "Material-UI",
        image: muiIcon,
        experience: "3+ years",
      },
      {
        name: "Blade UI",
        image: bladeUiIcon,
        experience: "2+ years",
      },
      {
        name: "Semantic UI",
        image: semanticUiIcon,
        experience: "2+ years",
      },
      {
        name: "Chakra UI",
        image: chakraUiIcon,
        experience: "2+ years",
      },
    ],
  },
  {
    name: "Observability & DevOps",
    skills: [
      {
        name: "Datadog",
        image: datadogIcon,
        experience: "1+ year",
      },
      {
        name: "Sentry",
        image: sentryIcon,
        experience: "2+ years",
      },
      {
        name: "Buildkite",
        image: buildkiteIcon,
        experience: "1+ year",
      },
      {
        name: "Playwright",
        image: playwrightIcon,
        experience: "2+ years",
      },
      {
        name: "Bash",
        image: bashIcon,
        experience: "3+ years",
      },
    ],
  },
  {
    name: "Backend & Infrastructure",
    skills: [
      {
        name: "AWS",
        image: awsIcon,
        experience: "1+ year",
      },
      {
        name: "Flask",
        image: flaskIcon,
        experience: "2+ years",
      },
      {
        name: "Firebase",
        image: firebaseIcon,
        experience: "3+ years",
      },
      {
        name: "Node.js",
        image: nodejsIcon,
        experience: "3+ years",
      },
    ],
  },
  {
    name: "Tools & Build Systems",
    skills: [
      {
        name: "Git",
        image: gitIcon,
        experience: "5+ years",
      },
      {
        name: "Rollup",
        image: rollupIcon,
        experience: "2+ years",
      },
      {
        name: "Webpack",
        image: webpackIcon,
        experience: "3+ years",
      },
      {
        name: "Slack API",
        image: slackIcon,
        experience: "1+ year",
      },
    ],
  },
];
