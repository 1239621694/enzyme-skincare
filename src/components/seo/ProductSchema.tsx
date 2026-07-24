import { BUSINESS_INFO, SHIPPING_CONFIG } from "@/lib/business-info";

export function ProductSchema({ product, sku }: { product: { name: string; tagline?: string | null; price: number; images: string[]; slug: string }; sku?: string }) {
  const siteUrl = BUSINESS_INFO.website;
  const imageFull = product.images.map((i) => i.startsWith("http") ? i : siteUrl + i);

  // Shipping rate description for schema: flat rate $20, free if merchandise subtotal >= $199
  const shippingRateValue = SHIPPING_CONFIG.flatRate;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline || product.name,
    image: imageFull,
    ...(sku ? { sku } : {}),
    brand: { "@type": "Brand", name: BUSINESS_INFO.storeName },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: siteUrl + "/products/" + product.slug,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 3,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnShippingFeesCustomerResponsibility",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: shippingRateValue,
          currency: SHIPPING_CONFIG.currency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "*",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 14, maxValue: 30, unitCode: "DAY" },
        },
      },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
