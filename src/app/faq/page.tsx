import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "FAQ — Enzyme Skincare",
  description: "Find answers to common questions about enzyme skincare, products, orders, and shipping.",
};

const faqItems = [
  { id: "what-are-enzymes", title: "What are enzyme-based skincare products?", content: "Enzyme-based skincare uses proteolytic enzymes derived from fruits like papaya and pineapple to gently exfoliate dead skin cells, revealing fresher, healthier skin underneath. Unlike harsh physical scrubs or strong acids, enzymes work with your skin natural chemistry." },
  { id: "skin-types", title: "Are your products suitable for sensitive skin?", content: "Yes! Enzyme exfoliation is much gentler than physical or acid exfoliation, making it ideal for sensitive skin. However, we always recommend patch testing a new product." },
  { id: "routine-order", title: "How do I incorporate enzymes into my routine?", content: "We recommend our 4-Step System: 1) Cleanse with our Enzyme Cleansing Balm, 2) Treat with our Enzyme Repair Serum, 3) Hydrate with our Enzyme Barrier Moisturizer, 4) Protect with SPF in the morning." },
  { id: "how-often", title: "How often should I use enzyme products?", content: "Most people can use enzyme products daily. Our cleansing balm is safe for twice-daily use, while the repair serum is best used once or twice daily depending on your skin tolerance." },
  { id: "when-results", title: "When will I see results?", content: "Many users notice improved texture and glow within the first week. More significant results, such as reduced hyperpigmentation and fine lines, typically appear after 4-8 weeks of consistent use." },
  { id: "shipping", title: "Do you ship internationally?", content: "Yes, we ship to the United States and the United Kingdom. Free shipping on orders over $50." },
  { id: "returns", title: "What is your return policy?", content: "We offer a 30-day money-back guarantee on all products. If you are not satisfied, contact us for a full refund." },
  { id: "ingredients-source", title: "Where do you source your ingredients?", content: "We source our ingredients globally from trusted suppliers who meet our strict quality and sustainability standards. All products are made in the USA." },
];

export default function FAQPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "FAQ", url: "/faq" }]} />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800">FAQ</h1>
        <p className="mt-2 text-neutral-500">Find answers to common questions about enzyme skincare.</p>
        <div className="mt-8">
          <Accordion items={faqItems} />
        </div>
        <div className="mt-10 text-center p-8 bg-neutral-50 rounded-xl">
          <h2 className="font-heading text-xl font-bold text-neutral-800">Still have questions?</h2>
          <p className="mt-2 text-neutral-500">We are here to help.</p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}