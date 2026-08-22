"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import { experiences } from "@/data/experience";
import { skillCategories } from "@/data/skills";
import { projects } from "@/data/projects";
import { products } from "@/data/products";
import { blogPosts } from "@/data/blogPosts";
import { testimonials } from "@/data/testimonials";
import DetailDrawer from "./DetailDrawer";

type Panel =
  | { kind: "work"; index: number }
  | { kind: "skills" }
  | { kind: "projects" }
  | { kind: "archive" }
  | null;

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii"];
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
        eyebrow: "System inventory",
        title: "Instruments of the trade",
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
        eyebrow: "Selected deployments",
        title: "Open-source and independent work",
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

    return {
      eyebrow: "Field notes · editions · witnesses",
      title: "The archive",
      content: (
        <>
          <section className="obs-archive-group">
            <h3>Books</h3>
            {products.map((product) => (
              <a
                key={product.title}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{product.title}</span>
                <small>{product.stats}</small>
              </a>
            ))}
          </section>
          <section className="obs-archive-group">
            <h3>Latest writing</h3>
            {latestPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <span>{post.title}</span>
                <small>{post.readingTime}</small>
              </Link>
            ))}
            <Link className="obs-inline-cta" href="/blog">
              Read all essays <FaArrowRight aria-hidden />
            </Link>
          </section>
          <section className="obs-archive-group">
            <h3>Kind words</h3>
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name}>
                <p>“{testimonial.testimonial}”</p>
                <footer>
                  {testimonial.name} · {testimonial.company}
                </footer>
              </blockquote>
            ))}
          </section>
        </>
      ),
    };
  }, [activeExperience, panel]);

  return (
    <main className="observatory">
      <div className="obs-vignette" aria-hidden />

      <section id="top" data-scene-beat="top" className="obs-chapter obs-hero">
        <div className="obs-overlay obs-overlay-left">
          <p className="obs-kicker">
            Folio {ROMAN[0]} · Bengaluru / 12.9716° N
          </p>
          <h1>
            I build the systems
            <span>behind the screen.</span>
          </h1>
          <p className="obs-lede">
            Divyansh Singh builds frontend infrastructure, developer tooling,
            and CI/CD systems at Rippling.
          </p>
          <div className="obs-actions">
            <a href="#about" className="obs-primary">
              Enter the observatory <FaArrowRight aria-hidden />
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
          <p className="obs-kicker">
            Folio {ROMAN[1]} · The operating principle
          </p>
          <h2>Make complex systems feel uneventful.</h2>
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
          <p className="obs-kicker">Folio {ROMAN[2]} · Signal history</p>
          <h2>Seven stops through the systems I helped shape.</h2>
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
                Read the record <FaArrowRight aria-hidden />
              </button>
            </div>
          </article>
        ))}
      </section>

      <section id="skills" data-scene-beat="skills" className="obs-chapter">
        <div className="obs-overlay obs-overlay-left">
          <p className="obs-kicker">Folio {ROMAN[3]} · System inventory</p>
          <h2>Tools arranged by the problems they solve.</h2>
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
            Inspect all instruments <FaArrowRight aria-hidden />
          </button>
        </div>
      </section>

      <section id="notebook" data-scene-beat="notebook" className="obs-chapter">
        <div className="obs-overlay obs-overlay-right">
          <p className="obs-kicker">Folio {ROMAN[4]} · Selected deployments</p>
          <h2>Small products built around recurring friction.</h2>
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
            Open project telemetry <FaArrowRight aria-hidden />
          </button>
        </div>
      </section>

      <section id="archive" data-scene-beat="archive" className="obs-chapter">
        <span id="products" className="obs-anchor" />
        <span id="writing" className="obs-anchor obs-anchor-mid" />
        <span id="testimonials" className="obs-anchor obs-anchor-end" />
        <div className="obs-overlay obs-overlay-left">
          <p className="obs-kicker">Folio {ROMAN[5]} · The quiet archive</p>
          <h2>What I’ve written, taught, and left in print.</h2>
          <p className="obs-feature-label">Latest dispatch</p>
          <Link
            className="obs-feature-link"
            href={`/blog/${latestPosts[0].slug}`}
          >
            {latestPosts[0].title} <FaArrowRight aria-hidden />
          </Link>
          <div className="obs-archive-stats">
            <span>
              <b>{products.length}</b> books
            </span>
            <span>
              <b>{blogPosts.length}</b> essays
            </span>
            <span>
              <b>{testimonials.length}</b> witnesses
            </span>
          </div>
          <button
            className="obs-primary"
            onClick={() => setPanel({ kind: "archive" })}
          >
            Enter the archive <FaArrowRight aria-hidden />
          </button>
        </div>
      </section>

      <section
        id="contact"
        data-scene-beat="contact"
        className="obs-chapter obs-contact"
      >
        <div className="obs-contact-copy">
          <p className="obs-kicker">Folio {ROMAN[6]} · End of transmission</p>
          <h2>Have a difficult system problem?</h2>
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

      <DetailDrawer
        eyebrow={drawer.eyebrow}
        onClose={closePanel}
        open={panel !== null}
        title={drawer.title}
      >
        {drawer.content}
      </DetailDrawer>
    </main>
  );
}
