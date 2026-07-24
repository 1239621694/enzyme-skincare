import { BUSINESS_INFO, SHIPPING_CONFIG } from "@/lib/business-info";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_INFO.storeName,
    url: BUSINESS_INFO.website,
    logo: BUSINESS_INFO.website + "/logo.png",
    description: "Professional enzyme skincare. Science-backed formulations for healthier-looking skin. FREE Worldwide Shipping on orders over $" + SHIPPING_CONFIG.freeThreshold + ".",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 22 Xinma Road, 1st Floor, Wuhou District",
      addressLocality: "Chengdu",
      addressCountry: "CN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: BUSINESS_INFO.supportEmail,
      telephone: BUSINESS_INFO.phone,
      availableLanguage: "English",
    },
    sameAs: BUSINESS_INFO.socialProfiles,
    shippingRate: {
      "@type": "MonetaryAmount",
      value: SHIPPING_CONFIG.flatRate,
      currency: SHIPPING_CONFIG.currency,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
