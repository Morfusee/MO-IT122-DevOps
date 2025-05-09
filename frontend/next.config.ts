import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   optimizePackageImports: ["@mantine/core", "@mantine/hooks", "zod"],
  // },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
};

export default nextConfig;
