import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Stars } from "@/components/ui/Stars";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { formatCurrency } from "@/lib/utils";
import { ALL_PRODUCTS, getProductBySlug, getAllSlugs } from "@/lib/products";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "Not Found" };

  const name = p.slug === "dna-sodium-firming-v-face-spray" ? "BELOYAN DNA Sodium Instant Firming V-Face Spray" : p.name;
  return {
    title: name + " | Enzyme Skincare",
    description: "Instant lift, long-lasting firmness and 4-week skin renewal with DNA Sodium active technology.",
    openGraph: { images: [p.images[0]] },
  };
}

const timelineData = [
  { time: "10 Seconds", label: "Instant Firming Appearance" },
  { time: "14 Days", label: "Smoother-Looking Fine Lines" },
  { time: "21 Days", label: "Improved Appearance of Nasolabial Lines" },
  { time: "28 Days", label: "More Defined Facial Contour" },
];

const howToUseCards = [
  { title: "Daily Skincare", desc: "Mist evenly onto clean skin after cleansing. Gently pat until absorbed." },
  { title: "Before Makeup", desc: "Use before foundation to create a smoother-looking base." },
  { title: "After Makeup", desc: "Lightly mist over makeup for a refreshed finish." },
  { title: "Night Repair", desc: "Apply before bedtime as part of your evening skincare routine." },
];

const suitableItems = [
  "Loss of firmness",
  "Fine lines and uneven texture",
  "Dull-looking skin",
  "Skin needing hydration and contour care",
  "Anyone seeking a lifted-looking appearance",
];

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p)
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-primary-600">&larr; Back to All Products</Link>
      </div>
    );

  // Only apply the premium layout to the firming spray product
  const isPremiumPage = p.slug === "dna-sodium-firming-v-face-spray";

  if (!isPremiumPage) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <nav className="text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-800 font-medium">{p.name}</span>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative shadow-md border border-neutral-200">
            <Image src={p.images[0]} alt={p.name} fill className="object-cover" priority sizes="(max-width:768px)100vw,50vw" />
          </div>
          <div className="flex flex-col">
            {p.badge && <div className="mb-3"><Badge type={p.badge === "BEST_SELLER" ? "best-seller" : "new"}>{p.badge === "BEST_SELLER" ? "Best Seller" : "New"}</Badge></div>}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800 mb-2">{p.name}</h1>
            <p className="text-neutral-500 mb-4">{p.tagline}</p>
            <div className="flex items-center gap-2 mb-4">
              <Stars rating={p.rating} />
              <span className="text-sm text-neutral-500">{p.rating} ({p.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-baseline gap-4 mb-5">
              <span className="text-3xl font-bold text-neutral-800">{formatCurrency(p.price)}</span>
              {p.comparePrice && <span className="text-lg text-neutral-400 line-through">{formatCurrency(p.comparePrice)}</span>}
              <span className="text-xs text-neutral-500">{p.size}</span>
            </div>
            <AddToCartButton product={p} />
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-neutral-200 text-sm text-neutral-500">
              <span>🧪 Enzyme-Powered</span>
              <span>✅ Dermatologist Tested</span>
              <span>🐰 Cruelty-Free</span>
            </div>
          </div>
        </div>
        {p.images.length > 0 && (
          <div className="mb-12 space-y-1">
            {p.images.map((img, i) => (
              <div key={i} className="w-full bg-neutral-50 rounded-2xl overflow-hidden relative border border-neutral-200 shadow-sm">
                <Image src={img} alt={p.name + " detail " + (i + 1)} width={1200} height={1200} className="w-full h-auto object-contain" sizes="(max-width:768px)100vw,80vw" priority={i < 2} />
              </div>
            ))}
          </div>
        )}
        <div className="pt-10 border-t border-neutral-200">
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-6 text-center">Complete Your Routine</h2>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {ALL_PRODUCTS.filter((op) => op.slug !== p.slug && op.isActive).slice(0, 2).map((op) => (
              <Link key={op.slug} href={"/products/" + op.slug} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-3 relative border border-neutral-200 shadow-sm">
                  <Image src={op.images[0]} alt={op.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                </div>
                <p className="text-sm font-heading font-semibold text-neutral-800">{op.name}</p>
                <p className="text-sm font-bold text-primary-700">{formatCurrency(op.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── PREMIUM LAYOUT for Firming Spray ──
  return (
    <div className="bg-white">
      {/* ====== SECTION 1: HERO ====== */}
      <section className="bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 min-h-[80vh] items-center">
            {/* Left: Text */}
            <div className="order-2 md:order-1 py-12 md:py-0">
              <p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-5">
                BELOYAN Advanced Anti-Aging Beauty Technology
              </p>
              <h1 className="font-heading text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.08] font-bold text-[#2e3a33] mb-5">
                DNA Sodium Instant Firming V-Face Spray
              </h1>
              <p className="text-base md:text-lg text-[#6b706a] leading-relaxed mb-8 max-w-lg">
                A lightweight DNA Sodium firming spray designed to support hydration, skin elasticity, and a smoother-looking facial contour.
              </p>
              <div className="space-y-3 mb-8">
                {["✓ Instant Firming Appearance", "✓ Helps Improve Skin Elasticity", "✓ Supports V-Face Contour"].map((b) => (
                  <p key={b} className="text-sm text-[#555954] font-medium">{b}</p>
                ))}
              </div>
              <div className="flex items-center gap-6">
                <AddToCartButton product={p} />
                <span className="text-sm text-[#a4a8a0]">{p.size}</span>
              </div>
            </div>
            {/* Right: Image */}
            <div className="order-1 md:order-2">
              <Image src={p.images[0]} alt="BELOYAN DNA Sodium Instant Firming V-Face Spray" width={800} height={800} className="w-full h-auto object-contain" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECTION 2: SKIN CONCERNS ====== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <Image src={p.images[1]} alt="Skin aging concerns" width={800} height={800} className="w-full h-auto object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">Skin Concerns</p>
              <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] leading-tight mb-6">
                Is Your Skin Losing Firmness?
              </h2>
              <p className="text-[#6b706a] leading-relaxed mb-8">
                As skin ages, collagen, elasticity and moisture gradually decrease, leading to visible fine lines, dullness and changes in facial definition.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["Fine Lines", "Loss of Firmness", "Facial Contour Changes"].map((item) => (
                  <div key={item} className="p-5 rounded-xl bg-[#faf8f5] border border-[#eef2ec] text-center">
                    <p className="text-sm font-semibold text-[#2e3a33]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECTION 3: TECHNOLOGY ====== */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">Technology</p>
              <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] leading-tight mb-6">
                Advanced DNA Sodium Active Technology
              </h2>
              <p className="text-[#6b706a] leading-relaxed mb-8">
                Powered by ultra-fine active molecules, the formula absorbs quickly into skin to support hydration, firmness and smoother-looking contours.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Fast Absorption", "Lightweight Mist Texture", "Non-Sticky Feel", "Daily Anti-Aging Care"].map((item) => (
                  <div key={item} className="p-4 rounded-xl bg-white border border-[#eef2ec] text-center">
                    <p className="text-sm font-medium text-[#2e3a33]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Image src={p.images[2]} alt="DNA Sodium Active Technology" width={800} height={800} className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECTION 4: CLINICAL RESULTS ====== */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">Clinical Results</p>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] mb-4">
              Visible Results After 4 Weeks
            </h2>
            <p className="text-[#6b706a]">Based on a 4-week consumer test of women aged 25–40.</p>
          </div>
          <div className="mb-12">
            <Image src={p.images[3]} alt="Clinical results timeline showing 4-week improvement" width={1400} height={700} className="w-full h-auto object-contain rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {timelineData.map((item) => (
              <div key={item.time} className="text-center p-5">
                <p className="text-xl font-bold text-[#b8a07a] mb-2">{item.time}</p>
                <p className="text-sm text-[#555954] leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 5: BEFORE & AFTER ====== */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] mb-4">
              See The Difference
            </h2>
            <p className="text-[#6b706a] max-w-xl mx-auto">
              With consistent use, skin appears smoother, firmer and more defined.
            </p>
          </div>
          <div className="mb-12">
            <Image src={p.images[4]} alt="Before and after transformation" width={1400} height={700} className="w-full h-auto object-contain rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {["Smoother-Looking Fine Lines", "Improved Skin Firmness", "More Defined Facial Contour"].map((item) => (
              <div key={item} className="p-6 rounded-xl bg-white border border-[#eef2ec] text-center shadow-sm">
                <p className="text-sm font-semibold text-[#2e3a33]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 6: HOW TO USE ====== */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">How To Use</p>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33]">
              Easy To Use, Anytime
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {howToUseCards.map((card) => (
              <div key={card.title} className="p-6 rounded-xl bg-[#faf8f5] border border-[#eef2ec]">
                <h3 className="font-heading text-lg font-semibold text-[#2e3a33] mb-3">{card.title}</h3>
                <p className="text-sm text-[#6b706a] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 7: SUITABLE FOR ====== */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 text-center">
          <p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">Suitable For</p>
          <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] mb-10">
            Designed For Your Firming Care Routine
          </h2>
          <div className="max-w-xl mx-auto space-y-4">
            {suitableItems.map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#eef2ec]">
                <span className="w-6 h-6 rounded-full bg-[#b8a07a]/10 text-[#b8a07a] flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                <span className="text-sm text-[#555954]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 8: RELATED PRODUCTS ====== */}
      {(() => {
        const others = ALL_PRODUCTS.filter((op) => op.slug !== p.slug && op.isActive).slice(0, 2);
        if (others.length === 0) return null;
        return (
          <section className="py-20 md:py-28">
            <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
              <h2 className="font-heading text-2xl font-bold text-[#2e3a33] mb-8 text-center">Complete Your Routine</h2>
              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                {others.map((op) => (
                  <Link key={op.slug} href={"/products/" + op.slug} className="group">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-[#faf8f5] mb-3 relative border border-[#eef2ec]">
                      <Image src={op.images[0]} alt={op.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                    </div>
                    <p className="text-sm font-heading font-semibold text-[#2e3a33]">{op.name}</p>
                    <p className="text-sm font-bold text-[#74906f]">{formatCurrency(op.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}
    </div>
  );
}
