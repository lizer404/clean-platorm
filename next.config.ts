import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow localtunnel / public preview hosts to load /_next assets in dev
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "fast-shrimps-leave.loca.lt",
    "*.loca.lt",
    "loca.lt",
  ],
};

export default nextConfig;
