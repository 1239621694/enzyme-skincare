export function ProductSchema({ product }: { product: { name: string; tagline?: string | null; price: number; images: string[]; rating: number; reviewsCount: number; slug: string } }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://enzymeskincare.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline || product.name,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: siteUrl + "/products/" + product.slug,
    },
    aggregateRating: product.reviewsCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    } : undefined,
    brand: { "@type": "Brand", name: "Enzyme Skincare" },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}