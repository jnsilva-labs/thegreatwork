import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.sacred-texts.com",
        pathname: "/tarot/pkt/img/**",
      },
    ],
  },
};

export default nextConfig;
