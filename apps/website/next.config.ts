import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [],
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
