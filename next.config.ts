import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Optional: Add if you have images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;