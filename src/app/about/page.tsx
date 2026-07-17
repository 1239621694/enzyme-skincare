import { BUSINESS_INFO, getEffectiveDate, getOperatorDisclosure } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Enzyme Skincare",
  description: `Learn about ${BUSINESS_INFO.storeName}, operated by ${BUSINESS_INFO.legalNameEN}. We offer ${BUSINESS_INFO.brandName} professional enzyme skincare products worldwide.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold text-neutral-800 mb-6">
          About {BUSINESS_INFO.storeName}
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-12">
          {getOperatorDisclosure()}
        </p>

        <hr className="border-neutral-200 mb-12" />

        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Our Brand Story</h2>
          <p className="text-neutral-600 leading-relaxed">{BUSINESS_INFO.brandStory}</p>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Our Mission</h2>
          <p className="text-neutral-600 leading-relaxed">{BUSINESS_INFO.mission}</p>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Our Vision</h2>
          <p className="text-neutral-600 leading-relaxed">{BUSINESS_INFO.vision}</p>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Professional Skincare</h2>
          <p className="text-neutral-600 leading-relaxed">
            {BUSINESS_INFO.brandName} products are developed with a focus on active ingredients, practical formulations and comfortable home-use experiences. Our product range includes enzyme treatments, peptide serums, facial masks and firming sprays — each designed to support specific skincare needs.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Worldwide Shipping</h2>
          <p className="text-neutral-600 leading-relaxed">
            We ship internationally to customers in the United Kingdom, Germany, France, Italy, Spain and Mexico. Each order is carefully packaged and dispatched from our fulfillment center in Chengdu, China.
          </p>
        </section>

        <section className="mb-12 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Company Information</h2>
          <dl className="space-y-3 text-sm text-neutral-600">
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Store Name:</dt>
              <dd>{BUSINESS_INFO.storeName}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Brand:</dt>
              <dd>{BUSINESS_INFO.brandName}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Legal Business Name:</dt>
              <dd>{BUSINESS_INFO.legalNameEN} ({BUSINESS_INFO.legalNameCN})</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Registration Number:</dt>
              <dd>{BUSINESS_INFO.registrationNumber}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Registered Address:</dt>
              <dd>{BUSINESS_INFO.registeredAddressEN}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Website:</dt>
              <dd><a href={BUSINESS_INFO.website} className="text-primary-600 hover:text-primary-700" target="_blank" rel="noopener noreferrer">{BUSINESS_INFO.website}</a></dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Customer Service:</dt>
              <dd><a href={`mailto:${BUSINESS_INFO.supportEmail}`} className="text-primary-600 hover:text-primary-700">{BUSINESS_INFO.supportEmail}</a></dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Phone:</dt>
              <dd><a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, "")}`} className="text-primary-600 hover:text-primary-700">{BUSINESS_INFO.phone}</a></dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Business Hours:</dt>
              <dd>{BUSINESS_INFO.businessHours}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
