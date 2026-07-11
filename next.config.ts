import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Limit header size to prevent HTTP 431 Request Header Fields Too Large
  reactMaxHeadersLength: 1000,
  // Allow dev origins for HMR WebSocket (prevents "Failed to fetch RSC payload")
  allowedDevOrigins: ["127.0.0.1", "::1", "192.168.56.1", "localhost"],
};

export default nextConfig;
