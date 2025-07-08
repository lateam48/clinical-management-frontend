import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:9090/api/v1/:path*", // adapte le port si besoin
      },
    ];
  },
};

export default nextConfig;