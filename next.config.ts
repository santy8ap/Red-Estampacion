/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    // Opcional: si prefieres, puedes usar remotePatterns en vez de domains
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'lh3.googleusercontent.com',
    //     pathname: '/**',
    //   },
    // ],
  },
};

module.exports = nextConfig;
