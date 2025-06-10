import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   optimizePackageImports: ["@mantine/core", "@mantine/hooks", "zod"],
  // },
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL_SERVER: process.env.NEXT_PUBLIC_API_BASE_URL_SERVER
  },
};

export default nextConfig;
