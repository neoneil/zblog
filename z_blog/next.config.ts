import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  allowedDevOrigins: [
    "*.trycloudflare.com",
    "wallpapers-facing-gender-respiratory.trycloudflare.com",
  ],
};

export default nextConfig;