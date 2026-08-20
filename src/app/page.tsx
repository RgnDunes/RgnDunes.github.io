import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import DigitalProducts from "@/components/sections/DigitalProducts";
import Articles from "@/components/sections/Articles";
import LatestBlog from "@/components/sections/LatestBlog";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/Marquee";
import SectionOrnament from "@/components/SectionOrnament";
import HomeShell from "@/components/HomeShell";
import { SITE, SITE_URL } from "@/lib/site";
import { blogPosts } from "@/data/blogPosts";

function homePageJsonLd() {
  const url = `${SITE_URL}/`;
  const latest = [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
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
        <main className="relative">
          <Hero />
          <About />
          <Marquee />
          <Experience />
          <SectionOrnament index={0} />
          <Skills />
          <SectionOrnament index={1} />
          <Projects />
          <DigitalProducts />
          <SectionOrnament index={2} />
          <Articles />
          <LatestBlog />
          <SectionOrnament index={0} />
          <Testimonials />
          <Contact />
        </main>
      </HomeShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
