import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogPosts";
import { SITE_URL } from "@/lib/site";

// Static-export note: Next 14 requires this signature; no runtime IO.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const postEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: post.featured ? 0.85 : 0.75,
  }));

  return [...staticEntries, ...postEntries];
}
