/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/shipping',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/delivery',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/returns',
        destination: '/refund-policy',
        permanent: true,
      },
      {
        source: '/refund',
        destination: '/refund-policy',
        permanent: true,
      },
      {
        source: '/refunds',
        destination: '/refund-policy',
        permanent: true,
      },
      {
        source: '/cancellation',
        destination: '/cancellation-policy',
        permanent: true,
      },
      {
        source: '/policies',
        destination: '/shipping-policy',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
