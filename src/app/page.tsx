export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/HeroSection";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { BrandStorySnippet } from "@/components/home/BrandStorySnippet";
import { WhatsAppFeed } from "@/components/home/WhatsAppFeed";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const skinConcerns = [
  { icon: "01", title: "Acne & Congestion", desc: "Breakouts, clogged pores and uneven texture" },
  { icon: "02", title: "Enlarged Pores", desc: "Visible pores that appear stretched or open" },
  { icon: "03", title: "Fine Lines & Wrinkles", desc: "Early signs of ageing around eyes and forehead" },
  { icon: "04", title: "Uneven Skin Tone", desc: "Discoloration, redness or patchy pigmentation" },
  { icon: "05", title: "Dullness", desc: "Lack of radiance and tired-looking complexion" },
  { icon: "06", title: "Sensitive Skin", desc: "Easily irritated, reactive or uncomfortable skin" },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* ── Skin Concerns Grid ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              IS YOUR SKIN SHOWING THESE SIGNS?
            </h2>
            <p className="text-neutral-500 text-lg">
              Common skin concerns that Enzyme Therapy is designed to improve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
            {skinConcerns.map((item) => (
              <div key={item.icon} className="group text-center p-6 md:p-8 rounded-2xl bg-white border border-neutral-200/60 hover:border-primary-200/60 hover:bg-primary-50/30 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors duration-300">
                  <svg className="w-7 h-7 text-neutral-600 group-hover:text-primary-600 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon === "01" && <><circle cx="12" cy="8" r="5"/><path d="M5 22a7 7 0 0 1 14 0"/><circle cx="9" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/><path d="M12 13v1"/></>}
                    {item.icon === "02" && <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></>}
                    {item.icon === "03" && <><path d="M12 3c-4 0-7 2-7 6 0 3 2 5 7 5s7-2 7-5c0-4-3-6-7-6z"/><path d="M8 14c0 2 1.5 4 4 4s4-2 4-4"/><path d="M9 17.5c0 1.5.5 2.5 3 2.5s3-1 3-2.5"/></>}
                    {item.icon === "04" && <><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9c-3 0-5-1-7-3s-4-3-7-3a9 9 0 0 1 5-3z"/><path d="M3 12c0 5 4 9 9 9 0-3-1-5-3-7s-3-4-3-7a9 9 0 0 0-3 5z"/></>}
                    {item.icon === "05" && <><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="4"/></>}
                    {item.icon === "06" && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 10c0 2 1.5 3 3 3s3-1 3-3"/></>}
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-semibold text-neutral-800 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialCarousel />
      <BrandStorySnippet />
      <WhatsAppFeed />
      {/* Online Support CTA */}
      <section className="py-16 bg-neutral-50 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-3">Need Help Choosing?</h2>
          <p className="text-neutral-500 mb-6">
            Chat with our online skincare specialists.
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