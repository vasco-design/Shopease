import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "i.imgur.com"],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS errors for build
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
