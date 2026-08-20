import { blogPosts } from "@/data/blogPosts";
import type { Metadata } from "next";
import BlogPageClient from "./page-client";
import { SITE, SITE_URL } from "@/lib/site";

// SEO-optimal title <=60 chars.
const title = "Engineering Diaries — Essays on Frontend & CI/CD";
const description =
  "Long-form essays by Divyansh Singh on frontend engineering, React internals, Node.js, CI/CD pipelines, developer tooling, and building at scale.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "engineering blog",
    "frontend engineering",
    "React",
    "Node.js",
    "CI/CD",
    "system design",
    "developer tooling",
    "Divyansh Singh",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName: SITE.siteName,
    locale: SITE.locale,
    title,
    description,
    images: [
      {
        url: SITE.ogDefault,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter.site,
    creator: SITE.twitter.creator,
    title,
    description,
    images: [SITE.ogDefault],
  },
};

function blogJsonLd(posts: typeof blogPosts) {
  const blogUrl = `${SITE_URL}/blog`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": blogUrl,
      url: blogUrl,
      name: title,
      description,
      inLanguage: SITE.language,
      publisher: { "@id": `${SITE_URL}#person` },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${p.slug}#article`,
        headline: p.title,
        description: p.description,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.publishedAt,
        dateModified: p.publishedAt,
        image: {
          "@type": "ImageObject",
          url: SITE.ogDefault,
          width: 1200,
          height: 630,
        },
        author: { "@id": `${SITE_URL}#person` },
        publisher: { "@id": `${SITE_URL}#publisher` },
        keywords: p.tags.join(", "),
      })),
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
          item: blogUrl,
        },
      ],
    },
  ];
}

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const jsonLd = blogJsonLd(sortedPosts);

  return (
    <>
      <BlogPageClient posts={sortedPosts} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
