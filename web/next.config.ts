import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
      {
        protocol: "https",
        hostname: "placeholder.terrahq.com",
      },
      {
        protocol: "https",
        hostname: "s3-echoo.s3.ap-northeast-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
