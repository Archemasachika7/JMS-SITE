/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["rwjfnuszkhoznfrjzqfr.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "api.nasa.gov",
      },
    ],
  },
};
module.exports = nextConfig;
