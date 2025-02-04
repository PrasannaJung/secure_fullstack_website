import fs from "fs";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow images from external sources
  images: {
    domains: ["images.unsplash.com", "randomuser.me", "localhost"],
  },

  // Enable HTTPS in local dev
  devServer: {
    https: {
      key: fs.readFileSync(path.resolve("./ssl/privkey.pem")),
      cert: fs.readFileSync(path.resolve("./ssl/cert.pem")),
    },
  },
};

export default nextConfig;
