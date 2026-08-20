/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Static HTML export
  basePath: process.env.NODE_ENV === "production" ? "/Portfolio-v5" : "",
  images: {
    unoptimized: true, // Required for static export
  },
  // This setting ensures paths are correctly resolved for GitHub Pages
  assetPrefix: process.env.NODE_ENV === "production" ? "/Portfolio-v5" : "",
};

module.exports = nextConfig;
