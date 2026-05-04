import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_ENV === 'product'
          ? (process.env.NEXT_PUBLIC_PRODUCT_HOSTNAME ?? 'localhost')
          : (process.env.NEXT_PUBLIC_DEV_HOSTNAME ?? 'localhost'),
        port: process.env.NEXT_PUBLIC_ENV === 'product'
          ? (process.env.NEXT_PUBLIC_PRODUCT_PORT ?? '3000')
          : (process.env.NEXT_PUBLIC_DEV_PORT ?? '3000'),
        pathname: '/**'
      }
    ],
    dangerouslyAllowLocalIP: true
  }
};

export default withNextVideo(nextConfig);