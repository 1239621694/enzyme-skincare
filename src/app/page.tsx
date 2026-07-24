export const dynamic = "force-dynamic";

import Image from "next/image";
import { HeroSection } from "@/components/sections/HeroSection";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { BrandStorySnippet } from "@/components/home/BrandStorySnippet";
import { WhatsAppFeed } from "@/components/home/WhatsAppFeed";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const skinConcerns = [
  { src: "/images/skin-concerns/original_background/icon_1_acne_congestion.png", title: "Acne & Congestion", desc: "Breakouts, clogged pores and uneven texture" },
  { src: "/images/skin-concerns/original_background/icon_2_enlarged_pores.png", title: "Enlarged Pores", desc: "Visible pores that appear stretched or open" },
  { src: "/images/skin-concerns/original_background/icon_3_fine_lines_wrinkles.png", title: "Fine Lines & Wrinkles", desc: "Helps smooth visible wrinkles and fine lines for a more youthful-looking complexion." },
  { src: "/images/skin-concerns/original_background/icon_4_uneven_skin_tone.png", title: "Uneven Skin Tone", desc: "Discoloration, redness or patchy pigmentation" },
  { src: "/images/skin-concerns/original_background/icon_5_dullness.png", title: "Dullness", desc: "Lack of radiance and tired-looking complexion" },
  { src: "/images/skin-concerns/original_background/icon_6_sensitive_skin.png", title: "Sensitive Skin", desc: "Easily irritated, reactive or uncomfortable skin" },
];

const trustIndicators = [
  { icon: "🔒", label: "Secure Checkout", desc: "SSL-encrypted transactions" },
  { icon: "🌍", label: "Worldwide Shipping", desc: "Selected destinations across 7 regions" },
  { icon: "🌿", label: "Cruelty-Free", desc: "Never tested on animals" },
  { icon: "🧪", label: "Professional Skincare", desc: "Inspired by clinical beauty concepts" },
  { icon: "⭐", label: "Customer Support", desc: "Available within 24 hours" },
  { icon: "💎", label: "Premium Ingredients", desc: "Carefully selected actives" },
];

const whyChooseUs = [
  { icon: "🧪", title: "Professional Formulations", desc: "Our products are developed around professional beauty concepts, combining carefully selected active ingredients with practical home-use designs." },
  { icon: "🌍", title: "International Shipping", desc: "We deliver to customers across North America, South America, Europe, East Asia, Southeast Asia, the Middle East, and Oceania with reliable tracking." },
  { icon: "🔒", title: "Secure Payments", desc: "All transactions are processed through secure, encrypted payment channels. Your financial information is protected." },
  { icon: "💬", title: "Dedicated Support", desc: "Our customer care team is available to assist with product questions, order support and skincare guidance." },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* ── Trust Badges Bar ── */}
      <section className="bg-neutral-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {trustIndicators.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-xl" role="img" aria-hidden="true">{item.icon}</span>
                <span className="text-xs font-semibold text-white">{item.label}</span>
                <span className="text-[10px] text-neutral-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <div key={item.title} className="group text-center pt-10 pb-8 px-6 md:pt-12 md:pb-10 md:px-8 rounded-2xl bg-white border border-neutral-200/60 hover:border-primary-200/60 hover:bg-primary-50/30 transition-all duration-300">
                <div className="w-[110px] h-[110px] md:w-[150px] lg:w-[190px] lg:h-[190px] mx-auto mb-5 flex items-center justify-center">
                  <Image src={item.src} alt={item.title} width={190} height={190} className="object-contain w-full h-full" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-neutral-800 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 md:py-28 bg-[#faf7f3]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Why Choose Enzyme Skincare</h2>
            <p className="text-neutral-500 text-lg">Professional skincare, thoughtfully formulated and delivered worldwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-neutral-200 p-8 hover:shadow-md transition-shadow">
                <span className="text-3xl block mb-4" role="img" aria-hidden="true">{item.icon}</span>
                <h3 className="font-heading text-lg font-semibold text-neutral-800 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialCarousel />
      <BrandStorySnippet />
      <WhatsAppFeed />

      {/* ── Final CTA ── */}
      <section className="py-16 bg-neutral-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-white mb-3">Need Help Choosing?</h2>
          <p className="text-neutral-300 mb-6">
            Our skincare team is available to help you find the right products for your skin concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/8613980551004" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">Chat with Our Team</Button>
            </a>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">Explore Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
