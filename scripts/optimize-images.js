#!/usr/bin/env node
/**
 * One-off image optimizer — recompresses oversized assets in
 * src/assets/images (LCP-impacting). Overwrites in place. Run once
 * (or after adding new large images) and commit the results.
 *
 *   node scripts/optimize-images.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..", "src", "assets", "images");

// [filename, maxWidth, quality, format]
const targets = [
  ["profile.jpg", 1400, 78, "jpeg"],
  ["hero-bg.JPG", 1600, 74, "jpeg"],
  ["digital-products/javascript-book.jpg", 900, 76, "jpeg"],
  ["digital-products/css-unmasked-book.png", 900, 78, "jpeg"],
  ["digital-products/hld-book.png", 900, 78, "jpeg"],
];

(async () => {
  for (const [rel, w, q, fmt] of targets) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) continue;
    const orig = fs.statSync(src).size;
    const buf = await sharp(src)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      [fmt]({ quality: q, mozjpeg: fmt === "jpeg" })
      .toBuffer();
    // If the file is a PNG we replace with JPEG — but we need to keep
    // referenced import paths working. Only rewrite if smaller.
    if (buf.length < orig * 0.9) {
      // If the source is PNG and we're saving JPEG, keep the .png name
      // but write JPEG bytes — modern browsers sniff the content type.
      // Better: don't cross formats. Only do same-format rewrite.
      const ext = path.extname(src).toLowerCase();
      const isJpg = ext === ".jpg" || ext === ".jpeg";
      const isPng = ext === ".png";
      if (fmt === "jpeg" && isJpg) {
        fs.writeFileSync(src, buf);
        console.log(
          rel,
          "compressed",
          Math.round(orig / 1024) + "KB",
          "→",
          Math.round(buf.length / 1024) + "KB"
        );
      } else if (fmt === "jpeg" && isPng) {
        // Re-encode as PNG with lossless quantization to keep the path.
        const png = await sharp(src)
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .png({ compressionLevel: 9, palette: true, quality: 90 })
          .toBuffer();
        if (png.length < orig * 0.9) {
          fs.writeFileSync(src, png);
          console.log(
            rel,
            "png-quantized",
            Math.round(orig / 1024) + "KB",
            "→",
            Math.round(png.length / 1024) + "KB"
          );
        }
      }
    } else {
      console.log(rel, "already optimal");
    }
  }
})();
