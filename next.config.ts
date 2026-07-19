import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://*.paypal.com https://*.paypalobjects.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https://images.unsplash.com https://*.supabase.co https://*.stripe.com https://*.paypal.com https://*.paypalobjects.com",
  "font-src 'self' https://fonts.gstatic.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://*.paypal.com https://*.paypalobjects.com https://www.paypal.com",
  "frame-ancestors 'self'",
  "child-src 'self' https://*.paypal.com https://*.paypalobjects.com",
  "connect-src 'self' https://api.stripe.com https://*.supabase.co https://www.google-analytics.com https://*.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com",
  "form-action 'self' https://checkout.stripe.com https://*.paypal.com",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.stripe.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;