import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'taimuihongsg.com',
      },
      {
        protocol: 'https',
        hostname: 'nhakhoadelia.vn',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
