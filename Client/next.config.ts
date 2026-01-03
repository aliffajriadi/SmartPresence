import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jokilek.diskon.com",
        pathname: "/storage/files/**",
      },
    ],
  },
};

export default nextConfig;
