import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ngrok-free.app',
      },
    ],
  },

  allowedDevOrigins: ['*.ngrok-free.app'],
}

export default nextConfig
