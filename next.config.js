/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "loremflickr.com",
      "cdnprod.mafretailproxy.com",
      "cdn.mafrservices.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Only if you have separate CI checks
  },
  typescript: {
    ignoreBuildErrors: true, // Keep false to catch TS errors
  },
};

module.exports = nextConfig;
