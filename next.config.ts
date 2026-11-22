import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: [
    "192.168.7.154",
    "backend.mindunite.com",
    "vini.softvenceomegaforce.cloud",
  ],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vini.softvenceomegaforce.cloud",
      },
      {
        protocol: "http",
        hostname: "vini.softvenceomegaforce.cloud",
      },
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
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "10.10.9.117",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "vini.pixelstack.cloud",
      },
      {
        protocol: "https",
        hostname: "cleared-month-virgin-murphy.trycloudflare.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/",
      },
      {
        protocol: "https",
        hostname: ".ngrok-free.dev",
        pathname: "/storage/",
      },
      {
        protocol: "https",
        hostname: ".ngrok-free.app",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
