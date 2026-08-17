import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "fast-shrimps-leave.loca.lt",
    "*.loca.lt",
    "loca.lt",
  ],
};

export default nextConfig;
