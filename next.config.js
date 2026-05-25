/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // wagmi/walletconnect rely on these in some builds
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};
module.exports = nextConfig;
