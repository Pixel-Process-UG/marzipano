import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Enable WebGL/WebGPU support
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  // Enable experimental features for WebGL/WebGPU if needed
  experimental: {
    serverComponentsExternalPackages: ['marzipano'],
  },
};

export default nextConfig;
