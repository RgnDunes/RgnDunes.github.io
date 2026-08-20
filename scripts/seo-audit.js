#!/usr/bin/env node
/**
 * SEO metrics extractor. Walks /out, inspects every .html page, and
 * produces a JSON report + a readable score. Deliberately dependency-free
 * so it runs anywhere. Called with:
 *
 *   node scripts/seo-audit.js               # report to stdout
 *   node scripts/seo-audit.js --out foo.json
 */

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outFile = outIdx > -1 ? args[outIdx + 1] : null;
const summaryOnly = args.includes("--summary");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_next")) continue;
      walk(p, acc);
    } else if (entry.name.endsWith(".html")) {
      acc.push(p);
    }
  }
  return acc;
}

function extractOne(re, str, group = 1) {
  const m = str.match(re);
  return m ? m[group] : null;
}

function extractAll(re, str, group = 1) {
  const out = [];
  let m;
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((m = g.exec(str))) out.push(m[group]);
  return out;
}

function decode(s) {
  if (s == null) return s;
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function analyze(file) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(OUT_DIR, file);

  const title = decode(extractOne(/<title[^>]*>([\s\S]*?)<\/title>/i, html));
  const description = decode(
    extractOne(
      /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
      html
    )
  );
  const canonical = extractOne(
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i,
    html
  );
  const robots = extractOne(
    /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i,
    html
  );
  const ogTitle = decode(
    extractOne(
      /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i,
      html
    )
  );
  const ogDesc = decode(
    extractOne(
      /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i,
      html
    )
  );
  const ogImage = extractOne(
    /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i,
    html
  );
  const ogUrl = extractOne(
    /<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i,
    html
  );
  const ogType = extractOne(
    /<meta\s+property=["']og:type["']\s+content=["']([^"']*)["']/i,
    html
  );
  const ogSiteName = extractOne(
    /<meta\s+property=["']og:site_name["']\s+content=["']([^"']*)["']/i,
    html
  );
  const ogLocale = extractOne(
    /<meta\s+property=["']og:locale["']\s+content=["']([^"']*)["']/i,
    html
  );
  const twitterCard = extractOne(
    /<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i,
    html
  );
  const twitterImage = extractOne(
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']*)["']/i,
    html
  );
  const twitterSite = extractOne(
    /<meta\s+name=["']twitter:site["']\s+content=["']([^"']*)["']/i,
    html
  );
  const viewport = extractOne(
    /<meta\s+name=["']viewport["']\s+content=["']([^"']*)["']/i,
    html
  );
  const themeColor = extractOne(
    /<meta\s+name=["']theme-color["'][^>]*content=["']([^"']*)["']/i,
    html
  );
  const colorScheme = extractOne(
    /<meta\s+name=["']color-scheme["']\s+content=["']([^"']*)["']/i,
    html
  );
  const langAttr = extractOne(/<html[^>]*\slang=["']([^"']+)["']/i, html);
  const manifest = extractOne(
    /<link\s+rel=["']manifest["']\s+href=["']([^"']+)["']/i,
    html
  );
  const jsonLdCount = (html.match(/<script[^>]*application\/ld\+json/gi) || [])
    .length;
  const jsonLdTypes = extractAll(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
    html
  )
    .flatMap((body) => {
      try {
        const data = JSON.parse(body);
        return Array.isArray(data) ? data : [data];
      } catch {
        return [];
      }
    })
    .map((d) => d["@type"])
    .filter(Boolean);
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const h3Count = (html.match(/<h3[\s>]/gi) || []).length;
  const imgTags = extractAll(/<img\s+([^>]+)>/gi, html);
  const imgAltMissing = imgTags.filter((attrs) => !/(?:^|\s)alt=/i.test(attrs)).length;
  const externalLinks = extractAll(
    /<a\s+([^>]*href=["']https?:[^"']+["'][^>]*)>/gi,
    html
  );
  const externalWithoutRel = externalLinks.filter(
    (attrs) => !/\brel=["'][^"']*noopener/i.test(attrs)
  ).length;

  // Rough visible word count.
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = visible ? visible.split(" ").filter(Boolean).length : 0;

  return {
    file: rel,
    size: html.length,
    lang: langAttr,
    title,
    titleLen: title ? title.length : 0,
    description,
    descLen: description ? description.length : 0,
    canonical,
    robots,
    ogTitle,
    ogDesc,
    ogImage,
    ogUrl,
    ogType,
    ogSiteName,
    ogLocale,
    twitterCard,
    twitterImage,
    twitterSite,
    viewport,
    themeColor,
    colorScheme,
    manifest,
    jsonLdCount,
    jsonLdTypes,
    h1Count,
    h2Count,
    h3Count,
    imgTotal: imgTags.length,
    imgAltMissing,
    externalLinks: externalLinks.length,
    externalWithoutRel,
    wordCount,
  };
}

const CRITERIA = [
  { key: "title", desc: "<title> present", weight: 4, pass: (p) => !!p.title },
  { key: "titleLen", desc: "<title> length 20-70 chars", weight: 2, pass: (p) => p.titleLen >= 20 && p.titleLen <= 70 },
  { key: "description", desc: "meta description present", weight: 4, pass: (p) => !!p.description },
  { key: "descLen", desc: "description 80-170 chars", weight: 2, pass: (p) => p.descLen >= 80 && p.descLen <= 170 },
  { key: "canonical", desc: "canonical URL present", weight: 5, pass: (p) => !!p.canonical },
  { key: "canonicalAbs", desc: "canonical is absolute URL", weight: 2, pass: (p) => !!p.canonical && /^https?:\/\//.test(p.canonical) },
  { key: "og", desc: "og:title + og:description + og:image + og:url", weight: 5, pass: (p) => p.ogTitle && p.ogDesc && p.ogImage && p.ogUrl },
  { key: "ogAbs", desc: "og:image + og:url absolute", weight: 2, pass: (p) => p.ogImage && p.ogUrl && !/localhost/.test(p.ogUrl + p.ogImage) },
  { key: "ogSite", desc: "og:site_name + og:locale", weight: 1, pass: (p) => p.ogSiteName && p.ogLocale },
  { key: "twitter", desc: "twitter:card + twitter:image", weight: 3, pass: (p) => p.twitterCard && p.twitterImage },
  { key: "twitterLarge", desc: "twitter:card=summary_large_image", weight: 2, pass: (p) => p.twitterCard === "summary_large_image" },
  { key: "viewport", desc: "viewport meta present", weight: 1, pass: (p) => !!p.viewport },
  { key: "theme", desc: "theme-color present", weight: 1, pass: (p) => !!p.themeColor },
  { key: "colorScheme", desc: "color-scheme meta present", weight: 1, pass: (p) => !!p.colorScheme },
  { key: "lang", desc: "html lang attribute", weight: 2, pass: (p) => !!p.lang },
  { key: "manifest", desc: "manifest link", weight: 1, pass: (p) => !!p.manifest },
  { key: "jsonLd", desc: "JSON-LD present", weight: 5, pass: (p) => p.jsonLdCount > 0 },
  { key: "jsonLdTyped", desc: "JSON-LD has typed schemas", weight: 3, pass: (p) => p.jsonLdTypes.length > 0 },
  { key: "h1", desc: "exactly one <h1>", weight: 4, pass: (p) => p.h1Count === 1 },
  { key: "h2", desc: "at least one <h2>", weight: 2, pass: (p) => p.h2Count >= 1 },
  { key: "content", desc: "visible content >= 300 words", weight: 4, pass: (p) => p.wordCount >= 300, skipFor: (p) => /404|not-found/.test(p.file) },
  { key: "contentDeep", desc: "visible content >= 1000 words (long form)", weight: 2, pass: (p) => p.wordCount >= 1000 },
  { key: "imgAlt", desc: "all <img> have alt", weight: 2, pass: (p) => p.imgAltMissing === 0 },
  { key: "extRel", desc: "external links have rel=noopener", weight: 1, pass: (p) => p.externalWithoutRel === 0 },
  { key: "robots", desc: "meta robots present and coherent (indexable by default, noindex only on 404)", weight: 1, pass: (p) => {
      const is404 = /404|not-found/.test(p.file);
      if (is404) return !p.robots || /noindex/i.test(p.robots);
      return !p.robots || !/noindex/i.test(p.robots);
    } },
];

function scoreOne(p) {
  const isArticle = p.file.startsWith("blog/") && p.file !== "blog.html" && p.file !== "blog/index.html";
  const contribs = CRITERIA.map((c) => {
    if (c.key === "contentDeep" && !isArticle) return { ...c, applied: false, ok: null };
    if (c.skipFor && c.skipFor(p)) return { ...c, applied: false, ok: null };
    return { ...c, applied: true, ok: c.pass(p) };
  });
  const totalWeight = contribs.filter((c) => c.applied).reduce((s, c) => s + c.weight, 0);
  const passWeight = contribs.filter((c) => c.applied && c.ok).reduce((s, c) => s + c.weight, 0);
  const pct = Math.round((passWeight / totalWeight) * 1000) / 10;
  const fails = contribs.filter((c) => c.applied && !c.ok).map((c) => c.desc);
  return { pct, passWeight, totalWeight, fails };
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("out/ missing — run `npm run build` first.");
  process.exit(2);
}

const files = walk(OUT_DIR).sort();
const pages = files.map((f) => {
  const p = analyze(f);
  const s = scoreOne(p);
  return { ...p, score: s.pct, passWeight: s.passWeight, totalWeight: s.totalWeight, fails: s.fails };
});

// Site-level signals independent of any page.
const siteSignals = {
  sitemap: fs.existsSync(path.join(OUT_DIR, "sitemap.xml")),
  robotsTxt: fs.existsSync(path.join(OUT_DIR, "robots.txt")),
  robotsHasSitemap:
    fs.existsSync(path.join(OUT_DIR, "robots.txt")) &&
    /^\s*sitemap:/im.test(fs.readFileSync(path.join(OUT_DIR, "robots.txt"), "utf8")),
  manifestReal: (() => {
    const p = path.join(OUT_DIR, "manifest.json");
    if (!fs.existsSync(p)) return false;
    try {
      const m = JSON.parse(fs.readFileSync(p, "utf8"));
      return !/create react app|react app sample/i.test(JSON.stringify(m));
    } catch {
      return false;
    }
  })(),
  hasRss: fs.existsSync(path.join(OUT_DIR, "rss.xml")) || fs.existsSync(path.join(OUT_DIR, "feed.xml")),
  has404: fs.existsSync(path.join(OUT_DIR, "404.html")),
  noJekyll: fs.existsSync(path.join(OUT_DIR, ".nojekyll")),
};

const siteScore = (() => {
  const weights = {
    sitemap: 6, robotsTxt: 2, robotsHasSitemap: 4, manifestReal: 2, hasRss: 1, has404: 1, noJekyll: 1,
  };
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  let pass = 0;
  for (const [k, w] of Object.entries(weights)) if (siteSignals[k]) pass += w;
  return { total, pass, pct: Math.round((pass / total) * 1000) / 10 };
})();

const pageAvg = pages.length
  ? Math.round((pages.reduce((s, p) => s + p.score, 0) / pages.length) * 10) / 10
  : 0;

const overall = Math.round((pageAvg * 0.75 + siteScore.pct * 0.25) * 10) / 10;

const report = { generatedAt: new Date().toISOString(), overall, pageAvg, siteScore, siteSignals, pages };

if (outFile) fs.writeFileSync(outFile, JSON.stringify(report, null, 2));

if (summaryOnly) {
  console.log(`Overall SEO score: ${overall}/100`);
  console.log(`Page-avg: ${pageAvg}/100  ·  Site-level: ${siteScore.pct}/100`);
  console.log(`Pages analysed: ${pages.length}`);
  console.log(`Site signals: ${JSON.stringify(siteSignals)}`);
} else {
  console.log(`SEO audit — ${new Date().toISOString()}`);
  console.log(`Overall score: ${overall}/100`);
  console.log(`  Page average: ${pageAvg}/100`);
  console.log(`  Site-level:   ${siteScore.pct}/100  (${siteScore.pass}/${siteScore.total})`);
  console.log("");
  console.log("Site signals:");
  for (const [k, v] of Object.entries(siteSignals)) console.log(`  ${v ? "✓" : "✗"} ${k}`);
  console.log("");
  console.log(`Pages analysed: ${pages.length}`);
  console.log("");

  // Top 5 worst pages.
  const worst = [...pages].sort((a, b) => a.score - b.score).slice(0, 5);
  console.log("Worst 5 pages:");
  for (const p of worst) {
    console.log(`  ${p.score}/100 — ${p.file}  (${p.wordCount} words, ${p.jsonLdCount} json-ld, h1=${p.h1Count})`);
    for (const f of p.fails.slice(0, 4)) console.log(`     · ${f}`);
  }
  console.log("");
  // Bucket distribution.
  const buckets = { "90+": 0, "70-89": 0, "50-69": 0, "<50": 0 };
  for (const p of pages) {
    if (p.score >= 90) buckets["90+"]++;
    else if (p.score >= 70) buckets["70-89"]++;
    else if (p.score >= 50) buckets["50-69"]++;
    else buckets["<50"]++;
  }
  console.log("Score buckets:");
  for (const [k, v] of Object.entries(buckets)) console.log(`  ${k}: ${v}`);
  if (outFile) console.log(`\nFull report written to ${outFile}`);
}
