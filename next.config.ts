import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cutouts are served via short-lived presigned S3 URLs; the optimizer
    // can't cache them meaningfully, so we allow the S3 hosts and render
    // previews unoptimized where appropriate.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
