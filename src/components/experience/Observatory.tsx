"use client";

import Image from "next/image";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import { experiences } from "@/data/experience";
import { skillCategories } from "@/data/skills";
import { projects } from "@/data/projects";
import { products } from "@/data/products";
import { blogPosts } from "@/data/blogPosts";
import { testimonials } from "@/data/testimonials";
import TransitionLink from "@/components/transitions/TransitionLink";

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
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
        <div className="obs-scene-markers" aria-hidden="true">
          {WORK_BEATS.map((beat, index) => (
            <span
              key={beat}
              data-scene-beat={beat}
              style={{ top: `${12 + index * 12}%` }}
            />
          ))}
        </div>
        <header className="obs-work-intro">
          <p className="obs-kicker">Folio {ROMAN[2]} · Work experience</p>
          <h2>Where I’ve worked and what I delivered.</h2>
        </header>
        <div className="obs-work-grid">
          {experiences.map((experience, index) => (
            <article
              key={experience.company}
              className={`obs-role-card ${index < 2 ? "obs-role-featured" : ""}`}
              data-scene-pulse
            >
              <header className="obs-role-head">
                <div className="obs-company-logo">
                  <Image
                    src={experience.logo}
                    alt={`${experience.company} logo`}
                    sizes="56px"
                    loading="eager"
                  />
                </div>
                <div>
                  <p className="obs-kicker">{experience.duration}</p>
                  <h3>{experience.company}</h3>
                </div>
                <span className="obs-role-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </header>
              <strong>{experience.position}</strong>
              <p>{experience.description}</p>
              {experience.previousRoles && (
                <div className="obs-previous-roles">
                  {experience.previousRoles.map((role) => (
                    <div key={role.position}>
                      <span>{role.position}</span>
                      <small>{role.duration}</small>
                    </div>
                  ))}
                </div>
              )}
              {experience.achievements && (
                <ul className="obs-role-highlights">
                  {experience.achievements.slice(0, 3).map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
              <div className="obs-tags">
                {experience.technologies?.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="skills"
        data-scene-beat="skills"
        className="obs-chapter obs-dense-chapter"
      >
        <div className="obs-section-content">
          <p className="obs-kicker">Folio {ROMAN[3]} · Skills</p>
          <h2>Technologies I use across frontend and infrastructure.</h2>
          <div className="obs-skill-grid">
            {skillCategories.map((category) => (
              <section key={category.name}>
                <h3>{category.name}</h3>
                <ul>
                  {category.skills.map((skill) => (
                    <li key={skill.name}>
                      <Image src={skill.image} alt="" sizes="28px" />
                      <span>{skill.name}</span>
                      <small>{skill.experience}</small>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section
        id="notebook"
        data-scene-beat="notebook"
        className="obs-chapter obs-dense-chapter"
      >
        <div className="obs-section-content">
          <p className="obs-kicker">Folio {ROMAN[4]} · Projects</p>
          <h2>Open-source tools and products I’ve built.</h2>
          <div className="obs-project-grid">
            {projects.map((project) => (
              <article key={project.title}>
                <Image src={project.image} alt="" sizes="56px" />
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
        className="obs-chapter obs-dense-chapter"
      >
        <div className="obs-section-content">
          <p className="obs-kicker">Folio {ROMAN[7]} · Testimonials</p>
          <h2>Feedback from engineers and leaders I’ve worked with.</h2>
          <div className="obs-voices">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name}>
                <p>“{testimonial.testimonial}”</p>
                <footer>
                  <a
                    className="obs-voice-author"
                    href={testimonial.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="obs-voice-portrait">
                      <Image
                        src={testimonial.image}
                        alt={`Portrait of ${testimonial.name}`}
                        sizes="44px"
                      />
                    </span>
                    <span>
                      <strong>{testimonial.name}</strong>
                      <small>
                        {testimonial.role} · {testimonial.company}
                      </small>
                    </span>
                  </a>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section
        id="personal"
        data-scene-beat="personal"
        className="obs-chapter obs-personal"
      >
        <div className="obs-personal-layout">
          <figure className="obs-ride-photo">
            <Image
              src="/assets/divyansh-motorcycle-ride.jpeg"
              alt="Divyansh's motorcycle packed for a long ride"
              fill
              sizes="(max-width: 767px) 100vw, 44vw"
            />
            <figcaption>
              My motorcycle · Ready for the next long ride
            </figcaption>
          </figure>

          <div className="obs-personal-copy">
            <p className="obs-kicker">Folio {ROMAN[8]} · Outside engineering</p>
            <h2>What keeps me curious away from work.</h2>
            <p className="obs-lede">
              Long rides, cosmic questions, cinematic worlds, and making videos
              keep me curious outside engineering.
            </p>

            <div className="obs-visual-clues" aria-hidden="true">
              <div className="obs-energy-core">
                <span />
                <span />
              </div>
              <svg
                className="obs-timeline-mark"
                viewBox="0 0 180 120"
                fill="none"
              >
                <path d="M90 116V53" />
                <path d="M90 89C67 80 54 64 48 43C37 51 26 53 10 50" />
                <path d="M90 75C114 66 127 47 130 24C143 34 156 36 173 30" />
                <path d="M90 61C76 49 71 34 73 9" />
                <path d="M90 53C104 43 111 29 111 8" />
                <circle cx="10" cy="50" r="3" />
                <circle cx="73" cy="9" r="3" />
                <circle cx="111" cy="8" r="3" />
                <circle cx="173" cy="30" r="3" />
              </svg>
              <div className="obs-pulsar-mark">
                <span />
                <span />
              </div>
            </div>

            <a
              className="obs-youtube-link"
              href="https://www.youtube.com/@rgndunes"
              target="_blank"
              rel="me noopener noreferrer"
            >
              Watch on YouTube <span>@rgndunes</span>
              <FaExternalLinkAlt aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <section
        id="contact"
        data-scene-beat="contact"
        className="obs-chapter obs-contact"
      >
        <div className="obs-contact-copy">
          <p className="obs-kicker">Folio {ROMAN[9]} · Contact</p>
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
    </main>
  );
}
