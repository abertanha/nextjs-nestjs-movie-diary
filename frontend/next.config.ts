import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    remotePatterns: [
      new URL("https://image.tmdb.org/t/p/w500/**"), // liberando acesso aos posters
      new URL("https://image.tmdb.org/t/p/w1280/**"), // liberando acesso aos backdrops
    ],
  },
};

export default nextConfig;
