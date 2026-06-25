import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "About Us — Enzyme Skincare",
  description:
    "Learn the story behind Enzyme Skincare. Science meets nature in every bottle.",
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "About", url: "/about" }]} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl font-bold text-neutral-800">Our Story</h1>
          <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
            Enzyme Skincare was founded on a simple belief: your skin already knows how to heal itself.
            Our mission is to harness the power of bio-active enzymes to support your skin natural renewal process.
          </p>
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mt-10">Our Philosophy</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {[
              { title: "Science-Driven", desc: "Every formula is backed by clinical research and developed with dermatologists." },
              { title: "Clean Ingredients", desc: "We use only the highest-quality, naturally-derived ingredients. No parabens, sulfates, or synthetic fragrances." },
              { title: "Proven Results", desc: "We dont make promises we cant keep. Our before and after results speak for themselves." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-neutral-50 border border-neutral-200">
                <h3 className="font-heading text-lg font-semibold text-neutral-800">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/products"><Button size="lg">Experience the Difference</Button></Link>
          </div>
        </div>
      </div>
    </>
  );
}