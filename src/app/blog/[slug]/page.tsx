import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blogPosts";
import ViewCounter from "@/components/ViewCounter";
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
      `Blog article body file is missing: ${abs}. Referenced from src/data/blogPosts.ts.`
    );
  }
}

/**
 * Strip the outer <html>/<head>/<body> so we only inline the article's
 * body. Some articles were authored as full documents; some as fragments.
 * Also strips <script>/<style> and <title>/<meta> for safety.
 */
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
  // The article page template already renders the post title in an <h1>;
  // the article body sometimes repeats it in its own <h1>. Demote any
  // <h1>s inside the body to <h2> so there is exactly one <h1> per page.
  html = html.replace(/<h1(\s[^>]*)?>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");
  // Any external <a href="http…"> without rel gets rel=noopener + target=_blank
  // so click targets are safe and Google isn't fed link-equity leaks.
  html = html.replace(/<a\s+([^>]*href=["']https?:[^"']+["'][^>]*)>/gi, (m, attrs) => {
    let out = attrs;
    if (!/\brel=/i.test(out)) out = `${out} rel="noopener noreferrer"`;
    if (!/\btarget=/i.test(out)) out = `${out} target="_blank"`;
    return `<a ${out}>`;
  });
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

function articleJsonLd(
  post: (typeof blogPosts)[number],
  bodyHtml: string
) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage
    ? absoluteUrl(post.coverImage)
    : SITE.ogDefault;
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
  limit = 3
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
          new Date(a.post.publishedAt).getTime()
    )
    .slice(0, limit)
    .map((r) => r.post);
}

function findPrevNext(
  post: (typeof blogPosts)[number],
  all: typeof blogPosts
) {
  const sorted = [...all].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
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
    <div className="min-h-screen bg-white">
      <div className="border-b border-ink bg-ink py-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-paper">
        Engineering Diaries
      </div>

      <article className="mx-auto max-w-[860px] px-8 py-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-800 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-gray-400">
              /
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:text-gray-800 transition-colors"
              >
                Blog
              </Link>
            </li>
            <li aria-hidden className="text-gray-400">
              /
            </li>
            <li className="text-gray-800" aria-current="page">
              {post.title.length > 60
                ? `${post.title.slice(0, 60)}…`
                : post.title}
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl leading-tight text-ink md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-700 md:text-xl">
            {post.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 font-mono text-xs uppercase tracking-[0.12em] text-gray-600">
            <span>By {post.author.name}</span>
            <span className="h-1 w-1 rounded-full bg-rule" aria-hidden />
            <time dateTime={post.publishedAt}>{publishedLabel}</time>
            <span className="h-1 w-1 rounded-full bg-rule" aria-hidden />
            <span>{post.readingTime}</span>
            <span className="h-1 w-1 rounded-full bg-rule" aria-hidden />
            <ViewCounter pageId={`blog-${post.slug}`} showLabel={false} />
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <div
          className="mt-16 text-center text-2xl tracking-[0.5em] text-gray-600"
          aria-hidden
        >
          · · ·
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              rel="nofollow"
              className="rounded-sm bg-rule px-3 py-1 font-mono text-xs uppercase tracking-wider text-gray-600 transition-colors hover:text-ink"
            >
              {tag}
            </Link>
          ))}
        </div>

        {related.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="mt-16 border-t border-gray-200 pt-10"
          >
            <h2
              id="related-heading"
              className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-gray-600"
            >
              Related essays
            </h2>
            <ul className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="group block">
                    <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.15em] text-gray-500">
                      {r.tags.slice(0, 2).join(" · ")}
                    </div>
                    <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-orange-500">
                      {r.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-700">
                      {r.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav
          aria-label="Post navigation"
          className="mt-12 grid gap-6 border-t border-gray-200 pt-10 md:grid-cols-2"
        >
          {older ? (
            <Link
              rel="prev"
              href={`/blog/${older.slug}`}
              className="group block"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gray-500">
                ← Older essay
              </span>
              <span className="mt-2 block font-display text-base leading-snug text-ink transition-colors group-hover:text-orange-500">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link
              rel="next"
              href={`/blog/${newer.slug}`}
              className="group block md:text-right"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gray-500">
                Newer essay →
              </span>
              <span className="mt-2 block font-display text-base leading-snug text-ink transition-colors group-hover:text-orange-500">
                {newer.title}
              </span>
            </Link>
          ) : null}
        </nav>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-medium text-orange-500 hover:text-orange-500/80 transition-colors"
          >
            ← Read more articles
          </Link>
        </div>
      </article>

      {older && (
        <link rel="prev" href={`${SITE_URL}/blog/${older.slug}`} />
      )}
      {newer && (
        <link rel="next" href={`${SITE_URL}/blog/${newer.slug}`} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
