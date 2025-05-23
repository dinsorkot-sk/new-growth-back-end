/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1', 'api.bunditpunmai-mju.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/upload/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/upload/**',
      },
      {
        protocol: 'http',
        hostname: 'api.bunditpunmai-mju.com',
        pathname: '/upload/**',
      }
    ],
  },
}

module.exports = nextConfig 