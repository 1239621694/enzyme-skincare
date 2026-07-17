import { BUSINESS_INFO } from "@/lib/business-info";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_INFO.storeName,
    url: BUSINESS_INFO.website,
    logo: BUSINESS_INFO.website + "/logo.png",
    description: "Professional enzyme skincare. Science-backed formulations for healthier-looking skin.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 69, Bldg 2, 118 Weijianian 1st Rd, Jinniu District",
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
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
