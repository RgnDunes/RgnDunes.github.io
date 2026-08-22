"use client";

import { useCallback, useMemo, useState } from "react";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import { experiences } from "@/data/experience";
import { skillCategories } from "@/data/skills";
import { projects } from "@/data/projects";
import { products } from "@/data/products";
import { blogPosts } from "@/data/blogPosts";
import { testimonials } from "@/data/testimonials";
import DetailDrawer from "./DetailDrawer";
import TransitionLink from "@/components/transitions/TransitionLink";

type Panel =
  | { kind: "work"; index: number }
  | { kind: "skills" }
  | { kind: "projects" }
  | null;

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"];
const WORK_BEATS = [
  "work-rippling",
  "work-razorpay",
  "work-acciojob",
  "work-airtribe",
  "work-geeksforgeeks",
  "work-correlations",
  "work-taghive",
];

const latestPosts = [...blogPosts]
  .sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
  .slice(0, 4);

export default function Observatory() {
  const [panel, setPanel] = useState<Panel>(null);
  const closePanel = useCallback(() => setPanel(null), []);
  const activeExperience =
    panel?.kind === "work" ? experiences[panel.index] : null;

  const drawer = useMemo(() => {
    if (activeExperience) {
      const achievements = [
        ...(activeExperience.achievements ?? []),
        ...(activeExperience.previousRoles?.flatMap(
          (role) => role.achievements,
        ) ?? []),
      ];
      return {
        eyebrow: `${activeExperience.duration} · ${activeExperience.company}`,
        title: activeExperience.position,
        content: (
          <>
            <p className="obs-drawer-lede">{activeExperience.description}</p>
            {activeExperience.previousRoles?.map((role) => (
              <div className="obs-role" key={role.position}>
                <strong>{role.position}</strong>
                <span>{role.duration}</span>
              </div>
            ))}
            {achievements.length > 0 && (
              <ul className="obs-detail-list">
                {achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            )}
            {activeExperience.technologies && (
              <div className="obs-tags">
                {activeExperience.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            )}
          </>
        ),
      };
    }

    if (panel?.kind === "skills") {
      return {
        eyebrow: "Skills and technologies",
        title: "What I work with",
        content: (
          <div className="obs-skill-directory">
            {skillCategories.map((category) => (
              <section key={category.name}>
                <h3>{category.name}</h3>
                <ul>
                  {category.skills.map((skill) => (
                    <li key={skill.name}>
                      <span>{skill.name}</span>
                      <small>{skill.experience}</small>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ),
      };
    }

    if (panel?.kind === "projects") {
      return {
        eyebrow: "Selected projects",
        title: "Open-source tools and independent work",
        content: (
          <div className="obs-project-directory">
            {projects.map((project) => (
              <article key={project.title}>
                <p className="obs-kicker">{project.stats}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="obs-tags">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                <div className="obs-link-row">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label} <FaExternalLinkAlt aria-hidden />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ),
      };
    }

    return null;
  }, [activeExperience, panel]);

  return (
    <main className="observatory">
      <div className="obs-vignette" aria-hidden />

      <section id="top" data-scene-beat="top" className="obs-chapter obs-hero">
        <div className="obs-overlay obs-overlay-left">
          <p className="obs-kicker">Folio {ROMAN[0]} · Software Engineer II</p>
          <h1>
            I make frontend development
            <span>faster and more reliable.</span>
          </h1>
          <p className="obs-lede">
            Divyansh Singh builds frontend infrastructure, developer tooling,
            and CI/CD systems at Rippling.
          </p>
          <div className="obs-actions">
            <a href="#about" className="obs-primary">
              See my work <FaArrowRight aria-hidden />
            </a>
            <a href="#contact" className="obs-text-link">
              Start a conversation
            </a>
          </div>
        </div>
        <div className="obs-verse">
          <span>कर्मण्येवाधिकारस्ते मा फलेषु कदाचन</span>
          <small>You have the right to work—never to its fruits.</small>
        </div>
        <div className="obs-scroll-cue">
          <span /> Scroll to travel
        </div>
      </section>

      <section id="about" data-scene-beat="about" className="obs-chapter">
        <div className="obs-overlay obs-overlay-right">
          <p className="obs-kicker">Folio {ROMAN[1]} · What I do</p>
          <h2>I improve developer speed and production reliability.</h2>
          <p className="obs-lede">
            I work on the plumbing other engineers depend on: faster local
            development, reliable tests, safer releases, observability, and
            incident response.
          </p>
          <dl className="obs-metrics">
            <div>
              <dt>Build P90</dt>
              <dd>81 → 52m</dd>
            </div>
            <div>
              <dt>Import graph</dt>
              <dd>11,516 → 54</dd>
            </div>
            <div>
              <dt>Weekly SDK use</dt>
              <dd>100K+</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="work" className="obs-work">
        <header className="obs-work-intro">
          <p className="obs-kicker">Folio {ROMAN[2]} · Work experience</p>
          <h2>Where I’ve worked and what I delivered.</h2>
        </header>
        {experiences.map((experience, index) => (
          <article
            key={experience.company}
            data-scene-beat={WORK_BEATS[index]}
            className={`obs-role-beat ${index % 2 ? "obs-role-right" : ""}`}
          >
            <div className="obs-role-card" data-scene-pulse>
              <div className="obs-role-index">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="obs-kicker">{experience.duration}</p>
              <h3>{experience.company}</h3>
              <strong>{experience.position}</strong>
              <p>{experience.description}</p>
              {experience.technologies && (
                <div className="obs-tags">
                  {experience.technologies.slice(0, 4).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              )}
              <button
                className="obs-text-link"
                onClick={() => setPanel({ kind: "work", index })}
              >
                View achievements <FaArrowRight aria-hidden />
              </button>
            </div>
          </article>
        ))}
      </section>

      <section id="skills" data-scene-beat="skills" className="obs-chapter">
        <div className="obs-overlay obs-overlay-left">
          <p className="obs-kicker">Folio {ROMAN[3]} · Skills</p>
          <h2>Technologies I use across frontend and infrastructure.</h2>
          <div className="obs-orbit-labels">
            {skillCategories.map((category, index) => (
              <span key={category.name}>
                <b>0{index + 1}</b>
                {category.name}
              </span>
            ))}
          </div>
          <button
            className="obs-primary"
            onClick={() => setPanel({ kind: "skills" })}
          >
            View all skills <FaArrowRight aria-hidden />
          </button>
        </div>
      </section>

      <section id="notebook" data-scene-beat="notebook" className="obs-chapter">
        <div className="obs-overlay obs-overlay-right">
          <p className="obs-kicker">Folio {ROMAN[4]} · Projects</p>
          <h2>Open-source tools and products I’ve built.</h2>
          <div className="obs-project-list">
            {projects.map((project, index) => (
              <div key={project.title}>
                <span>0{index + 1}</span>
                <strong>{project.title}</strong>
                <small>{project.stats}</small>
              </div>
            ))}
          </div>
          <button
            className="obs-primary"
            onClick={() => setPanel({ kind: "projects" })}
          >
            View project details <FaArrowRight aria-hidden />
          </button>
        </div>
      </section>

      <section id="articles" data-scene-beat="articles" className="obs-chapter">
        <div className="obs-overlay obs-overlay-left">
          <p className="obs-kicker">Folio {ROMAN[5]} · Articles</p>
          <h2>Notes on frontend systems, CI/CD, and developer tooling.</h2>
          <div className="obs-article-list">
            {latestPosts.slice(0, 3).map((post, index) => (
              <TransitionLink key={post.slug} href={`/blog/${post.slug}`}>
                <span>0{index + 1}</span>
                <strong>{post.title}</strong>
                <small>{post.readingTime}</small>
              </TransitionLink>
            ))}
          </div>
          <TransitionLink className="obs-primary" href="/blog">
            Browse all articles <FaArrowRight aria-hidden />
          </TransitionLink>
        </div>
      </section>

      <section id="books" data-scene-beat="books" className="obs-chapter">
        <div className="obs-overlay obs-overlay-right">
          <p className="obs-kicker">Folio {ROMAN[6]} · Books</p>
          <h2>Practical guides for frontend engineers.</h2>
          <div className="obs-book-shelf">
            {products.map((product, index) => (
              <a
                key={product.title}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>0{index + 1}</span>
                <strong>{product.title}</strong>
                <small>{product.stats} ↗</small>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        data-scene-beat="testimonials"
        className="obs-chapter"
      >
        <div className="obs-overlay obs-overlay-left">
          <p className="obs-kicker">Folio {ROMAN[7]} · Testimonials</p>
          <h2>Feedback from engineers and leaders I’ve worked with.</h2>
          <div className="obs-voices">
            {testimonials.slice(0, 2).map((testimonial) => (
              <blockquote key={testimonial.name}>
                <p>“{testimonial.testimonial}”</p>
                <footer>
                  {testimonial.name} · {testimonial.role}, {testimonial.company}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        data-scene-beat="contact"
        className="obs-chapter obs-contact"
      >
        <div className="obs-contact-copy">
          <p className="obs-kicker">Folio {ROMAN[8]} · Contact</p>
          <h2>Let’s talk about frontend infrastructure.</h2>
          <a className="obs-email" href="mailto:rgndunes@gmail.com">
            rgndunes@gmail.com
          </a>
          <div className="obs-socials">
            <a
              href="https://github.com/RgnDunes"
              target="_blank"
              rel="me noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/rgndunes"
              target="_blank"
              rel="me noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/rgndunes"
              target="_blank"
              rel="me noopener noreferrer"
            >
              X / Twitter
            </a>
            <a
              href="https://www.youtube.com/@rgndunes"
              target="_blank"
              rel="me noopener noreferrer"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>

      {drawer && (
        <DetailDrawer
          eyebrow={drawer.eyebrow}
          onClose={closePanel}
          open={panel !== null}
          title={drawer.title}
        >
          {drawer.content}
        </DetailDrawer>
      )}
    </main>
  );
}
