/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/policies/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/policies/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
