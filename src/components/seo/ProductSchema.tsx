import { BUSINESS_INFO } from "@/lib/business-info";

export function ProductSchema({ product }: { product: { name: string; tagline?: string | null; price: number; images: string[]; rating: number; reviewsCount: number; slug: string } }) {
  const siteUrl = BUSINESS_INFO.website;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline || product.name,
    image: product.images.map((i) => i.startsWith("http") ? i : siteUrl + i),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: siteUrl + "/products/" + product.slug,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: BUSINESS_INFO.shippingCountries },
      },
    },
    ...(product.reviewsCount > 0 ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
      },
    } : {}),
    brand: { "@type": "Brand", name: BUSINESS_INFO.brandName },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
