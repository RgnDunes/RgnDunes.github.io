import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blogPosts";
import ViewCounter from "@/components/ViewCounter";
import ObservatoryInterior from "@/components/blog/ObservatoryInterior";
import TransitionLink from "@/components/transitions/TransitionLink";
import { SITE, SITE_URL, absoluteUrl } from "@/lib/site";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// SEO-optimal title length is <= 60 chars (Google truncates around there
// on desktop, ~50 on mobile). Descriptions render best at 140-160 chars.
function seoTitle(raw: string, brand = "Divyansh Singh", maxLen = 65): string {
  const bare = raw.replace(/[.!?]$/g, "").trim();
  if (bare.length + 3 + brand.length <= maxLen) return `${bare} · ${brand}`;
  // Try to cut on the first hard punctuation.
  const cutIdx = bare.search(/[.:?!—-]\s/);
  const shortened =
    cutIdx > 15 && cutIdx < maxLen - brand.length - 5
      ? bare.slice(0, cutIdx)
      : bare;
  const budget = maxLen - brand.length - 3;
  if (shortened.length <= budget) return `${shortened} · ${brand}`;
  return `${shortened.slice(0, budget - 1).trimEnd()}… · ${brand}`;
}

function seoDescription(raw: string, maxLen = 160): string {
  const one = raw.replace(/\s+/g, " ").trim();
  if (one.length <= maxLen) return one;
  // Prefer to cut at the first sentence boundary within budget.
  const slice = one.slice(0, maxLen);
  const sentenceEnd = slice.search(/[.!?](?:\s|$)/);
  if (sentenceEnd >= 80) {
    return one.slice(0, sentenceEnd + 1);
  }
  // Fall back to last word boundary.
  const cut = slice.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 100 ? lastSpace : cut.length).trimEnd()}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const url = `/blog/${post.slug}`;
  const ogImage = post.coverImage
    ? absoluteUrl(post.coverImage)
    : SITE.ogDefault;
  const title = seoTitle(post.title);
  const description = seoDescription(post.description);

  return {
    title: { absolute: title },
    description,
    keywords: post.tags,
    authors: [{ name: post.author.name, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.siteName,
      locale: SITE.locale,
      title: post.title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [SITE_URL],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter.site,
      creator: SITE.twitter.creator,
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

function readArticleHtml(contentPath: string | undefined): string {
  if (!contentPath) return "";
  // contentPath is like "/blog/foo_article.html" — resolve inside /public.
  const cleaned = contentPath.split("?")[0];
  const abs = path.join(process.cwd(), "public", cleaned);
  try {
    return fs.readFileSync(abs, "utf8");
  } catch (e) {
    // Fail the build loudly rather than silently shipping empty article
    // shells — an empty article page is worse for SEO than a build error.
    throw new Error(
      `Blog article body file is missing: ${abs}. Referenced from src/data/blogPosts.ts.`,
    );
  }
}

/**
 * Strip the outer <html>/<head>/<body> so we only inline the article's
 * body. Some articles were authored as full documents; some as fragments.
 * Also strips <script>/<style> and <title>/<meta> for safety.
 */
/**
 * Strip a top-level element by class name (removes the wrapper div plus
 * everything inside it, brace-matched by tag depth).
 */
function stripByClass(html: string, className: string): string {
  const re = new RegExp(
    `<(div|section|header|nav|footer)\\s[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`,
    "i",
  );
  let out = html;
  let m: RegExpExecArray | null;
  while ((m = re.exec(out))) {
    const openTag = m[1];
    const start = m.index;
    // Walk forward, tracking open/close of the same tag to find the match.
    const tagOpen = new RegExp(`<${openTag}\\b`, "gi");
    const tagClose = new RegExp(`</${openTag}\\s*>`, "gi");
    tagOpen.lastIndex = start + 1;
    tagClose.lastIndex = start;
    let depth = 1;
    let cursor = start + m[0].length;
    while (depth > 0) {
      tagOpen.lastIndex = cursor;
      tagClose.lastIndex = cursor;
      const nextOpen = tagOpen.exec(out);
      const nextClose = tagClose.exec(out);
      if (!nextClose) break;
      if (nextOpen && nextOpen.index < nextClose.index) {
        depth++;
        cursor = nextOpen.index + nextOpen[0].length;
      } else {
        depth--;
        cursor = nextClose.index + nextClose[0].length;
      }
    }
    out = out.slice(0, start) + out.slice(cursor);
  }
  return out;
}

function normaliseArticleHtml(raw: string): string {
  if (!raw) return "";
  let html = raw;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) html = bodyMatch[1];
  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, "")
    .replace(/<meta[\s\S]*?>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "");
  // The article ships its own top-block ("hero", "masthead", "byline",
  // "tag" list, "cover-image-wrap") — we render an equivalent header in
  // React, so remove those to avoid duplication.
  html = stripByClass(html, "masthead");
  html = stripByClass(html, "hero");
  html = stripByClass(html, "byline");
  html = stripByClass(html, "cover-image-wrap");
  html = stripByClass(html, "cover-image");
  // Strip the article's own inline tag pills (we render our own).
  html = html.replace(
    /<(div|nav|ul|p)[^>]*class=["'][^"']*\btags?\b[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,
    "",
  );
  // The article page template already renders the post title in an <h1>;
  // some body variants repeat it. Demote any residual <h1>s to <h2>.
  html = html
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>");
  // External <a href="http…"> without rel gets rel=noopener + target=_blank
  // so click targets are safe and Google isn't fed link-equity leaks.
  html = html.replace(
    /<a\s+([^>]*href=["']https?:[^"']+["'][^>]*)>/gi,
    (m, attrs) => {
      let out = attrs;
      if (!/\brel=/i.test(out)) out = `${out} rel="noopener noreferrer"`;
      if (!/\btarget=/i.test(out)) out = `${out} target="_blank"`;
      return `<a ${out}>`;
    },
  );
  return html.trim();
}

function readingTimeToISO(rt: string): string {
  // "~13 min read" → "PT13M"
  const m = rt && rt.match(/(\d+)\s*min/i);
  return m ? `PT${m[1]}M` : "PT5M";
}

function bodyToPlain(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function articleJsonLd(post: (typeof blogPosts)[number], bodyHtml: string) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage ? absoluteUrl(post.coverImage) : SITE.ogDefault;
  const imageObj = {
    "@type": "ImageObject",
    url: image,
    width: 1200,
    height: 630,
  };
  const plain = bodyToPlain(bodyHtml);
  const wordCount = plain ? plain.split(" ").filter(Boolean).length : 0;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: post.title,
      description: post.description,
      image: [imageObj],
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: { "@id": `${SITE_URL}#person` },
      publisher: { "@id": `${SITE_URL}#publisher` },
      keywords: post.tags.join(", "),
      articleSection: post.tags[0],
      inLanguage: SITE.language,
      url,
      wordCount,
      timeRequired: readingTimeToISO(post.readingTime),
      articleBody: plain.slice(0, 5000),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "header p"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: url,
        },
      ],
    },
  ];
}

function findRelated(
  post: (typeof blogPosts)[number],
  all: typeof blogPosts,
  limit = 3,
) {
  const tagSet = new Set(post.tags);
  return all
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      overlap: p.tags.filter((t) => tagSet.has(t)).length,
    }))
    .filter((r) => r.overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        new Date(b.post.publishedAt).getTime() -
          new Date(a.post.publishedAt).getTime(),
    )
    .slice(0, limit)
    .map((r) => r.post);
}

function findPrevNext(post: (typeof blogPosts)[number], all: typeof blogPosts) {
  const sorted = [...all].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const idx = sorted.findIndex((p) => p.slug === post.slug);
  return {
    newer: idx > 0 ? sorted[idx - 1] : null,
    older: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const raw = readArticleHtml(post.contentPath);
  const bodyHtml = normaliseArticleHtml(raw);
  const jsonLd = articleJsonLd(post, bodyHtml);
  const publishedDate = new Date(post.publishedAt);
  const publishedLabel = publishedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const related = findRelated(post, blogPosts, 3);
  const { newer, older } = findPrevNext(post, blogPosts);

  return (
    <ObservatoryInterior>
      <div className="obs-reading-shell min-h-screen text-ink-2">
        {/* Editorial masthead — thin ink bar, matches the notebook identity */}
        <div className="border-b border-rule bg-ink py-3 text-center font-mono text-[10.5px] uppercase tracking-[0.28em] text-paper/90">
          Engineering Diaries · {post.tags[0]}
        </div>

        <article className="obs-reading-plane mx-auto max-w-[760px] px-5 pb-24 pt-10 md:px-10 md:pt-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
              <li>
                <TransitionLink
                  href="/"
                  className="hover:text-ink transition-colors"
                >
                  Home
                </TransitionLink>
              </li>
              <li aria-hidden className="text-rule">
                ·
              </li>
              <li>
                <TransitionLink
                  href="/blog"
                  className="hover:text-ink transition-colors"
                >
                  Blog
                </TransitionLink>
              </li>
              <li aria-hidden className="text-rule">
                ·
              </li>
              <li className="text-ink" aria-current="page">
                {post.title.length > 60
                  ? `${post.title.slice(0, 60)}…`
                  : post.title}
              </li>
            </ol>
          </nav>

          {/* Article header — folio numeral, title, dek, byline strip */}
          <header className="mb-12">
            <div className="mb-6 flex items-baseline gap-4">
              <span className="folio text-4xl md:text-5xl">§</span>
              <div className="eyebrow">{post.tags.slice(0, 3).join(" · ")}</div>
            </div>
            <h1 className="font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-ink md:text-[3rem] lg:text-[3.5rem]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[60ch] font-body text-lg leading-[1.55] text-ink-2 md:text-xl">
              {post.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-rule py-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
              <span>
                By <span className="text-ink">{post.author.name}</span>
              </span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-rule" />
              <time dateTime={post.publishedAt} className="text-ink-2">
                {publishedLabel}
              </time>
              <span aria-hidden className="h-1 w-1 rounded-full bg-rule" />
              <span>{post.readingTime}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-rule" />
              <ViewCounter pageId={`blog-${post.slug}`} showLabel={false} />
            </div>
          </header>

          {/* Article body — prose-notebook applies typography via globals.css */}
          <div
            className="prose prose-notebook max-w-none"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* Fleuron divider */}
          <div
            className="mt-16 text-center font-display text-2xl italic tracking-[0.4em] text-saffron/50"
            aria-hidden
          >
            · · ·
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                rel="nofollow"
                className="chip"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Related essays */}
          {related.length > 0 && (
            <section
              aria-labelledby="related-heading"
              className="mt-20 border-t border-rule pt-10"
            >
              <h2
                id="related-heading"
                className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted"
              >
                Related essays
              </h2>
              <ul className="grid gap-8 md:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <TransitionLink
                      href={`/blog/${r.slug}`}
                      className="group block"
                    >
                      <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-saffron">
                        {r.tags.slice(0, 2).join(" · ")}
                      </div>
                      <h3 className="font-display text-[17px] leading-snug text-ink transition-colors group-hover:text-saffron">
                        {r.title}
                      </h3>
                      <p className="mt-2 clamp-3 text-sm leading-[1.55] text-ink-2">
                        {r.description}
                      </p>
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Prev/next navigation */}
          <nav
            aria-label="Post navigation"
            className="mt-16 grid gap-6 border-t border-rule pt-10 md:grid-cols-2"
          >
            {older ? (
              <TransitionLink
                rel="prev"
                href={`/blog/${older.slug}`}
                className="group block"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  ← Older essay
                </span>
                <span className="mt-2 block font-display text-[17px] leading-snug text-ink transition-colors group-hover:text-saffron">
                  {older.title}
                </span>
              </TransitionLink>
            ) : (
              <span />
            )}
            {newer ? (
              <TransitionLink
                rel="next"
                href={`/blog/${newer.slug}`}
                className="group block md:text-right"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  Newer essay →
                </span>
                <span className="mt-2 block font-display text-[17px] leading-snug text-ink transition-colors group-hover:text-saffron">
                  {newer.title}
                </span>
              </TransitionLink>
            ) : null}
          </nav>

          {/* Back link */}
          <div className="mt-16 flex justify-center border-t border-rule pt-10">
            <TransitionLink
              href="/blog"
              className="link-quiet font-mono text-[11px] uppercase tracking-[0.22em]"
            >
              ← Return to the full archive
            </TransitionLink>
          </div>
        </article>

        {older && <link rel="prev" href={`${SITE_URL}/blog/${older.slug}`} />}
        {newer && <link rel="next" href={`${SITE_URL}/blog/${newer.slug}`} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </ObservatoryInterior>
  );
}
