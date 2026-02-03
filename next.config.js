/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    // Allow any HTTPS image URL using remotePatterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        // Allow any HTTPS hostname for user-provided URLs
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    dirs: ["src", "app", "components", "lib", "types"],
  },
};

module.exports = nextConfig;
