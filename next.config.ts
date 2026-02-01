/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://172.20.10.3:3000', // your local IP
    ],
  },
};

module.exports = nextConfig;
