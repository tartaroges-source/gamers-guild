import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'pg'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
 experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
    // Separate from serverActions.bodySizeLimit — this is the limit for
    // anything passing through proxy.ts (which matches /dashboard/:path*,
    // including our file upload routes). Defaults to 10MB, which is what
    // silently truncated one of our media uploads.
    proxyClientMaxBodySize: '20mb',
  },
};

export default nextConfig;
