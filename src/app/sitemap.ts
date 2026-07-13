import type { MetadataRoute } from "next";
import { ALL_PRODUCTS } from "@/lib/products";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://enzymeskincare.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { url: "/", priority: 1.0, changefreq: "weekly" as const },
    { url: "/products", priority: 0.9, changefreq: "daily" as const },
    { url: "/cases", priority: 0.8, changefreq: "weekly" as const },
    
    { url: "/about", priority: 0.6, changefreq: "monthly" as const },
    { url: "/contact", priority: 0.5, changefreq: "monthly" as const },
    { url: "/cart", priority: 0.4, changefreq: "monthly" as const },
    { url: "/checkout/cancel", priority: 0.3, changefreq: "monthly" as const },
  ];

  const entries = staticRoutes.map((route) => ({
    url: BASE_URL + route.url,
    lastModified: new Date(),
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));

  // Add dynamic product pages
  const activeProducts = ALL_PRODUCTS.filter((p) => p.isActive);
  for (const product of activeProducts) {
    entries.push({
      url: BASE_URL + "/products/" + product.slug,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
  }


  // Add case study routes
  entries.push({
    url: BASE_URL + "/cases",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  });

  return entries;
}