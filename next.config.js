const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.BUNDLE_ANALYZER === "true",
});

const withRoutes = require("nextjs-routes/config")({
  outDir: "nextjs",
});

const headers = require("./nextjs/headers");
const redirects = require("./nextjs/redirects");
const rewrites = require("./nextjs/rewrites");

/** @type {import('next').NextConfig} */
const moduleExports = {
  transpilePackages: [
    "react-syntax-highlighter",
    "swagger-client",
    "swagger-ui-react",
  ],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },

  rewrites,
  redirects,
  headers,
  output: "standalone",
  productionBrowserSourceMaps: true,
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

module.exports = withBundleAnalyzer(withRoutes(moduleExports));
