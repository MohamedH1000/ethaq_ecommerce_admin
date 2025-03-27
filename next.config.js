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
};

module.exports = nextConfig;
