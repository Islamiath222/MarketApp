import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@marketapp/types', '@marketapp/api-client'],
};

export default nextConfig;
