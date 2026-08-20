#!/usr/bin/env node
/**
 * One-shot script — converts public/og-default.svg → public/og-default.png
 * (1200×630) for social preview cards. Committed to repo.
 *
 *   node scripts/generate-og.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const src = path.join(__dirname, "..", "public", "og-default.svg");
const dst = path.join(__dirname, "..", "public", "og-default.png");

(async () => {
  if (!fs.existsSync(src)) {
    console.error("Missing", src);
    process.exit(1);
  }
  await sharp(src, { density: 200 }).resize(1200, 630).png().toFile(dst);
  console.log("Wrote", dst);
})();
