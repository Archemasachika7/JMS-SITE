/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Server actions (admin uploads, donation/sponsor payment proofs) accept
    // files up to the 10 MB cap enforced in app/actions. The default limit is
    // 1 MB, which made larger uploads (e.g. magazine PDFs) fail with a
    // client-side server-action error.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
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
