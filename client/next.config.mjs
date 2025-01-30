/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // allow images to be imported from unsplash
  images: {
    domains: ["images.unsplash.com", "https://randomuser.me", "localhost"],
  },
};

export default nextConfig;
