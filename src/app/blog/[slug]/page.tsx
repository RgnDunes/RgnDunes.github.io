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

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author.name, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.siteName,
      locale: SITE.locale,
      title: post.title,
      description: post.description,
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
      description: post.description,
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
  } catch {
    return "";
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
  return html.trim();
}

function articleJsonLd(post: (typeof blogPosts)[number]) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage
    ? absoluteUrl(post.coverImage)
    : SITE.ogDefault;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: post.title,
      description: post.description,
      image: [image],
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: {
        "@type": "Person",
        "@id": `${SITE_URL}#person`,
        name: post.author.name,
        url: SITE_URL,
      },
      publisher: { "@id": `${SITE_URL}#person` },
      keywords: post.tags.join(", "),
      articleSection: post.tags[0],
      inLanguage: SITE.language,
      url,
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

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const raw = readArticleHtml(post.contentPath);
  const bodyHtml = normaliseArticleHtml(raw);
  const jsonLd = articleJsonLd(post);
  const publishedDate = new Date(post.publishedAt);
  const publishedLabel = publishedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
              className="rounded-sm bg-rule px-3 py-1 font-mono text-xs uppercase tracking-wider text-gray-600 transition-colors hover:text-ink"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-medium text-orange-500 hover:text-orange-500/80 transition-colors"
          >
            ← Read more articles
          </Link>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
