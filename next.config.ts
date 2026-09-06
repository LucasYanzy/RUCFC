import type { NextConfig } from "next";

const isRailway =
  Boolean(process.env.RAILWAY_ENVIRONMENT) ||
  Boolean(process.env.RAILWAY_PROJECT_ID) ||
  Boolean(process.env.RAILWAY_SERVICE_ID) ||
  Boolean(process.env.RAILWAY_SERVICE_NAME) ||
  Boolean(process.env.RAILWAY_NEXT_START);

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

if (!isRailway) {
  nextConfig.output = "export";
  nextConfig.basePath = "/RUCFC";
}

export default nextConfig;
