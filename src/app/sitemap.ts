import type { MetadataRoute } from "next";
import { ALL_PRODUCTS } from "@/lib/products";
import { BUSINESS_INFO } from "@/lib/business-info";

const BASE_URL = BUSINESS_INFO.website;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { url: "/", priority: 1.0, changefreq: "weekly" as const },
    { url: "/products", priority: 0.9, changefreq: "daily" as const },
    { url: "/about", priority: 0.7, changefreq: "monthly" as const },
    { url: "/contact", priority: 0.6, changefreq: "monthly" as const },
    { url: "/cart", priority: 0.5, changefreq: "monthly" as const },
    { url: "/terms-and-conditions", priority: 0.4, changefreq: "monthly" as const },
    { url: "/privacy-policy", priority: 0.4, changefreq: "monthly" as const },
    { url: "/shipping-policy", priority: 0.4, changefreq: "monthly" as const },
    { url: "/refund-policy", priority: 0.4, changefreq: "monthly" as const },
    { url: "/payment-policy", priority: 0.4, changefreq: "monthly" as const },
    { url: "/cookie-policy", priority: 0.3, changefreq: "monthly" as const },
    { url: "/cases", priority: 0.8, changefreq: "weekly" as const },
    { url: "/checkout/cancel", priority: 0.3, changefreq: "monthly" as const },
  ];

  const entries = staticRoutes.map((route) => ({
    url: BASE_URL + route.url,
    lastModified: new Date(),
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));

  const activeProducts = ALL_PRODUCTS.filter((p) => p.isActive);
  for (const product of activeProducts) {
    entries.push({
      url: BASE_URL + "/products/" + product.slug,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
  }

  return entries;
}
