import dotenv from "dotenv";
import type { NextConfig } from "next";

dotenv.config({ path: ".env" });

const nextConfig: NextConfig = {
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    UPLOAD_API_ENDPOINT: process.env.UPLOAD_API_ENDPOINT,
    IMAGE_URL_PREFIX: process.env.IMAGE_URL_PREFIX,
  },
};

export default nextConfig;
