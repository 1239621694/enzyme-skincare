import { BUSINESS_INFO, getEffectiveDate, getOperatorDisclosure } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Enzyme Skincare",
  description: `Enzyme Skincare is the online store operated by ${BUSINESS_INFO.legalNameEN}, offering BELOYAN professional skincare products.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold text-neutral-800 mb-6">
          Professional Skincare, Thoughtfully Delivered
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-12">
          {getOperatorDisclosure()} We offer {BUSINESS_INFO.brandName} skincare products designed
          around professional beauty concepts, carefully selected ingredients and convenient home
          skincare routines.
        </p>

        <hr className="border-neutral-200 mb-12" />

        {/* Who We Are */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Who We Are</h2>
          <p className="text-neutral-600 leading-relaxed">
            {BUSINESS_INFO.legalNameEN} ({BUSINESS_INFO.legalNameCN}) is a registered company based
            in Chengdu, China. We manage the online retail operations of Enzyme Skincare and the
            {BUSINESS_INFO.brandName} product brand.
          </p>
        </section>

        {/* What We Sell */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">What We Sell</h2>
          <p className="text-neutral-600 leading-relaxed">
            We offer {BUSINESS_INFO.brandName} professional skincare products including enzyme
            treatments, peptide sets, facial masks and firming sprays. Each product listing
            includes ingredient information, usage instructions and available package sizes.
          </p>
        </section>

        {/* Our Approach */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Our Approach to Product Information</h2>
          <p className="text-neutral-600 leading-relaxed">
            We present product details, ingredient lists and usage instructions based on
            manufacturer information. Skincare results may vary between individuals. Product
            descriptions are not medical claims and our products are not intended to diagnose,
            treat, cure or prevent any medical condition.
          </p>
        </section>

        {/* Quality & Customer Care */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Quality and Customer Care</h2>
          <p className="text-neutral-600 leading-relaxed">
            We are committed to providing accurate product information, responsive customer support
            and reliable order fulfilment. If you have questions about a product, your order or
            your account, please contact our customer care team.
          </p>
        </section>

        {/* Business Identification */}
        <section className="mb-12 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">Business Identification</h2>
          <dl className="space-y-3 text-sm text-neutral-600">
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
              <dd>{BUSINESS_INFO.registeredAddress}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Customer Support:</dt>
              <dd>
                <a href={`mailto:${BUSINESS_INFO.supportEmail}`} className="text-primary-600 hover:text-primary-700">
                  {BUSINESS_INFO.supportEmail}
                </a>
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Phone:</dt>
              <dd>
                <a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, "")}`} className="text-primary-600 hover:text-primary-700">
                  {BUSINESS_INFO.phone}
                </a>
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="font-semibold text-neutral-800 min-w-40">Website:</dt>
              <dd>
                <a href={BUSINESS_INFO.website} className="text-primary-600 hover:text-primary-700" target="_blank" rel="noopener noreferrer">
                  {BUSINESS_INFO.website}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
