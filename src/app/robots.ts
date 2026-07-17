import type { MetadataRoute } from "next";
import { BUSINESS_INFO } from "@/lib/business-info";

const BASE_URL = BUSINESS_INFO.website;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/account/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}