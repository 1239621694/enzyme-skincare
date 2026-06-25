export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { TheEnzymeDifference } from "@/components/sections/FeaturesSection";
import { BestSellers } from "@/components/home/BestSellers";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { BrandStorySnippet } from "@/components/home/BrandStorySnippet";
import { WhatsAppFeed } from "@/components/home/WhatsAppFeed";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* Promo Banner */}
      <section className="py-3 bg-accent-500 text-white text-center text-sm font-semibold">
        🎉 New Customer Special: 15% off your first order with code <span className="underline mx-1">WELCOME15</span> — Free shipping over $50
      </section>
      <TrustBar />
      <TheEnzymeDifference />
      <BestSellers />
            {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          ["🔄", "30-Day Money Back"],
          ["🚚", "Free Shipping $50+"],
          ["🧪", "Dermatologist Tested"],
          ["🔒", "Secure Checkout"],
        ].map(([icon, label]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium text-neutral-500">{label}</span>
          </div>
        ))}
      </section>
      <TestimonialCarousel />
      <BrandStorySnippet />
      <WhatsAppFeed />
      {/* Online Support CTA */}
      <section className="py-16 bg-neutral-50 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-3">Need Help Choosing?</h2>
          <p className="text-neutral-500 mb-6">
            Chat with our online skincare specialists. Free shipping on orders over $50.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/8613980551004" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="primary">💬 Chat on WhatsApp</Button>
            </a>
            <Link href="/products">
              <Button size="lg" variant="outline">Shop All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}