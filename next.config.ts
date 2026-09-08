import type { NextConfig } from "next";

const isRailway =
  Boolean(process.env.RAILWAY_ENVIRONMENT) ||
  Boolean(process.env.RAILWAY_PROJECT_ID) ||
  Boolean(process.env.RAILWAY_SERVICE_ID) ||
  Boolean(process.env.RAILWAY_SERVICE_NAME) ||
  Boolean(process.env.RAILWAY_NEXT_START);

// GitHub Pages serves this repo at https://<owner>.github.io/RUCFC/, so that
// build needs a base path matching the repository name. A host serving the
// site at a domain root needs none — build it with SITE_BASE_PATH="".
// Note that "" is not nullish, so an explicitly empty value wins over the
// default rather than falling back to it.
const basePath = process.env.SITE_BASE_PATH ?? "/RUCFC";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

if (!isRailway) {
  nextConfig.output = "export";
  if (basePath) nextConfig.basePath = basePath;
}

export default nextConfig;
