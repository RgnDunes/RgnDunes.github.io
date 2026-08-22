import HomeShell from "@/components/HomeShell";
import Observatory from "@/components/experience/Observatory";
import { SITE, SITE_URL } from "@/lib/site";
import { blogPosts } from "@/data/blogPosts";

function homePageJsonLd() {
  const url = `${SITE_URL}/`;
  const latest = [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 6);
  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url,
      inLanguage: SITE.language,
      mainEntity: { "@id": `${SITE_URL}#person` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Latest essays",
      itemListElement: latest.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  ];
}

export default function Home() {
  const jsonLd = homePageJsonLd();
  return (
    <>
      <HomeShell>
        <Observatory />
      </HomeShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
