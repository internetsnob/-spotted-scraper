/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow fetching from external venue websites
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
