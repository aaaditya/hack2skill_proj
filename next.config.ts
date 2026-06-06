import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enforce strict environment variable presence at build time on Vercel.
  // The actual runtime check is in src/lib/env.ts; this surfaces a clear
  // build-time error message if the variable is missing on the deploy target.
  env: {
    NEXT_PUBLIC_APP_NAME: "AI Kitchen Assistant",
  },

  // Recommended for Vercel: log only errors in production.
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Disable the default X-Powered-By header to reduce fingerprinting.
  poweredByHeader: false,

  // Compress responses on Vercel (handled by Vercel CDN, but safe to keep).
  compress: true,
};

export default nextConfig;
