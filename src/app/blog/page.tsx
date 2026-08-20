import { blogPosts } from "@/data/blogPosts";
import type { Metadata } from "next";
import BlogPageClient from "./page-client";
import { SITE, SITE_URL } from "@/lib/site";

const title =
  "Engineering Diaries — Essays on Frontend, CI/CD, React & Web Infrastructure";
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
      blogPost: posts.slice(0, 20).map((p) => ({
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${p.slug}`,
        headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.publishedAt,
        author: { "@id": `${SITE_URL}#person` },
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
