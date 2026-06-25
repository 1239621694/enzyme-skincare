export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Enzyme Skincare",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://enzymeskincare.com",
    logo: (process.env.NEXT_PUBLIC_SITE_URL || "https://enzymeskincare.com") + "/logo.png",
    description: "Science-backed enzyme skincare that activates your skin natural renewal. Dermatologist tested, cruelty-free.",
    sameAs: [
      "https://wa.me/8613980551004",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@enzymeskincare.com",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}