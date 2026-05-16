import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.7.154", "backend.mindunite.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "vin.apphero.agency",
      },
      {
        protocol: "http",
        hostname: "vin.apphero.agency",
      },
      {
        protocol: "https",
        hostname: "backend.mindunite.com",
      },
    ],
  },
};

export default nextConfig;
