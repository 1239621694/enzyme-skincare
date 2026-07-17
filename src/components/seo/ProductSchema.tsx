import { BUSINESS_INFO } from "@/lib/business-info";

export function ProductSchema({ product, sku }: { product: { name: string; tagline?: string | null; price: number; images: string[]; rating: number; reviewsCount: number; slug: string }; sku?: string }) {
  const siteUrl = BUSINESS_INFO.website;
  const imageFull = product.images.map((i) => i.startsWith("http") ? i : siteUrl + i);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline || product.name,
    image: imageFull,
    sku: sku || product.slug,
    brand: { "@type": "Brand", name: BUSINESS_INFO.brandName },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: siteUrl + "/products/" + product.slug,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: BUSINESS_INFO.shippingCountries,
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 3,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: BUSINESS_INFO.shippingCountries },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 14, maxValue: 30, unitCode: "DAY" },
        },
      },
    },
    ...(product.reviewsCount > 0 ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
      },
    } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
