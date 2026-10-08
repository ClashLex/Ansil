import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Ansil",
  // Hides the Next.js dev indicator badge (bottom corner in `next dev`).
  // Production builds never show it, so this covers dev + deployed.
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
