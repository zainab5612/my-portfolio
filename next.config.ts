// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add only what you actually need below. Keep it minimal to avoid build issues.

  // If you load images from external domains, uncomment and edit:
  // images: {
  //   remotePatterns: [
  //     { protocol: "https", hostname: "images.unsplash.com" },
  //     { protocol: "https", hostname: "raw.githubusercontent.com" },
  //   ],
  // },

  // Experimental flags only if you explicitly need them:
  // experimental: {
  //   // typedRoutes: true,
  //   // serverActions: { allowedOrigins: ["localhost:3000"] },
  // },
};

export default nextConfig;
