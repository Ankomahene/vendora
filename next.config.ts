import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['gjwldbdrfxpoqdhbdwxs.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gjwldbdrfxpoqdhbdwxs.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
    // Allow unoptimized images through next/image
    unoptimized: true,
  },
};

export default nextConfig;
