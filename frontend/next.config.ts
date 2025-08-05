import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://image.tmdb.org/t/p/w500/**"), // liberando acesso aos posters
      new URL("https://image.tmdb.org/t/p/w1280/**"), // liberando acesso aos backdrops
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
