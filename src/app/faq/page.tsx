import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "FAQ | Enzyme Skincare",
  description: `Find answers to frequently asked questions about ordering, shipping, returns, payment, skincare usage and customer support at ${BUSINESS_INFO.website}.`,
  openGraph: {
    title: "FAQ | Enzyme Skincare",
    description: "Find answers to frequently asked questions about Enzyme Skincare skincare products, ordering, shipping and returns.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Enzyme Skincare?",
      acceptedAnswer: { "@type": "Answer", text: "Enzyme Skincare is the online store operated by Yundasi Technology (Sichuan) Co., Ltd., offering Enzyme Skincare professional skincare products including enzyme treatments, peptide sets, facial masks and firming sprays." }
    },
    {
      "@type": "Question",
      name: "Where do you ship?",
      acceptedAnswer: { "@type": "Answer", text: "We currently ship to the United Kingdom, Germany, France, Italy, Spain and Mexico." }
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: { "@type": "Answer", text: "We accept secure payment methods available at checkout. Payment is processed through authorised third-party payment service providers." }
    },
    {
      "@type": "Question",
      name: "How long does shipping take?",
      acceptedAnswer: { "@type": "Answer", text: "Orders are processed within 1–3 business days. International shipping takes approximately 14–30 business days. Total estimated delivery time is approximately 15–33 business days." }
    },
    {
      "@type": "Question",
      name: "Can I return products?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, you may request a return within 3 working days of receiving your order. Items must be unopened and in original packaging. Used skincare products cannot be returned for hygiene reasons unless defective." }
    },
    {
      "@type": "Question",
      name: "Is my payment secure?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All payment transactions on our website are processed using SSL/TLS encryption. We do not store full credit card numbers on our servers." }
    },
  ],
};

const categories = [
  { id: "general", label: "General" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "payment", label: "Payment" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
  { id: "support", label: "Support" },
  { id: "account", label: "Account" },
  { id: "security", label: "Security" },
  { id: "legal", label: "Legal" },
];

const faqData: Record<string, { q: string; a: string | string[] }[]> = {
  general: [
    { q: "What is Enzyme Skincare?", a: "Enzyme Skincare is the online store operated by Yundasi Technology (Sichuan) Co., Ltd. We offer Enzyme Skincare professional skincare products, including enzyme treatments, peptide freeze-dried powder sets, facial masks and firming sprays — all designed around professional beauty concepts and convenient home skincare routines." },
    { q: "Who are your products designed for?", a: "Our products are designed for adults interested in professional-quality skincare at home. Our range includes formulations suitable for various skin types, including sensitive, dry, combination and aging-prone skin. Each product page includes detailed ingredient information and usage guidance to help you choose the right product for your needs." },
    { q: "Where are your products manufactured?", a: "Our Enzyme Skincare products are manufactured in facilities that follow quality manufacturing standards. For specific manufacturing inquiries, please contact our customer service team." },
    { q: "Are your products cruelty free?", a: "We are committed to ethical skincare practices. Our products are not tested on animals. We believe in responsible beauty that respects both your skin and the environment." },
    { q: "Are your products vegan?", a: "Many of our products are formulated with plant-based and synthetic ingredients. For specific vegan status of a particular product, please refer to the ingredient list on the product page or contact our customer service team." },
  ],
  products: [
    { q: "How do I use the Active Protease Anti-Wrinkle Kit?", a: ["Cleanse your face thoroughly.", "Mix the enzyme lotion with the enzyme powder until well blended.", "Apply the mixture evenly using the silicone brush.", "Leave on for 10–20 minutes.", "Rinse thoroughly with lukewarm water.", "Follow with a hydrating recovery mask for optimal results."] },
    { q: "How do I use the Blue Copper Peptide Freeze-Dried Powder Set?", a: ["Open one freeze-dried powder vial and one activating solution vial.", "Pour the activating solution into the freeze-dried powder vial.", "Shake gently until the powder is fully dissolved.", "Apply the freshly mixed solution evenly to clean skin.", "Gently pat until fully absorbed.", "Continue with moisturizer or a hydrating recovery mask if desired."] },
    { q: "How often should I use these products?", a: "Usage frequency depends on the specific product. Enzyme treatments are typically used once a week during the initial care period, then reduced to once every two weeks for maintenance. We recommend following the frequency shown on the product packaging or professional skincare guidance." },
    { q: "Can sensitive skin use these products?", a: "Many of our products are formulated to be gentle and suitable for sensitive-looking skin. However, we always recommend performing a patch test before first use, especially if you have known sensitivities. If irritation occurs, discontinue use and consult a dermatologist." },
    { q: "Can pregnant or nursing women use these products?", a: "If you are pregnant or nursing, we recommend consulting with your healthcare provider before introducing new skincare products. While our formulations use carefully selected ingredients, individual circumstances vary." },
    { q: "Can I combine these products with retinol?", a: "We recommend avoiding the concurrent use of enzyme treatments with strong active ingredients like retinol or exfoliating acids on the same day to prevent over-exfoliation. Allow at least 24–48 hours between treatments." },
    { q: "Can I combine these products with Vitamin C?", a: "Yes, our products can generally be combined with Vitamin C in your skincare routine. For best results, apply Vitamin C in the morning and use enzyme treatments in the evening on separate days." },
    { q: "What ingredients are included in your products?", a: "Full ingredient lists are available on each product page. We believe in transparency and provide detailed ingredient information for every product we sell." },
    { q: "Do your products contain artificial fragrance?", a: "Our products are formulated to be gentle. For specific information about fragrance or other additives, please refer to the ingredient list on the individual product page." },
  ],
  orders: [
    { q: "How do I place an order?", a: "Browse our product catalog, add items to your cart, and proceed to checkout. Enter your email, shipping information, and complete payment. You will receive an order confirmation email once your order is successfully placed." },
    { q: "Can I change or modify my order?", a: "If your order has not yet been dispatched, please contact us as soon as possible and we will do our best to accommodate changes. Once an order has been dispatched, modifications are no longer possible." },
    { q: "Can I cancel my order?", a: "Orders may be cancelled before they are dispatched. Please contact us immediately if you wish to cancel. Once dispatched, the standard return procedure applies." },
    { q: "How can I check my order status?", a: "You can check your order status by using the link provided in your order confirmation email. If you have questions about your order status, please contact our customer service team." },
  ],
  payment: [
    { q: "What payment methods do you accept?", a: "We accept secure payment methods available at checkout. Payment is processed through authorised third-party payment service providers using industry-standard security controls." },
    { q: "Is my payment secure?", a: "Yes, absolutely. All payment transactions on our website are processed using SSL/TLS encryption. We do not directly store full credit card or debit card numbers on our servers. Your payment data is handled securely by our authorised payment partners." },
    { q: "Do you support PayPal?", a: "We currently accept XTransfer (Bank Transfer) as our payment method. Please check the checkout page for currently available options." },
    { q: "Can I pay with Visa or Mastercard?", a: "We process payments through XTransfer (Bank Transfer). Please check the checkout page for currently available payment methods." },
    { q: "Can I pay with Apple Pay or Google Pay?", a: "We currently process payments through XTransfer (Bank Transfer). Please check the checkout page for currently available options." },
    { q: "Do you offer payment plans?", a: "We do not currently offer payment plans or installment options. Full payment is required at the time of ordering." },
  ],
  shipping: [
    { q: "Where do you ship?", a: "We currently ship to the following countries: United Kingdom, Germany, France, Italy, Spain and Mexico." },
    { q: "How long does order processing take?", a: "Orders are processed and dispatched within 1–3 business days after payment confirmation. Processing time may be longer during promotional periods or public holidays." },
    { q: "How long does international shipping take?", a: "Once dispatched, international orders typically arrive within 14–30 business days, depending on the destination country, carrier route and customs processing." },
    { q: "What is the estimated total delivery time?", a: "Approximately 15–33 business days, depending on destination, customs clearance, carrier operations, weather, holidays and other circumstances beyond our control." },
    { q: "How do I track my order?", a: "Once your order is dispatched, we will provide a tracking number via email where available. Please allow up to 48 hours for tracking information to update after dispatch." },
    { q: "Will I automatically receive tracking information?", a: "Yes, we will send tracking information to the email address you provided when placing your order, once tracking becomes available." },
    { q: "Do I need to pay customs fees and import duties?", a: "International orders may be subject to customs duties, import taxes, VAT and brokerage fees imposed by the destination country. These charges are the responsibility of the customer and are not included in the product or shipping price." },
    { q: "What happens if my package is lost in transit?", a: "If your package is lost, please contact our customer service team with your order number. We will assist you in resolving the issue, including filing a claim with the carrier if necessary." },
  ],
  returns: [
    { q: "Can I return a product?", a: "Yes, you may request a return within 3 working days of receiving your order. Items must be unopened, unused and in their original packaging." },
    { q: "What if my item arrives damaged?", a: "Please contact us within 1 working day of delivery with your order number and photos of the damage. We will review and arrange a replacement or refund." },
    { q: "Can I return opened or used products?", a: "For hygiene and safety reasons, opened or used skincare products are not eligible for return unless they are defective, damaged or incorrect as delivered." },
    { q: "How long does it take to receive my refund?", a: "Refunds are processed within 3 working days after we receive and inspect the returned item. The refund will be issued to your original payment method." },
    { q: "Who pays for return shipping?", a: "Return shipping costs are your responsibility for change-of-mind returns. For defective or incorrect items, we will cover reasonable return shipping costs." },
    { q: "What if I received the wrong item?", a: "If you received an incorrect item, please contact us immediately with your order number and photos. We will arrange a replacement or full refund including shipping costs." },
  ],
  support: [
    { q: "How do I contact customer support?", a: ["By email: support@enzymeskincare.com", "By phone: +86 13980551004", "By WhatsApp: available on our Contact page", "By contact form: visit our Contact page and submit a message."] },
    { q: "How quickly do you respond to inquiries?", a: "We respond within 24 hours on business days. Our business hours are Monday to Friday, 10:00–20:00, China Standard Time (UTC+8)." },
    { q: "What are your business hours?", a: "Our customer service team is available Monday to Friday, 10:00–20:00, China Standard Time (UTC+8)." },
    { q: "Do you have a physical store?", a: "We operate exclusively online at enzymeskincare.com. We do not have a physical retail store." },
  ],
  account: [
    { q: "Do I need to create an account to place an order?", a: "No, you can check out as a guest without creating an account. You will still receive an order confirmation email and tracking information." },
    { q: "What are the benefits of creating an account?", a: "Creating an account allows you to view your order history, track orders and save your information for faster checkout in the future." },
    { q: "How do I reset my password?", a: "Please contact our customer service team for assistance with password-related issues." },
  ],
  security: [
    { q: "Is my personal information safe?", a: "Yes. We implement appropriate technical and organisational security measures to protect your personal information. Our website uses SSL/TLS encryption for all data transmitted during checkout." },
    { q: "How do you protect customer data?", a: "We follow industry-standard security practices including encryption, secure payment processing through authorised partners and restricted data access. Please see our Privacy Policy for detailed information." },
    { q: "Do you share my information with third parties?", a: "We only share your information with trusted third-party service providers who assist us in operating our website, processing payments and fulfilling orders. These providers are contractually obligated to protect your information." },
  ],
  legal: [
    { q: "Where can I read the Privacy Policy?", a: "Our Privacy Policy is available at /privacy-policy. It explains how we collect, use and protect your personal information." },
    { q: "Where can I read the Terms and Conditions?", a: "Our Terms and Conditions are available at /terms-and-conditions. They govern your use of our website and purchase of products." },
    { q: "Where can I read the Shipping Policy?", a: "Our Shipping Policy is available at /shipping-policy. It includes processing times, shipping estimates and customs information." },
    { q: "Where can I read the Refund and Return Policy?", a: "Our Refund and Return Policy is available at /refund-policy. It covers return eligibility, damaged items and refund processing." },
    { q: "Where can I read the Cookie Policy?", a: "Our Cookie Policy is available at /cookie-policy. It explains how we use cookies and similar technologies." },
    { q: "How do I contact you for legal inquiries?", a: "For legal or privacy-related inquiries, please email legal@enzymeskincare.com." },
  ],
};

export default function FAQPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "FAQ", url: "/faq" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-[#faf7f3] border-b border-neutral-200">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold text-neutral-800 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            Everything you need to know about ordering, shipping, returns, skincare usage and customer support.
          </p>
        </div>
      </section>

      {/* Category Tabs + FAQ Content */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10 border-b border-neutral-200 pb-4" role="tablist" aria-label="FAQ categories">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="px-4 py-2 text-sm font-medium rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                role="tab"
                aria-controls={`panel-${cat.id}`}
              >
                {cat.label}
              </a>
            ))}
          </div>

          {/* FAQ Panels */}
          {categories.map((cat) => (
            <div key={cat.id} id={cat.id} className="mb-14 scroll-mt-24" role="tabpanel" aria-labelledby={`tab-${cat.id}`}>
              <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-6">{cat.label}</h2>
              <div className="space-y-3">
                {faqData[cat.id]?.map((item, idx) => (
                  <details key={idx} className="group rounded-xl bg-white border border-neutral-200 overflow-hidden transition-all duration-300 open:shadow-md open:border-primary-300">
                    <summary className="flex items-center justify-between px-6 py-5 text-sm font-semibold text-neutral-800 cursor-pointer list-none select-none hover:text-primary-700 transition-colors">
                      {item.q}
                      <span className="text-primary-500 text-xl font-light leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <div className="px-6 pb-5 space-y-2">
                      {Array.isArray(item.a) ? (
                        item.a.map((p, pi) => <p key={pi} className="text-sm text-neutral-600 leading-relaxed">{p}</p>)
                      ) : (
                        <p className="text-sm text-neutral-600 leading-relaxed">{item.a}</p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Legal summary */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 mt-8">
            <h2 className="font-heading text-xl font-bold text-neutral-800 mb-4">Legal &amp; Policies</h2>
            <p className="text-sm text-neutral-600 mb-4">Please review our policies for detailed information about your rights and our practices.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/privacy-policy" className="text-sm text-primary-600 hover:text-primary-700 underline">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="text-sm text-primary-600 hover:text-primary-700 underline">Terms &amp; Conditions</Link>
              <Link href="/shipping-policy" className="text-sm text-primary-600 hover:text-primary-700 underline">Shipping Policy</Link>
              <Link href="/refund-policy" className="text-sm text-primary-600 hover:text-primary-700 underline">Refund Policy</Link>
              <Link href="/cookie-policy" className="text-sm text-primary-600 hover:text-primary-700 underline">Cookie Policy</Link>
              <Link href="/contact" className="text-sm text-primary-600 hover:text-primary-700 underline">Contact</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
