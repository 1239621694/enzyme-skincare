export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/HeroSection";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { BrandStorySnippet } from "@/components/home/BrandStorySnippet";
import { WhatsAppFeed } from "@/components/home/WhatsAppFeed";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const SkinAcneIcon = () => (
  <svg viewBox="0 0 160 160" fill="none" stroke="#8b7440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="100" cy="55" r="38" />
    <path d="M62 55a8 8 0 0 1 4-7" />
    <path d="M138 55a8 8 0 0 0-4-7" />
    <ellipse cx="88" cy="51" rx="3" ry="2" />
    <ellipse cx="112" cy="51" rx="3" ry="2" />
    <path d="M100 60v3" />
    <path d="M70 90a30 30 0 0 0 60 0" />
    <path d="M78 95a4 4 0 0 1 4-4" />
    <path d="M122 95a4 4 0 0 0-4-4" />
    <circle cx="90" cy="100" r="3.5" />
    <circle cx="110" cy="100" r="3.5" />
    <circle cx="100" cy="108" r="3.5" />
    <circle cx="84" cy="108" r="2.5" />
    <circle cx="116" cy="108" r="2.5" />
  </svg>
);

const SkinPoresIcon = () => (
  <svg viewBox="0 0 160 160" fill="none" stroke="#8b7440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="20" y="20" width="90" height="90" rx="10" />
    <circle cx="65" cy="50" r="4" />
    <circle cx="45" cy="70" r="4" />
    <circle cx="85" cy="70" r="4" />
    <circle cx="65" cy="90" r="4" />
    <circle cx="50" cy="45" r="2.5" />
    <circle cx="80" cy="45" r="2.5" />
    <circle cx="55" cy="80" r="2.5" />
    <circle cx="75" cy="80" r="2.5" />
    <path d="M110 50l32 32M142 82l-8 8" />
    <circle cx="130" cy="70" r="12" />
    <line x1="130" y1="62" x2="130" y2="78" />
    <line x1="122" y1="70" x2="138" y2="70" />
  </svg>
);

const SkinFineLinesIcon = () => (
  <svg viewBox="0 0 160 160" fill="none" stroke="#8b7440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <ellipse cx="80" cy="65" rx="36" ry="28" />
    <circle cx="65" cy="55" r="4" />
    <circle cx="95" cy="55" r="4" />
    <path d="M60 68q4 2 8 0" />
    <path d="M92 68q4 2 8 0" />
    <path d="M80 72v4" />
    <path d="M30 98q10-3 20 0 10 3 20 0 10-3 20 0 10 3 20 0 10-3 20 0" />
    <path d="M35 104q10-2 18 0 9 2 18 0 9-2 18 0 9 2 18 0 9-2 17 0" />
    <path d="M40 110q8-2 16 0 8 2 16 0 8-2 16 0 8 2 16 0 8-2 16 0" />
  </svg>
);

const SkinToneIcon = () => (
  <svg viewBox="0 0 160 160" fill="none" stroke="#8b7440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="80" cy="80" r="55" />
    <line x1="80" y1="25" x2="80" y2="135" />
    <path d="M40 70q10-5 20 0 10 5 20 0" />
    <path d="M100 70q10-5 20 0" />
    <path d="M40 90q10-5 20 0 10 5 20 0" />
    <path d="M100 90q10-5 20 0" />
    <circle cx="60" cy="60" r="4" />
    <circle cx="100" cy="60" r="4" />
    <circle cx="55" cy="76" r="3" />
    <circle cx="105" cy="76" r="3" />
    <circle cx="58" cy="90" r="3" />
    <circle cx="102" cy="90" r="3" />
    <circle cx="52" cy="105" r="2.5" />
    <circle cx="108" cy="105" r="2.5" />
    <circle cx="62" cy="108" r="2.5" />
    <circle cx="98" cy="108" r="2.5" />
  </svg>
);

const SkinDullnessIcon = () => (
  <svg viewBox="0 0 160 160" fill="none" stroke="#8b7440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="80" cy="80" r="30" />
    <circle cx="80" cy="80" r="48" />
    <circle cx="80" cy="80" r="64" />
    <line x1="80" y1="8" x2="80" y2="22" />
    <line x1="80" y1="138" x2="80" y2="152" />
    <line x1="8" y1="80" x2="22" y2="80" />
    <line x1="138" y1="80" x2="152" y2="80" />
    <line x1="30" y1="30" x2="40" y2="40" />
    <line x1="120" y1="120" x2="130" y2="130" />
    <line x1="30" y1="130" x2="40" y2="120" />
    <line x1="120" y1="40" x2="130" y2="30" />
    <path d="M72 72l8 8 16-16" />
  </svg>
);

const SkinSensitiveIcon = () => (
  <svg viewBox="0 0 160 160" fill="none" stroke="#8b7440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M80 140s40-20 50-50V35L80 15 30 35v55c0 30 50 50 50 50z" />
    <path d="M53 68c0 10 7 15 15 15s15-5 15-15" />
    <path d="M53 62l32 32M85 62l-32 32" strokeWidth="1.2" />
    <path d="M68 55a4 4 0 0 1 8-2" />
    <circle cx="62" cy="95" r="2" />
    <circle cx="86" cy="95" r="2" />
  </svg>
);

const skinConcerns = [
  { icon: <SkinAcneIcon />, title: "Acne & Congestion", desc: "Breakouts, clogged pores and uneven texture" },
  { icon: <SkinPoresIcon />, title: "Enlarged Pores", desc: "Visible pores that appear stretched or open" },
  { icon: <SkinFineLinesIcon />, title: "Fine Lines & Wrinkles", desc: "Early signs of ageing around eyes and forehead" },
  { icon: <SkinToneIcon />, title: "Uneven Skin Tone", desc: "Discoloration, redness or patchy pigmentation" },
  { icon: <SkinDullnessIcon />, title: "Dullness", desc: "Lack of radiance and tired-looking complexion" },
  { icon: <SkinSensitiveIcon />, title: "Sensitive Skin", desc: "Easily irritated, reactive or uncomfortable skin" },
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
              <div key={item.title} className="group text-center pt-10 pb-8 px-6 md:pt-12 md:pb-10 md:px-8 rounded-2xl bg-white border border-neutral-200/60 hover:border-primary-200/60 hover:bg-primary-50/30 transition-all duration-300">
                <div className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] mx-auto mb-5 rounded-full border border-[rgba(139,116,64,0.75)] flex items-center justify-center overflow-hidden">
                  <div className="w-[68%] h-[68%]">
                    {item.icon}
                  </div>
                </div>
                <div className="w-9 h-[2px] bg-[#b79a58] mx-auto mb-4" />
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