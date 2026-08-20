const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "out");

if (!fs.existsSync(outputDir)) {
  console.error(
    'Output directory does not exist. Please run "npm run build" first.'
  );
  process.exit(1);
}

// 1. Bypass Jekyll on GH Pages so files starting with _ (e.g., _next) are served.
fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");
console.log("Created .nojekyll file");

// 2. Delete the raw article HTML fragments from /out/blog/ — their content
//    is now inlined at build time by src/app/blog/[slug]/page.tsx into the
//    canonical /blog/<slug> URL. Shipping them separately duplicates content
//    and creates parallel indexable URLs that would compete for ranking.
//
//    We keep the canonical Next-generated pages (blog/<slug>.html and their
//    /blog/<slug>/index.html partners) and delete everything else in
//    out/blog/ that isn't a Next-emitted file.
const blogOutDir = path.join(outputDir, "blog");
if (fs.existsSync(blogOutDir)) {
  // Load the canonical slugs from the compiled build metadata — read the
  // sitemap.xml Next emitted so we don't have to import TS here.
  const sitemapPath = path.join(outputDir, "sitemap.xml");
  const canonicalSlugs = new Set();
  if (fs.existsSync(sitemapPath)) {
    const sm = fs.readFileSync(sitemapPath, "utf8");
    const re = /\/blog\/([a-z0-9-]+)</gi;
    let m;
    while ((m = re.exec(sm))) canonicalSlugs.add(m[1]);
  }

  let deleted = 0;
  for (const f of fs.readdirSync(blogOutDir)) {
    const full = path.join(blogOutDir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) continue; // Next's per-slug dirs (blog/<slug>/index.html) — keep.
    // Preserve blog/<slug>.html (canonical flat output) and blog/<slug>.txt (RSC payload).
    const base = f.replace(/\.(html|txt)$/i, "");
    if (canonicalSlugs.has(base)) continue;
    // Everything else in out/blog/ is a leftover raw article HTML fragment — drop it.
    fs.unlinkSync(full);
    deleted++;
  }
  console.log(`Deleted ${deleted} raw blog file(s) from out/blog/`);
}
