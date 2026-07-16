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

  const name = p.slug === "dna-sodium-firming-v-face-spray" ? "BELOYAN DNA Sodium Instant Firming V-Face Spray" : p.slug === "active-protease-anti-wrinkle-kit" ? "Active Protease Anti-Wrinkle Kit | Enzyme Skincare" : p.slug === "blue-copper-peptide-freeze-dried-powder-set" ? "BELOYAN Blue Copper Peptide Freeze-Dried Powder Set" : p.name;
  return {
    title: name + " | Enzyme Skincare",
    description: p.slug === "blue-copper-peptide-freeze-dried-powder-set" ? "Discover BELOYAN Blue Copper Peptide Freeze-Dried Powder Set, a two-part peptide treatment designed to support skin barrier repair, firmness, hydration and smoother-looking skin." : p.slug === "rose-brightening-fermented-mask" ? "Discover BELOYAN Rose Brightening Fermented Face Mask, a plant fermented mask designed to hydrate, brighten and support healthier-looking skin." : p.slug === "active-protease-anti-wrinkle-kit" ? "Professional enzyme treatment for smoother, brighter and healthier-looking skin at home." : "Instant lift, long-lasting firmness and 4-week skin renewal with DNA Sodium active technology.",
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

  // Only apply the premium layout to the firming spray, protease, copper peptide, or rose mask product
  const isPremiumPage = p.slug === "dna-sodium-firming-v-face-spray" || p.slug === "active-protease-anti-wrinkle-kit" || p.slug === "blue-copper-peptide-freeze-dried-powder-set" || p.slug === "rose-brightening-fermented-mask";

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

  // ── PREMIUM LAYOUT for Firming Spray, Protease, or Copper Peptide ──
  const isProtease = p.slug === "active-protease-anti-wrinkle-kit";
  const isCopperPeptide = p.slug === "blue-copper-peptide-freeze-dried-powder-set";
  const isRoseMask = p.slug === "rose-brightening-fermented-mask";

  if (isRoseMask) {
    // ── ROSE MASK PREMIUM LAYOUT ──
    const benefitsCards = [
      { title: "Deep Hydration", desc: "Helps moisturize and improve the look of dryness." },
      { title: "Brightening Effect", desc: "Helps improve the appearance of dull skin tone." },
      { title: "Barrier Support", desc: "Supports a stronger and more resilient skin barrier." },
      { title: "Gentle & Natural", desc: "Plant fermented formula suitable for sensitive-looking skin." },
    ];

    const ingredientGroups = [
      { name: "Rosa Damascena Flower Extract", desc: "Rich in natural flower acids and vitamins, helps brighten skin tone.", icon: "M12 2L2 7l10 5 10-5-10-5z" },
      { name: "Tremella & Camellia Ferment", desc: "Small-molecule fermented nutrition for deep nourishment.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
      { name: "Niacinamide", desc: "Improves uneven skin tone and enhances barrier function.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" },
      { name: "Hyaluronic Acid", desc: "Deeply hydrates and helps lock in moisture.", icon: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" },
    ];

    const faqItems = [
      { q: "What skin types is this mask suitable for?", a: "The Rose Brightening Fermented Mask is formulated for all skin types, including sensitive-looking skin. A patch test is recommended before first use." },
      { q: "How often should I use the mask?", a: "We recommend using the mask 2–3 times per week as part of your regular skincare routine." },
      { q: "Can I leave the mask on overnight?", a: "No. Leave the mask on for 15–20 minutes, then rinse thoroughly with lukewarm water." },
      { q: "What does the texture feel like?", a: "The mask has a smooth, cream-gel texture that spreads easily and feels comfortable on the skin." },
    ];

    return (
      <div className="bg-white font-body">
        {/* SECTION 1 — HERO */}
        <section className="bg-[#faf7f3] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 min-h-[80vh] items-center">
              <div className="order-2 md:order-1 py-12 md:py-0">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-4">BELOYAN</p>
                <h1 className="font-heading text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.08] font-bold text-[#4a3028] mb-3">
                  Rose Brightening<br />Fermented Face Mask
                </h1>
                <p className="text-lg md:text-xl font-heading italic text-[#b8a07a] mb-5">
                  Plant Fermented Mask for Radiant, Dewy Skin
                </p>
                <p className="text-base text-[#6b706a] leading-relaxed mb-6 max-w-lg">
                  A fermented rose mask that brightens and revitalizes dull-looking skin. Fermentation unlocks concentrated antioxidants and nutrients for a radiant, dewy complexion.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                  {["Deep Hydration", "Brightening Effect", "Barrier Support", "Gentle Formula"].map(b => (
                    <span key={b} className="text-sm text-[#555954] flex items-center gap-2">
                      <span className="text-[#b8a07a] text-xs">✦</span> {b}
                    </span>
                  ))}
                </div>
                <AddToCartButton product={p} />
                <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-[#e8e0d8]">
                  {["Plant Fermented", "Gentle Formula", "Suitable for Sensitive Skin"].map(b => (
                    <span key={b} className="text-[11px] text-[#8a7a6a] bg-[#f5f0ea] px-3 py-1.5 rounded-full border border-[#e8e0d8]">{b}</span>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2 flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <Image src={p.images[0]} alt="BELOYAN Rose Brightening Fermented Face Mask" width={800} height={800} className="w-full h-auto object-contain drop-shadow-2xl" priority />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — SKIN CONCERNS */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Skin Concerns</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-4">
                  Help Restore Radiance to Dull, Tired-Looking Skin
                </h2>
                <p className="text-sm text-[#6b706a] leading-relaxed mb-8 max-w-md">
                  Daily stress, dehydration and environmental exposure can leave skin looking dull, dry and uneven.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: "Dullness", desc: "Helps restore a brighter-looking complexion." },
                    { title: "Dryness", desc: "Supports deep hydration and moisture retention." },
                    { title: "Uneven Texture", desc: "Helps improve the look of rough skin texture." },
                    { title: "Weakened Barrier", desc: "Supports a healthier-looking skin barrier." },
                  ].map(c => (
                    <div key={c.title} className="p-4 rounded-xl bg-[#faf7f3] border border-[#e8e0d8] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      <p className="text-sm font-semibold text-[#4a3028] mb-1">{c.title}</p>
                      <p className="text-xs text-[#6b706a]">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[1]} alt="Skin concerns addressed by BELOYAN Rose Mask" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — PRODUCT BENEFITS */}
        <section className="py-20 md:py-28 bg-[#faf7f3]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[2]} alt="BELOYAN Rose Mask product benefits" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
              <div className="order-2">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Product Benefits</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-4">
                  Simplified Skincare. Four Key Benefits.
                </h2>
                <p className="text-sm text-[#6b706a] leading-relaxed mb-8 max-w-md">
                  A fermented rose mask designed to hydrate, brighten, repair and soothe in one simple step.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {benefitsCards.map(c => (
                    <div key={c.title} className="p-4 rounded-xl bg-white border border-[#e8e0d8] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      <p className="text-sm font-semibold text-[#4a3028] mb-1">{c.title}</p>
                      <p className="text-xs text-[#6b706a]">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — FERMENTATION TECHNOLOGY */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Fermentation Technology</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-4">
                  The Power of Plant Fermentation
                </h2>
                <p className="text-sm text-[#6b706a] leading-relaxed mb-8 max-w-md">
                  Fermentation naturally breaks down active ingredients into smaller molecules, helping them absorb more effectively into the skin while preserving the integrity of botanical nutrients.
                </p>
                <div className="space-y-3">
                  {[
                    { title: "Concentrated Nutrition", desc: "Fermentation releases concentrated antioxidants and nutrients from plant sources." },
                    { title: "Enhanced Absorption", desc: "Small-molecule ferment essence penetrates deeper for more effective care." },
                    { title: "Gentle on Skin", desc: "The natural fermentation process produces a温和 formula suitable for sensitive-looking skin." },
                  ].map((item, i) => (
                    <div key={item.title} className="flex items-center gap-4 p-4 rounded-xl bg-[#faf7f3] border border-[#e8e0d8] transition-all duration-300 hover:shadow-md">
                      <div className="w-9 h-9 min-w-[36px] rounded-full bg-[#e8e0d8] flex items-center justify-center text-[#b8a07a] font-heading font-bold text-sm">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#4a3028]">{item.title}</p>
                        <p className="text-xs text-[#6b706a]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[3]} alt="BELOYAN Rose Mask fermentation technology illustration" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — KEY INGREDIENTS */}
        <section className="py-20 md:py-28 bg-[#faf7f3]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Key Ingredients</p>
              <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] mb-4">
                Nature-Inspired, Science-Backed
              </h2>
              <p className="text-sm text-[#6b706a] max-w-xl mx-auto">
                A blend of botanical extracts and active ingredients designed to hydrate, brighten and support the skin barrier.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 max-w-4xl mx-auto">
              <div className="rounded-2xl overflow-hidden shadow-md"><Image src={p.images[4]} alt="Rosa Damascena Flower Extract key ingredient" width={800} height={800} className="w-full h-auto object-contain" /></div>
              <div className="rounded-2xl overflow-hidden shadow-md"><Image src={p.images[5]} alt="Tremella and Camellia Ferment key ingredient" width={800} height={800} className="w-full h-auto object-contain" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {ingredientGroups.map(c => (
                <div key={c.name} className="p-5 rounded-xl bg-white border border-[#e8e0d8] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="w-9 h-9 rounded-full bg-[#faf7f3] flex items-center justify-center text-[#b8a07a] mb-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5"><path d={c.icon} /></svg>
                  </div>
                  <p className="text-sm font-semibold text-[#4a3028] mb-1">{c.name}</p>
                  <p className="text-xs text-[#6b706a]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — BIOMEMBRANE TECHNOLOGY */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[6]} alt="BELOYAN Biomembrane Radiance Technology diagram" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
              <div className="order-2">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Biomembrane Technology</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-4">
                  Biomembrane Radiance Technology
                </h2>
                <p className="text-sm text-[#6b706a] leading-relaxed mb-8 max-w-md">
                  Uses natural plant fermentation to produce a bioactive membrane that forms a breathable protective layer on the skin surface, helping lock in moisture and active ingredients while giving the skin a naturally radiant glow.
                </p>
                <div className="space-y-3">
                  {[
                    { title: "Breathable Protection", desc: "Forms a lightweight film that protects without clogging pores." },
                    { title: "Moisture Lock", desc: "Helps seal in hydration and active ingredients for prolonged effectiveness." },
                    { title: "Radiant Glow", desc: "Supports a naturally dewy and luminous-looking complexion." },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-[#faf7f3] border border-[#e8e0d8]">
                      <span className="w-2 h-2 min-w-[8px] rounded-full bg-[#b8a07a] mt-1.5" />
                      <div>
                        <p className="text-sm font-semibold text-[#4a3028]">{item.title}</p>
                        <p className="text-xs text-[#6b706a]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — MASK MATERIAL */}
        <section className="py-20 md:py-28 bg-[#faf7f3]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Mask Material</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-4">
                  Comfortable, Breathable and Effective
                </h2>
                <p className="text-sm text-[#6b706a] leading-relaxed mb-8 max-w-md">
                  The mask is formulated with a smooth, cream-gel texture that spreads evenly and sits comfortably on the skin without dripping or feeling heavy.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Smooth Application", "Non-Drip Formula", "Comfortable Feel"].map(item => (
                    <div key={item} className="p-4 rounded-xl bg-white border border-[#e8e0d8] text-center">
                      <p className="text-sm font-semibold text-[#4a3028]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[7]} alt="BELOYAN Rose Mask texture and material" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 — EFFECTIVENESS TEST */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Effectiveness</p>
              <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] mb-4">
                Formulated for Visible Results
              </h2>
              <p className="text-sm text-[#6b706a] max-w-xl mx-auto">The formula combines plant fermentation with active ingredients to support hydration, brightness and barrier health.</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md mb-10">
              <Image src={p.images[8]} alt="BELOYAN Rose Mask effectiveness test results" width={1400} height={700} className="w-full h-auto object-contain" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[["Deep Hydration","Helps moisturize and improve dryness"],["Brightening","Supports a more radiant-looking complexion"],["Barrier Support","Helps strengthen the skin barrier"],["Gentle Care","Suitable for sensitive-looking skin"]].map(([t, d]) => (
                <div key={t} className="p-5 rounded-xl bg-[#faf7f3] border border-[#e8e0d8] text-center">
                  <p className="text-sm font-semibold text-[#4a3028] mb-1">{t}</p>
                  <p className="text-xs text-[#6b706a]">{d}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-[#8a7a6a] mt-6">Individual results may vary.</p>
          </div>
        </section>

        {/* SECTION 9 — FORMULA STANDARDS */}
        <section className="py-20 md:py-28 bg-[#faf7f3]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[9]} alt="BELOYAN Rose Mask free-from formula claims" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
              <div className="order-2">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Formula Standards</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-4">
                  Clean, Gentle and Thoughtfully Formulated
                </h2>
                <p className="text-sm text-[#6b706a] leading-relaxed mb-8 max-w-md">No alcohol, no artificial colors, no mineral oil. Suitable for all skin types including sensitive-looking skin.</p>
                <div className="grid grid-cols-2 gap-3">
                  {["No Alcohol","No Artificial Colors","No Mineral Oil","Hypoallergenic Tested"].map(item => (
                    <div key={item} className="flex items-center gap-2 p-3 rounded-lg bg-white border border-[#e8e0d8]">
                      <div className="w-5 h-5 min-w-[20px] rounded-full bg-[#b8a07a]/10 text-[#b8a07a] flex items-center justify-center">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-xs font-medium text-[#4a3028]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10 — PRODUCT INFORMATION */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Product Information</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-6">
                  Complete Product Details
                </h2>
                <div className="space-y-2">
                  {[
                    { label: "Product Name", value: "Rose Brightening Fermented Face Mask" },
                    { label: "Net Weight", value: "25 mL per sheet" },
                    { label: "Shelf Life", value: "3 years (unopened)" },
                    { label: "Skin Type", value: "All skin types, including sensitive" },
                    { label: "Storage", value: "Cool, dry place away from direct sunlight" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between p-3 rounded-lg bg-[#faf7f3] border border-[#e8e0d8]">
                      <span className="text-sm text-[#6b706a]">{row.label}</span>
                      <span className="text-sm font-semibold text-[#4a3028]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[10]} alt="BELOYAN Rose Mask product information and specifications" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 11 — HOW TO USE */}
        <section className="py-20 md:py-28 bg-[#faf7f3]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">How To Use</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-6">
                  Simple Application for Daily Radiance
                </h2>
                <div className="space-y-3">
                  {[
                    { title: "Cleanse", desc: "Start with clean, dry skin." },
                    { title: "Apply", desc: "Take an appropriate amount and apply evenly to face, avoiding the eye area." },
                    { title: "Wait", desc: "Leave on for 15–20 minutes." },
                    { title: "Remove", desc: "Remove the mask and gently pat the remaining essence into your skin until fully absorbed. No rinsing required." },
                  ].map((s, i) => (
                    <div key={s.title} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#e8e0d8] transition-all duration-300 hover:shadow-md">
                      <div className="w-9 h-9 min-w-[36px] rounded-full bg-[#b8a07a] text-white flex items-center justify-center text-sm font-bold font-heading">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#4a3028]">{s.title}</p>
                        <p className="text-xs text-[#6b706a]">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#6b706a] mt-4 text-center bg-white rounded-lg p-3 border border-[#e8e0d8]">
                  <span className="font-semibold text-[#b8a07a]">Recommended frequency:</span> 2–3 times per week
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[11]} alt="How to use BELOYAN Rose Mask step by step" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 12 — PRODUCT PACKAGING */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <Image src={p.images[12]} alt="BELOYAN Rose Mask product packaging design" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
              <div className="order-2">
                <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Packaging</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] leading-tight mb-4">
                  Elegant Packaging, Thoughtful Design
                </h2>
                <p className="text-sm text-[#6b706a] leading-relaxed mb-6 max-w-md">
                  The mask is presented in elegant, premium packaging that reflects the natural, botanical essence of the formula. Designed to preserve freshness and complement your skincare ritual.
                </p>
                <div className="flex items-center gap-3 text-sm text-[#4a3028]">
                  <span className="w-6 h-6 rounded-full bg-[#b8a07a]/10 text-[#b8a07a] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  Premium quality packaging
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 13 — SUITABLE FOR */}
        <section className="py-20 md:py-28 bg-[#faf7f3]">
          <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 text-center">
            <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3">Suitable For</p>
            <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#4a3028] mb-10">
              Designed for All Skin Types
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {["Dry Skin","Dull Complexion","Uneven Skin Tone","Sensitive-Looking Skin","Dehydrated Skin","All Skin Types"].map(item => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#e8e0d8] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="w-6 h-6 min-w-[24px] rounded-full bg-[#b8a07a] text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span className="text-sm font-medium text-[#4a3028]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 14 — FAQ */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-12">
            <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.22em] uppercase mb-3 text-center">FAQ</p>
            <h2 className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-[#4a3028] text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqItems.map((faq, i) => (
                <details key={i} className="group rounded-xl bg-[#faf7f3] border border-[#e8e0d8] overflow-hidden transition-all duration-300 open:shadow-md">
                  <summary className="flex items-center justify-between px-6 py-5 text-sm font-semibold text-[#4a3028] cursor-pointer list-none select-none">
                    {faq.q}
                    <span className="text-[#b8a07a] text-xl font-light leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-6 pb-5"><p className="text-sm text-[#6b706a]">{faq.a}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 15 — WHATSAPP */}
        <section className="py-16 bg-[#faf7f3] border-t border-[#e8e0d8]">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <p className="text-lg font-heading font-bold text-[#4a3028] mb-2">Chat with Us on WhatsApp</p>
            <p className="text-sm text-[#6b706a] mb-6 max-w-sm mx-auto">Have questions about the Rose Brightening Fermented Mask? Message us on WhatsApp for product guidance and skincare advice.</p>
            <a href="https://wa.me/8613980551004" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-colors">Chat on WhatsApp</a>
          </div>
        </section>

        {/* SECTION 16 — BRAND ENDING */}
        <section className="py-20 bg-white">
          <div className="max-w-lg mx-auto px-4 text-center">
            <p className="text-[clamp(28px,4vw,44px)] font-heading font-bold text-[#4a3028] tracking-[0.1em] mb-2">BELOYAN</p>
            <p className="text-xs font-semibold text-[#b8a07a] tracking-[0.2em] uppercase mb-4">Professional Beauty Technology</p>
            <p className="text-sm text-[#6b706a] leading-relaxed">Advanced skincare formulas inspired by professional beauty science and created to support healthier-looking, more resilient skin.</p>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {(() => {
          const others = ALL_PRODUCTS.filter((op) => op.slug !== p.slug && op.isActive).slice(0, 2);
          if (others.length === 0) return null;
          return (
            <section className="py-16 bg-[#faf7f3] border-t border-[#e8e0d8]">
              <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
                <h2 className="font-heading text-xl font-bold text-[#4a3028] mb-8 text-center">Complete Your Routine</h2>
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  {others.map((op) => (
                    <Link key={op.slug} href={"/products/" + op.slug} className="group">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#faf7f3] mb-3 relative border border-[#e8e0d8] shadow-sm group-hover:shadow-md transition-all duration-300">
                        <Image src={op.images[0]} alt={op.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                      </div>
                      <p className="text-sm font-heading font-semibold text-[#4a3028] group-hover:text-[#b8a07a] transition-colors">{op.name}</p>
                      <p className="text-sm font-bold text-[#b8a07a]">{formatCurrency(op.price)}</p>
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

  if (isCopperPeptide) {
    const concernCards = [
      { title: "Dryness and Tightness", desc: "Skin may feel uncomfortable, rough or dehydrated." },
      { title: "Visible Redness", desc: "Stressed-looking skin can appear uneven and reactive." },
      { title: "Fine Lines", desc: "Loss of moisture and elasticity can make lines more visible." },
      { title: "Loss of Firmness", desc: "Reduced resilience can affect the appearance of facial contours." },
      { title: "Weakened Skin Barrier", desc: "Compromised skin may become more prone to dryness and sensitivity." },
    ];

    const benefitCards = [
      { title: "Barrier Support", desc: "Helps maintain a stronger and more resilient-looking skin barrier." },
      { title: "Firming Care", desc: "Supports firmer-looking skin and improved elasticity." },
      { title: "Fine Line Care", desc: "Helps soften the appearance of visible fine lines." },
      { title: "Soothing Support", desc: "Helps comfort stressed and redness-prone-looking skin." },
      { title: "Deep Hydration", desc: "Replenishes moisture for softer and smoother-feeling skin." },
      { title: "Refined Texture", desc: "Helps improve the appearance of roughness and enlarged pores." },
    ];

    const techCards = [
      { title: "Low-Temperature Freeze-Drying", desc: "Helps preserve ingredient freshness during production." },
      { title: "Vacuum Sealing", desc: "Protects the freeze-dried powder before activation." },
      { title: "Fresh Activation", desc: "Powder and solution are mixed before use for a freshly prepared treatment." },
    ];

    const ingredientItems = [
      { name: "Copper Tripeptide-1", desc: "Supports skin firmness, resilience and a healthier-looking barrier." },
      { name: "Oligopeptide-1", desc: "Helps support smoother-looking texture and skin renewal care." },
      { name: "Acetyl Hexapeptide-8", desc: "Helps soften the appearance of expression lines." },
      { name: "Hydrolyzed Collagen", desc: "Supports a soft, conditioned and supple skin feel." },
      { name: "Beta-Glucan", desc: "Helps comfort dry, stressed and sensitive-looking skin." },
      { name: "Gentian Root Extract", desc: "Provides botanical soothing and antioxidant care." },
      { name: "Serum Protein", desc: "Supports moisture retention and a smoother skin feel." },
    ];

    const resultCards = [
      { title: "Improved Firmness", desc: "Supports firmer and more resilient-looking skin." },
      { title: "Reduced Appearance of Fine Lines", desc: "Helps soften visible marks and expression lines." },
      { title: "Refined Pore Appearance", desc: "Helps improve the appearance of enlarged pores." },
      { title: "Balanced Oiliness", desc: "Helps support a fresher and more balanced-looking complexion." },
    ];

    const howToSteps = [
      { step: "1", title: "Open", desc: "Open one freeze-dried powder vial and one activating solution vial." },
      { step: "2", title: "Combine", desc: "Pour the activating solution into the freeze-dried powder vial." },
      { step: "3", title: "Mix", desc: "Shake gently until the powder is fully dissolved." },
      { step: "4", title: "Apply", desc: "Apply the freshly mixed solution evenly to clean skin." },
      { step: "5", title: "Absorb", desc: "Gently pat or massage until fully absorbed." },
      { step: "6", title: "Follow", desc: "Continue with moisturizer or a hydrating recovery mask if desired." },
    ];

    const freeFromItems = ["No Alcohol", "No Added Pigments", "No Fluorescent Agents", "No Mineral Oil", "No Added Hormones", "No Heavy Metals"];
    const patentCards = [
      { title: "Patented Freeze-Drying Process", desc: "Helps preserve ingredient freshness and stability." },
      { title: "Professional Manufacturing Standards", desc: "Manufactured in facilities with quality and safety certifications." },
      { title: "Innovative Dual-Bottle System", desc: "Designed to protect active ingredients until the moment of activation." },
    ];
    const cpSuitableItems = ["Sensitive-Looking Skin", "Skin Prone to Redness", "Dry or Dehydrated Skin", "Fine Lines and Early Aging", "Loss of Firmness", "Weak or Stressed-Looking Skin Barrier"];
    const sensoryCards = [
      { title: "Light Blue Texture", desc: "Fresh and lightweight appearance." },
      { title: "Fast Absorption", desc: "Absorbs comfortably into the skin." },
      { title: "Hydrating Finish", desc: "Leaves skin feeling refreshed, soft and moisturized." },
    ];
    const faqItems = [
      { q: "Why are the powder and activating solution packaged separately?", a: "The two-part system helps preserve the freshness of the freeze-dried powder until it is mixed immediately before use." },
      { q: "How do I activate the freeze-dried powder?", a: "Pour one vial of activating solution into one vial of powder and shake gently until fully dissolved." },
      { q: "How many treatments are included?", a: "Each box contains 10 complete powder and activating solution sets." },
      { q: "What does the texture feel like?", a: "The freshly mixed solution has a lightweight, watery texture that absorbs quickly without a heavy feel." },
      { q: "Is it suitable for sensitive-looking skin?", a: "Yes. This blue copper peptide freeze-dried powder is suitable for sensitive skin and skin with a weakened moisture barrier. Its gentle formula helps support the skin barrier, boost hydration, and soothe dryness and discomfort." },
      { q: "Can I use it with other skincare products?", a: "Yes. Apply the freshly activated solution after cleansing, then follow with moisturizer or other gentle skincare products." },
    ];

    return (
      <div className="bg-white font-body">
        {/* SECTION 1 — HERO */}
        <section className="bg-cp-gradient relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10 min-h-[80vh] flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full items-center">
              <div className="order-2 md:order-1 py-12 md:py-0">
                <p className="text-xs font-semibold text-[#8ab4c8] tracking-[0.22em] uppercase mb-4">ADVANCED BLUE COPPER PEPTIDE CARE</p>
                <h1 className="font-heading text-[clamp(1.8rem,4.2vw,3.5rem)] leading-[1.08] font-bold text-white mb-3">
                  BELOYAN Blue Copper Peptide<br />Repair &amp; Anti-Wrinkle<br />Freeze-Dried Powder Set
                </h1>
                <p className="text-lg md:text-xl font-heading italic text-[#8ab4c8] mb-5">Reawaken Firmer, Calmer and More Resilient-Looking Skin</p>
                <p className="text-base text-white/75 leading-relaxed mb-6 max-w-lg">
                  A professional two-part freeze-dried powder treatment powered by Blue Copper Peptide and advanced peptide technology to support barrier repair, firmness, hydration and smoother-looking skin.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Barrier Repair", "Firming Support", "Fine Line Care", "Soothing Hydration"].map(b => (
                    <span key={b} className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/85">{b}</span>
                  ))}
                </div>
                <AddToCartButton product={p} />
                <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-white/10">
                  {["Two-Part Fresh Activation", "Peptide-Powered Formula", "Designed for Sensitive-Looking Skin"].map(b => (
                    <span key={b} className="text-[11px] text-white/55 bg-white/6 px-3 py-1.5 rounded-full border border-white/10">{b}</span>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2 flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <Image src={p.images[0]} alt="BELOYAN Blue Copper Peptide Freeze-Dried Powder Set" width={800} height={800} className="w-full h-auto object-contain drop-shadow-2xl" priority />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — SKIN CONCERNS */}
        <section className="py-20 md:py-28 bg-[#f5f8fc]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1">
                <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)]">
                  <Image src={p.images[1]} alt="Skin concerns showing barrier stress signs" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
              <div className="order-2">
                <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">WHEN SKIN NEEDS MORE SUPPORT</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] leading-tight mb-4">Is Your Skin Showing Signs of Barrier Stress and Early Aging?</h2>
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-8 max-w-md">Daily stress, dehydration and reduced skin resilience can lead to visible redness, dryness, fine lines, rough texture and loss of firmness.</p>
                <div className="space-y-3">
                  {concernCards.map(c => (
                    <div key={c.title} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#d0dce8] shadow-[0_4px_24px_rgba(26,58,92,0.04)] hover:shadow-[0_12px_40px_rgba(26,58,92,0.08)] transition-all duration-300 hover:-translate-y-0.5">
                      <div className="w-8 h-8 min-w-[32px] rounded-full bg-[#eef4fa] flex items-center justify-center text-[#1a3a5c]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0f2840] mb-0.5">{c.title}</p>
                        <p className="text-xs text-[#5a6a7a]">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — PRODUCT BENEFITS */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">MULTI-ACTION PEPTIDE CARE</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] leading-tight mb-4">Repair, Firm and Replenish in One Advanced Treatment</h2>
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-8 max-w-md">The blue copper peptide freeze-dried powder set combines professional peptide care with a freshly activated application system to support stronger, smoother and healthier-looking skin.</p>
                <div className="grid grid-cols-2 gap-3">
                  {benefitCards.map(c => (
                    <div key={c.title} className="p-4 rounded-xl bg-[#f5f8fc] border border-[#d0dce8] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)] hover:-translate-y-0.5">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1a3a5c] mb-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <p className="text-sm font-semibold text-[#0f2840] mb-0.5">{c.title}</p>
                      <p className="text-xs text-[#5a6a7a]">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)]">
                  <Image src={p.images[2]} alt="Product benefits illustration" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — FRESH-LOCK TECHNOLOGY */}
        <section className="py-20 md:py-28 bg-[#f5f8fc]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">BIOTECHNOLOGY FREEZE-DRIED FRESHNESS</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] leading-tight mb-4">Freshly Activated Performance in Every Application</h2>
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-8 max-w-md">The freeze-drying process helps preserve the freshness and stability of active ingredients until the powder is mixed with the activating solution.</p>
                <div className="space-y-3">
                  {techCards.map((c, i) => (
                    <div key={c.title} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#d0dce8] shadow-[0_4px_24px_rgba(26,58,92,0.04)] hover:shadow-[0_12px_40px_rgba(26,58,92,0.08)] transition-all duration-300">
                      <div className="w-9 h-9 min-w-[36px] rounded-full bg-[#eef4fa] flex items-center justify-center text-[#1a3a5c]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          {i === 0 ? <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> :
                           i === 1 ? <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/> :
                           <polyline points="20 6 9 17 4 12"/>}
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0f2840]">{c.title}</p>
                        <p className="text-xs text-[#5a6a7a]">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)]">
                  <Image src={p.images[3]} alt="Fresh-Lock freeze-drying technology diagram" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — KEY INGREDIENTS */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">PEPTIDE-POWERED FORMULA</p>
              <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] mb-4">The Power of Blue Copper Peptide</h2>
              <p className="text-sm text-[#5a6a7a] max-w-xl mx-auto">Blue Copper Peptide, also known as Copper Tripeptide-1, is combined with complementary peptides and skin-conditioning ingredients to support firmness, hydration and barrier care.</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)] mb-10 max-w-3xl mx-auto">
              <Image src={p.images[4]} alt="Key ingredients: copper tripeptide and peptides" width={1200} height={600} className="w-full h-auto object-contain" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {ingredientItems.map(c => (
                <div key={c.name} className="p-5 rounded-xl bg-[#f5f8fc] border border-[#d0dce8] hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)] hover:-translate-y-0.5 transition-all duration-300">
                  <p className="text-sm font-semibold text-[#1a3a5c] mb-1">{c.name}</p>
                  <p className="text-xs text-[#5a6a7a]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — INGREDIENT FUNCTIONS */}
        <section className="py-20 md:py-28 bg-[#f5f8fc]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1">
                <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)]">
                  <Image src={p.images[5]} alt="Ingredient functions diagram" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
              <div className="order-2">
                <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">A BALANCED REPAIR COMPLEX</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] leading-tight mb-4">Multiple Actives Working Together for Better-Looking Skin</h2>
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-8 max-w-md">The formula combines peptides, humectants and botanical ingredients to address hydration, barrier resilience, firmness and visible signs of stress.</p>
                <div className="space-y-3">
                  {[
                    { name: "Blue Copper Peptide Complex", desc: "Supports repair care, skin firmness and collagen-supporting routines." },
                    { name: "Peptide and Hyaluronic Support", desc: "Helps maintain hydration and soften the appearance of fine lines." },
                    { name: "Botanical Comfort Complex", desc: "Helps soothe dryness, redness and discomfort." },
                  ].map(g => (
                    <div key={g.name} className="relative overflow-hidden rounded-xl bg-white border border-[#d0dce8] p-5 hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)] transition-all duration-300">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1a3a5c] to-[#8ab4c8]" />
                      <p className="text-sm font-semibold text-[#1a3a5c] mb-1">{g.name}</p>
                      <p className="text-xs text-[#5a6a7a]">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — DUAL-BOTTLE ACTIVATION SYSTEM */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">TWO-PART FRESH ACTIVATION</p>
              <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] mb-4">Powder and Activator, Designed to Work Together</h2>
              <p className="text-sm text-[#5a6a7a] max-w-xl mx-auto">The treatment uses two separate components that are mixed before application, helping maintain ingredient freshness and create a lightweight, fast-absorbing solution.</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)] mb-10 max-w-3xl mx-auto">
              <Image src={p.images[6]} alt="Dual-bottle activation system" width={1200} height={600} className="w-full h-auto object-contain" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-[#f5f8fc] border border-[#d0dce8] hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)] transition-all duration-300">
                <p className="text-sm font-semibold text-[#1a3a5c] mb-4">Blue Copper Peptide<br />Freeze-Dried Powder</p>
                <div className="space-y-1.5">
                  {["Supports barrier repair", "Helps improve skin elasticity", "Supports smoother-looking skin", "Provides concentrated peptide care"].map(item => (
                    <p key={item} className="text-xs text-[#5a6a7a] flex items-center gap-2"><span className="text-[#8ab4c8]">✦</span> {item}</p>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-[#f5f8fc] border border-[#d0dce8] hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)] transition-all duration-300">
                <p className="text-sm font-semibold text-[#1a3a5c] mb-4">Blue Copper Peptide<br />Activating Solution</p>
                <div className="space-y-1.5">
                  {["Provides moisture support", "Helps dissolve and activate the powder", "Creates a fresh, lightweight texture", "Supports comfortable absorption"].map(item => (
                    <p key={item} className="text-xs text-[#5a6a7a] flex items-center gap-2"><span className="text-[#8ab4c8]">✦</span> {item}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px bg-gradient-to-r from-transparent via-[#8ab4c8] to-transparent flex-1 max-w-16" />
              <span className="text-[11px] font-semibold text-[#1a3a5c] tracking-[0.1em] uppercase">Mix Before Use</span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#8ab4c8] to-transparent flex-1 max-w-16" />
            </div>
            <div className="text-center p-5 rounded-xl bg-[#1a3a5c] text-white max-w-md mx-auto shadow-[0_12px_40px_rgba(26,58,92,0.08)]">
              <p className="text-sm font-semibold">Freshly Activated Peptide Treatment</p>
            </div>
          </div>
        </section>

        {/* SECTION 8 — EFFECTIVENESS RESULTS */}
        <section className="py-20 md:py-28 bg-[#f5f8fc]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">VISIBLE RESULTS</p>
              <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] mb-4">Stronger-Looking Skin with Consistent Care</h2>
              <p className="text-sm text-[#5a6a7a] max-w-xl mx-auto">Testing demonstrated visible improvements in firmness, fine lines, pores and overall skin condition after continued use.</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)] mb-10">
              <Image src={p.images[7]} alt="Effectiveness results showing improvements in firmness, lines and pores" width={1400} height={700} className="w-full h-auto object-contain" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {resultCards.map(c => (
                <div key={c.title} className="p-5 rounded-xl bg-white border border-[#d0dce8] text-center hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)] transition-all duration-300">
                  <p className="text-sm font-semibold text-[#1a3a5c] mb-1">{c.title}</p>
                  <p className="text-xs text-[#5a6a7a]">{c.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-[#8a9aaa] mt-6">Individual results may vary.</p>
          </div>
        </section>

        {/* SECTION 9 — PRODUCT DETAILS */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">COMPLETE PROFESSIONAL TREATMENT SET</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] leading-tight mb-6">Everything You Need for a Freshly Activated Peptide Ritual</h2>
                <div className="space-y-2">
                  {[
                    { label: "Freeze-Dried Powder", value: "100 mg per vial" },
                    { label: "Activating Solution", value: "3 ml per vial" },
                    { label: "Quantity", value: "10 complete sets per box" },
                    { label: "Package Contents", value: "10 Powder + 10 Solution vials" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between p-3.5 rounded-lg bg-[#f5f8fc] border border-[#d0dce8]">
                      <span className="text-sm text-[#5a6a7a]">{row.label}</span>
                      <span className="text-sm font-semibold text-[#0f2840]">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-[#1a3a5c] text-white text-center shadow-[0_12px_40px_rgba(26,58,92,0.08)] flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8ab4c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-sm font-semibold">Ten Individually Prepared Treatments</span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)]">
                  <Image src={p.images[8]} alt="Product details and packaging" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10 — HOW TO USE */}
        <section className="py-20 md:py-28 bg-[#f5f8fc]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">FRESHLY ACTIVATE BEFORE USE</p>
              <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840]">How to Prepare and Apply</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {howToSteps.map(s => (
                <div key={s.step} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#d0dce8] hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)] transition-all duration-300">
                  <div className="w-9 h-9 min-w-[36px] rounded-full bg-[#1a3a5c] text-white flex items-center justify-center text-sm font-bold font-heading">{s.step.padStart(2, '0')}</div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f2840] mb-0.5">{s.title}</p>
                    <p className="text-xs text-[#5a6a7a]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-xl bg-white border border-[#d0dce8] text-center max-w-lg mx-auto">
              <p className="text-xs text-[#5a6a7a]"><span className="font-semibold text-[#1a3a5c]">Recommended use:</span> Follow the frequency shown on the product packaging or professional skincare guidance.</p>
            </div>
          </div>
        </section>

        {/* SECTION 11 — FREE-FROM FORMULA */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1">
                <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)]">
                  <Image src={p.images[9]} alt="Free-from formula claims" width={800} height={800} className="w-full h-auto object-contain" />
                </div>
              </div>
              <div className="order-2">
                <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">GENTLE FORMULA STANDARDS</p>
                <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] leading-tight mb-4">Thoughtfully Formulated for Comfortable Care</h2>
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-8 max-w-md">The formula is designed without several commonly avoided ingredients, making it suitable for a refined and gentle skincare routine.</p>
                <div className="grid grid-cols-2 gap-3">
                  {freeFromItems.map(item => (
                    <div key={item} className="flex items-center gap-2 p-3.5 rounded-lg bg-[#f5f8fc] border border-[#d0dce8] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)]">
                      <div className="w-6 h-6 min-w-[24px] rounded-full bg-[#1a3a5c]/10 text-[#1a3a5c] flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-xs font-medium text-[#0f2840]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 12 — PATENTS AND QUALITY */}
        <section className="py-20 md:py-28 bg-[#f5f8fc]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">PATENTED TECHNOLOGY AND QUALITY ASSURANCE</p>
              <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] mb-4">Backed by Innovation and Professional Manufacturing</h2>
              <p className="text-sm text-[#5a6a7a] max-w-xl mx-auto">The product is supported by patented technology and quality-focused manufacturing processes designed to protect ingredient freshness, stability and performance.</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(26,58,92,0.08)] mb-10 max-w-3xl mx-auto">
              <Image src={p.images[10]} alt="Patents and quality certifications" width={1200} height={600} className="w-full h-auto object-contain" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {patentCards.map(c => (
                <div key={c.title} className="p-6 rounded-xl bg-white border border-[#d0dce8] text-center hover:shadow-[0_12px_40px_rgba(26,58,92,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#eef4fa] flex items-center justify-center mx-auto mb-3 text-[#1a3a5c]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <p className="text-sm font-semibold text-[#0f2840] mb-2">{c.title}</p>
                  <p className="text-xs text-[#5a6a7a]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 13 — SUITABLE FOR */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 text-center">
            <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3">DESIGNED FOR</p>
            <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] mb-10">Advanced Care for Skin That Needs Repair and Resilience</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {cpSuitableItems.map(item => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-[#f5f8fc] border border-[#d0dce8] hover:shadow-[0_4px_24px_rgba(26,58,92,0.06)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-6 h-6 min-w-[24px] rounded-full bg-[#1a3a5c] text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span className="text-sm font-medium text-[#0f2840]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 14 — TEXTURE AND EXPERIENCE */}
        <section className="py-20 md:py-28 bg-[#f5f8fc]">
          <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 text-center">
            <h2 className="font-heading text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold text-[#0f2840] mb-4">Lightweight, Fresh and Fast-Absorbing</h2>
            <p className="text-sm text-[#5a6a7a] max-w-xl mx-auto mb-10">Once activated, the formula has a light blue, watery texture that absorbs quickly without leaving a heavy or greasy finish.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {sensoryCards.map((c, i) => (
                <div key={c.title} className="p-7 rounded-xl bg-white border border-[#d0dce8] hover:shadow-[0_12px_40px_rgba(26,58,92,0.08)] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#eef4fa] flex items-center justify-center mx-auto mb-4 text-[#1a3a5c]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      {i === 0 ? <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/><circle cx="12" cy="12" r="3"/></> :
                       i === 1 ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> :
                       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                    </svg>
                  </div>
                  <p className="text-base font-heading font-semibold text-[#0f2840] mb-2">{c.title}</p>
                  <p className="text-xs text-[#5a6a7a]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 15 — FAQ */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-12">
            <p className="text-xs font-semibold text-[#3a7ab5] tracking-[0.22em] uppercase mb-3 text-center">FREQUENTLY ASKED QUESTIONS</p>
            <h2 className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-[#0f2840] text-center mb-10">Everything You Need to Know</h2>
            <div className="space-y-3">
              {faqItems.map((faq, i) => (
                <details key={i} className="group rounded-xl bg-[#f5f8fc] border border-[#d0dce8] overflow-hidden transition-all duration-300 open:shadow-[0_4px_24px_rgba(26,58,92,0.06)]">
                  <summary className="flex items-center justify-between px-6 py-5 text-sm font-semibold text-[#0f2840] cursor-pointer list-none select-none">
                    {faq.q}
                    <span className="text-[#1a3a5c] text-xl font-light leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-6 pb-5"><p className="text-sm text-[#5a6a7a]">{faq.a}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 16 — WHATSAPP SUPPORT */}
        <section className="py-16 bg-[#f5f8fc] border-t border-[#d0dce8]">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <p className="text-lg font-heading font-bold text-[#0f2840] mb-2">Chat with Us on WhatsApp</p>
            <p className="text-sm text-[#5a6a7a] mb-6 max-w-sm mx-auto">Have questions about the Blue Copper Peptide Freeze-Dried Powder Set? Message us on WhatsApp and our skincare team will help with activation, application and routine guidance.</p>
            <a href="https://wa.me/8613980551004" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-colors">Chat on WhatsApp</a>
          </div>
        </section>

        {/* SECTION 17 — BRAND ENDING */}
        <section className="py-20 bg-white">
          <div className="max-w-lg mx-auto px-4 text-center">
            <p className="text-[clamp(28px,4vw,44px)] font-heading font-bold text-[#1a3a5c] tracking-[0.1em] mb-2">BELOYAN</p>
            <p className="text-xs font-semibold text-[#8ab4c8] tracking-[0.2em] uppercase mb-4">Professional Beauty Technology</p>
            <p className="text-sm text-[#5a6a7a] leading-relaxed">Advanced skincare formulas inspired by professional beauty science and created to support healthier-looking, more resilient skin.</p>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {(() => {
          const others = ALL_PRODUCTS.filter((op) => op.slug !== p.slug && op.isActive).slice(0, 2);
          if (others.length === 0) return null;
          return (
            <section className="py-16 bg-[#f5f8fc] border-t border-[#d0dce8]">
              <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
                <h2 className="font-heading text-xl font-bold text-[#0f2840] mb-8 text-center">Complete Your Routine</h2>
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  {others.map((op) => (
                    <Link key={op.slug} href={"/products/" + op.slug} className="group">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#eef4fa] mb-3 relative border border-[#d0dce8] shadow-[0_4px_24px_rgba(26,58,92,0.04)] group-hover:shadow-[0_12px_40px_rgba(26,58,92,0.08)] transition-all duration-300">
                        <Image src={op.images[0]} alt={op.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                      </div>
                      <p className="text-sm font-heading font-semibold text-[#0f2840] group-hover:text-[#3a7ab5] transition-colors">{op.name}</p>
                      <p className="text-sm font-bold text-[#3a7ab5]">{formatCurrency(op.price)}</p>
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

  if (isProtease) {
    const proteaseSteps = [
      { step: "1", title: "Cleanse", desc: "Cleanse your face." },
      { step: "2", title: "Mix", desc: "Mix enzyme lotion with enzyme powder." },
      { step: "3", title: "Apply", desc: "Apply evenly with silicone brush." },
      { step: "4", title: "Wait", desc: "Leave on for 10–20 minutes." },
      { step: "5", title: "Rinse", desc: "Rinse thoroughly." },
    ];

    const aftercareCards = [
      { title: "Recovery Hydration Care", desc: "Supports skin hydration after treatment." },
      { title: "Daily Repair Routine", desc: "Helps maintain smoother-looking skin." },
    ];

    const suitableConcerns = [
      "Acne & Congestion", "Fine Lines & Loss of Firmness", "Enlarged Pores",
      "Uneven Skin Tone", "Dullness", "Sensitive Skin",
    ];

    const faqItems = [
      { q: "Why does my skin feel warm and appear red after application?", a: "Within 3–5 minutes of application, you may notice a mild warming sensation and temporary redness. This is known as the Plasmatic Effect and is a normal part of the product's activation process.\n\nDuring this process, the exchange between endogenous and exogenous enzymes generates heat, similar to the warming effect of aerobic exercise. The skin may also develop a slightly flushed appearance, much like the natural glow that appears after drinking alcohol.\n\nThere is no need to worry. The warmth and redness will gradually fade on their own within 30–40 minutes." },
      { q: "Why are there two boxes?", a: "Each purchase includes two complete treatment kits, designed to provide approximately one month’s supply." },
      { q: "How often should I use the enzyme treatment?", a: "Use once a week during the initial care period. Once your skin reaches a visibly improved and balanced condition, reduce to once every two weeks for maintenance." },
      { q: "Can I use other skincare products after treatment?", a: "Yes. We recommend applying a hydrating or recovery mask after rinsing. Avoid masks containing exfoliating acids or other intensive active ingredients immediately after treatment." },
      { q: "How should I store the product?", a: "Store in a cool, dry place away from direct sunlight. For external use only. Avoid contact with eyes." },
    ];

    return (
      <div className="bg-white font-body">
        <section className="bg-luxe-gradient relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 min-h-[80vh] items-center">
              <div className="order-2 md:order-1 py-12 md:py-0">
                <p className="text-xs font-semibold text-[#c9a96e] tracking-[0.2em] uppercase mb-4">BELOYAN</p>
                <h1 className="font-heading text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.08] font-bold text-white mb-3">ACTIVE PROTEASE<br />ANTI-WRINKLE SKIN<br />REJUVENATION KIT</h1>
                <p className="text-lg md:text-xl font-heading italic text-[#f5ecd6] mb-5">Professional Enzyme Brush Treatment</p>
                <p className="text-base text-white/80 leading-relaxed mb-6 max-w-lg">Restore the look of smoother, brighter and healthier-looking skin with a professional enzyme treatment designed for home skincare routines.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-8">
                  {["Helps improve dull-looking skin","Supports smoother skin texture","Helps soften appearance of fine lines","Refreshes and revitalizes skin"].map((b) => (
                    <span key={b} className="text-sm text-white/85 flex items-center gap-2"><span className="text-[#c9a96e] text-xs">✦</span> {b}</span>
                  ))}
                </div>
                <AddToCartButton product={p} />
                <div className="flex flex-wrap gap-2.5 mt-6 pt-6 border-t border-white/10">
                  {["2 Complete Kits","Professional Brush Included","Approx. One Month Supply"].map((badge) => (
                    <span key={badge} className="text-xs text-white/60 bg-white/6 px-3.5 py-1.5 rounded-full">{badge}</span>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2 flex items-end justify-center">
                <div className="w-full max-w-lg">
                  <Image src={p.images[0]} alt="Active Protease Anti-Wrinkle Kit" width={800} height={800} className="w-full h-auto object-contain drop-shadow-2xl" priority />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[#faf9fc]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold text-[#6f3fc4] tracking-[0.18em] uppercase mb-3">Skin Concerns</p>
                <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#1e1a2e] leading-tight mb-6">Reveal Your Skin&apos;s Natural Radiance</h2>
                <p className="text-sm text-[#5c5470] leading-relaxed mb-8 max-w-md">Target the signs of tired, aging skin with targeted enzyme care.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "M12 8v4l2 2m-6-2a6 6 0 0 0 6 6", title: "Dull Skin", desc: "Helps restore a brighter-looking complexion." },
                    { icon: "M3 3l18 18M5 12h.01M9 8h.01M15 16h.01M19 12h.01M12 19v.01M12 5v.01", title: "Uneven Texture", desc: "Supports smoother-looking skin texture." },
                    { icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", title: "Fine Lines & Loss of Firmness", desc: "Helps improve the appearance of aging concerns." },
                    { icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", title: "Enlarged Pores", desc: "Helps refine the appearance of uneven skin texture." },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#e8e2f0] shadow-luxe-sm hover:shadow-luxe-md transition-all duration-300 hover:-translate-y-0.5">
                      <div className="w-11 h-11 min-w-[44px] rounded-full bg-[#f7f3ff] flex items-center justify-center text-[#6f3fc4]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d={item.icon} /></svg>
                      </div>
                      <div><h3 className="text-sm font-semibold text-[#1e1a2e] mb-0.5">{item.title}</h3><p className="text-xs text-[#5c5470]">{item.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-luxe-md"><Image src={p.images[1]} alt="Skin concerns" width={800} height={800} className="w-full h-auto object-contain" /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-luxe-gradient relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="order-2 md:order-1">
                <p className="text-xs font-semibold text-[#c9a96e] tracking-[0.18em] uppercase mb-3">Enzyme Technology</p>
                <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-white leading-tight mb-6">Professional Enzyme Care,<br />Inspired by Clinical Treatments</h2>
                <p className="text-sm text-white/75 leading-relaxed mb-8 max-w-lg">Unlike traditional exfoliating products, this enzyme treatment is activated by mixing the enzyme lotion with enzyme powder immediately before use, creating a fresh formula for every application.</p>
                <div className="space-y-3">
                  {["Freshly Activated Formula","Professional Enzyme Technology","Silicone Brush Application"].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-white/6 backdrop-blur-sm border border-white/10">
                      <span className="w-2 h-2 min-w-[8px] rounded-full bg-[#c9a96e]" />
                      <span className="text-sm font-medium text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="rounded-2xl overflow-hidden shadow-2xl"><Image src={p.images[2]} alt="Enzyme activation technology" width={800} height={800} className="w-full h-auto object-contain" /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="rounded-2xl overflow-hidden shadow-luxe-md order-1"><Image src={p.images[3]} alt="Key active ingredients" width={800} height={800} className="w-full h-auto object-contain" /></div>
              <div className="order-2">
                <p className="text-xs font-semibold text-[#6f3fc4] tracking-[0.18em] uppercase mb-3">Key Ingredients</p>
                <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#1e1a2e] leading-tight mb-6">Powered By Carefully Selected Active Ingredients</h2>
                <p className="text-sm text-[#5c5470] leading-relaxed mb-8 max-w-md">Each component is chosen for its proven efficacy in professional skincare.</p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: "Active Enzyme", name: "Papain (Protease)", desc: "A natural enzyme extracted from papaya, known for its gentle exfoliating properties.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
                    { label: "Antioxidant", name: "Superoxide Dismutase (SOD)", desc: "A powerful antioxidant supporting skin protection against environmental stressors.", icon: "M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9zM12 8v4l3 3" },
                    { label: "Vitamin B3", name: "Niacinamide", desc: "Helps improve uneven skin tone and supports the skin barrier function.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
                  ].map((ing) => (
                    <div key={ing.name} className="gradient-luxe-top bg-luxe-card border border-[#e8e2f0] rounded-xl p-5 shadow-luxe-sm hover:shadow-luxe-md transition-all duration-300 hover:-translate-y-0.5">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 min-w-[44px] rounded-full bg-[#f7f3ff] flex items-center justify-center text-[#6f3fc4]">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d={ing.icon} /></svg>
                        </div>
                        <div><span className="text-[10px] font-semibold text-[#6f3fc4] tracking-[0.06em] uppercase">{ing.label}</span><h3 className="text-sm font-semibold text-[#1e1a2e] mt-0.5">{ing.name}</h3><p className="text-xs text-[#5c5470] leading-relaxed mt-1">{ing.desc}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-luxe-soft">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-[#6f3fc4] tracking-[0.18em] uppercase mb-3">What&apos;s Inside</p>
              <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#1e1a2e] leading-tight max-w-2xl mx-auto">Everything You Need For A Professional Enzyme Treatment At Home</h2>
              <p className="text-sm text-[#5c5470] mt-4 max-w-lg mx-auto">Each order is carefully packaged to deliver a complete spa-quality experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="rounded-2xl overflow-hidden shadow-luxe-md"><Image src={p.images[4]} alt="Product showcase" width={800} height={800} className="w-full h-auto object-contain" /></div>
              <div className="space-y-4">
                <div className="rounded-xl bg-white border border-[#e8e2f0] p-5 shadow-luxe-sm hover:shadow-luxe-md transition-all duration-300"><h3 className="text-xs font-semibold text-[#6f3fc4] tracking-[0.06em] uppercase mb-2">Each Order Includes</h3><p className="text-lg font-bold text-[#1e1a2e]">2 Complete Treatment Kits</p></div>
                <div className="rounded-xl bg-white border border-[#e8e2f0] p-5 shadow-luxe-sm hover:shadow-luxe-md transition-all duration-300"><h3 className="text-xs font-semibold text-[#6f3fc4] tracking-[0.06em] uppercase mb-3">Each Kit Contains</h3><div className="flex flex-wrap gap-x-4 gap-y-1.5">{["Active Protease Lotion (10 g × 2)","Active Protease Powder (5 g × 2)","Silicone Application Brush"].map((item) => (<span key={item} className="text-sm text-[#1e1a2e] flex items-center gap-1.5"><span className="text-[#c9a96e] font-bold">·</span> {item}</span>))}</div></div>
                <div className="rounded-xl bg-[#1e1040] text-white p-5 text-center shadow-luxe-md"><p className="text-sm font-semibold flex items-center justify-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Two Boxes = Approximately One Month Supply</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-luxe-gradient relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="order-2 md:order-1">
                <p className="text-xs font-semibold text-[#c9a96e] tracking-[0.18em] uppercase mb-3">How To Use</p>
                <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-white leading-tight mb-6">Simple Professional Treatment At Home</h2>
                <div className="space-y-3">{proteaseSteps.map((s) => (
                  <div key={s.step} className="flex items-center gap-4 p-4 rounded-xl bg-white/6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <div className="w-9 h-9 min-w-[36px] rounded-full bg-white/12 flex items-center justify-center text-sm font-bold text-[#c9a96e] font-heading">{s.step.padStart(2, '0')}</div>
                    <div><h4 className="text-sm font-semibold text-white">{s.title}</h4><p className="text-xs text-white/65">{s.desc}</p></div>
                  </div>
                ))}</div>
                <div className="mt-5 p-4 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/20"><p className="text-xs text-[#f5ecd6]"><span className="text-[#c9a96e] font-semibold">Tip:</span> Follow with a hydrating recovery mask after treatment for optimal skin comfort.</p></div>
              </div>
              <div className="order-1 md:order-2"><div className="rounded-2xl overflow-hidden shadow-2xl"><Image src={p.images[6]} alt="How to apply enzyme treatment" width={800} height={800} className="w-full h-auto object-contain" /></div></div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[#faf9fc]">
          <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 text-center">
            <p className="text-xs font-semibold text-[#6f3fc4] tracking-[0.18em] uppercase mb-3">Aftercare &amp; Routine</p>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#1e1a2e] leading-tight mb-4">Complete Your Post-Treatment Skincare Routine</h2>
            <p className="text-sm text-[#5c5470] mb-10 max-w-xl mx-auto">Pair with hydrating and repairing skincare products to maintain skin comfort after enzyme treatment.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">{aftercareCards.map((card, idx) => (
              <div key={card.title} className="relative overflow-hidden rounded-xl bg-white border border-[#e8e2f0] p-7 shadow-luxe-sm hover:shadow-luxe-md transition-all duration-300 hover:-translate-y-1 text-left group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#c9a96e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-11 h-11 rounded-full bg-[#f7f3ff] flex items-center justify-center text-[#6f3fc4] mb-4">
                  {idx === 0 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 12h4l3-9 4 18 3-9h4"/></svg>}
                </div>
                <h3 className="text-sm font-semibold text-[#1e1a2e] mb-2">{card.title}</h3>
                <p className="text-xs text-[#5c5470] leading-relaxed">{card.desc}</p>
              </div>
            ))}</div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 text-center">
            <p className="text-xs font-semibold text-[#6f3fc4] tracking-[0.18em] uppercase mb-3">Suitable For</p>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#1e1a2e] leading-tight mb-4">Designed For Different Skin Concerns</h2>
            <p className="text-sm text-[#5c5470] mb-10 max-w-lg mx-auto">Gentle yet effective — suitable for a wide range of skin types and conditions.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { title: "Acne & Congestion", desc: "Helps clear clogged pores" },
                { title: "Fine Lines & Loss of Firmness", desc: "Softens visible aging signs" },
                { title: "Enlarged Pores", desc: "Refines skin texture" },
                { title: "Uneven Skin Tone", desc: "Balances skin complexion" },
                { title: "Dullness", desc: "Restores natural radiance" },
                { title: "Sensitive Skin", desc: "Gentle enzyme formula" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl bg-[#faf9fc] border border-[#e8e2f0] p-5 text-center transition-all duration-300 hover:bg-[#f7f3ff] hover:border-[#d4c4f0] hover:-translate-y-0.5 shadow-luxe-sm">
                  <h3 className="text-sm font-semibold text-[#1e1a2e] mb-1">{item.title}</h3>
                  <p className="text-[11px] text-[#5c5470]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[#f7f3ff]">
          <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-12">
            <p className="text-xs font-semibold text-[#6f3fc4] tracking-[0.18em] uppercase mb-3 text-center">FAQ</p>
            <h2 className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-[#1e1a2e] text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">{faqItems.map((faq, i) => (
              <details key={i} className="group rounded-xl bg-white border border-[#e8e2f0] overflow-hidden transition-all duration-300 open:shadow-luxe-sm open:border-[#6f3fc4]/30">
                <summary className="flex items-center justify-between px-6 py-5 text-sm font-semibold text-[#1e1a2e] cursor-pointer list-none select-none">{faq.q}<span className="text-[#6f3fc4] text-xl font-light leading-none transition-transform duration-300 group-open:rotate-45">+</span></summary>
                <div className="px-6 pb-5"><p className="text-sm text-[#5c5470] leading-relaxed">{faq.a}</p></div>
              </details>
            ))}</div>
          </div>
        </section>

        {(() => {
          const others = ALL_PRODUCTS.filter((op) => op.slug !== p.slug && op.isActive).slice(0, 2);
          if (others.length === 0) return null;
          return (
            <section className="py-20 md:py-28 bg-white">
              <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
                <h2 className="font-heading text-2xl font-bold text-[#1e1a2e] mb-3 text-center">Complete Your Routine</h2>
                <p className="text-sm text-[#5c5470] text-center mb-8 max-w-md mx-auto">Pair with complementary products for optimal results.</p>
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">{others.map((op) => (
                  <Link key={op.slug} href={"/products/" + op.slug} className="group">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-[#f7f3ff] mb-3 relative border border-[#e8e2f0] shadow-luxe-sm group-hover:shadow-luxe-md transition-all duration-300"><Image src={op.images[0]} alt={op.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" /></div>
                    <p className="text-sm font-heading font-semibold text-[#1e1a2e] group-hover:text-[#6f3fc4] transition-colors">{op.name}</p>
                    <p className="text-sm font-bold text-[#6f3fc4]">{formatCurrency(op.price)}</p>
                  </Link>
                ))}</div>
              </div>
            </section>
          );
        })()}
      </div>
    );
  }
  return (
    <div className="bg-white">
      {/* ====== SECTION 1: HERO ====== */}
      <section className="bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 min-h-[80vh] items-center">
            {/* Left: Text */}
            <div className="order-2 md:order-1 py-12 md:py-0">
              <p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-5">BELOYAN Advanced Anti-Aging Beauty Technology</p>
              <h1 className="font-heading text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.08] font-bold text-[#2e3a33] mb-5">DNA Sodium Instant Firming V-Face Spray</h1>
              <p className="text-base md:text-lg text-[#6b706a] leading-relaxed mb-8 max-w-lg">A lightweight DNA Sodium firming spray designed to support hydration, skin elasticity, and a smoother-looking facial contour.</p>
              <div className="space-y-3 mb-8">{["✓ Instant Firming Appearance","✓ Helps Improve Skin Elasticity","✓ Supports V-Face Contour"].map((b) => (<p key={b} className="text-sm text-[#555954] font-medium">{b}</p>))}</div>
              <div className="flex items-center gap-6"><AddToCartButton product={p} /><span className="text-sm text-[#a4a8a0]">{p.size}</span></div>
            </div>
            {/* Right: Image */}
            <div className="order-1 md:order-2"><Image src={p.images[0]} alt="BELOYAN DNA Sodium Instant Firming V-Face Spray" width={800} height={800} className="w-full h-auto object-contain" priority /></div>
          </div>
        </div>
      </section>
      {/* ====== SECTION 2: SKIN CONCERNS ====== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div><Image src={p.images[1]} alt="Skin aging concerns" width={800} height={800} className="w-full h-auto object-contain" /></div>
            <div>
              <p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">Skin Concerns</p>
              <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] leading-tight mb-6">Is Your Skin Losing Firmness?</h2>
              <p className="text-[#6b706a] leading-relaxed mb-8">As skin ages, collagen, elasticity and moisture gradually decrease, leading to visible fine lines, dullness and changes in facial definition.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{["Fine Lines","Loss of Firmness","Facial Contour Changes"].map((item) => (<div key={item} className="p-5 rounded-xl bg-[#faf8f5] border border-[#eef2ec] text-center"><p className="text-sm font-semibold text-[#2e3a33]">{item}</p></div>))}</div>
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
              <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] leading-tight mb-6">Advanced DNA Sodium Active Technology</h2>
              <p className="text-[#6b706a] leading-relaxed mb-8">Powered by ultra-fine active molecules, the formula absorbs quickly into skin to support hydration, firmness and smoother-looking contours.</p>
              <div className="grid grid-cols-2 gap-4">{["Fast Absorption","Lightweight Mist Texture","Non-Sticky Feel","Daily Anti-Aging Care"].map((item) => (<div key={item} className="p-4 rounded-xl bg-white border border-[#eef2ec] text-center"><p className="text-sm font-medium text-[#2e3a33]">{item}</p></div>))}</div>
            </div>
            <div><Image src={p.images[2]} alt="DNA Sodium Active Technology" width={800} height={800} className="w-full h-auto object-contain" /></div>
          </div>
        </div>
      </section>
      {/* ====== SECTION 4: CLINICAL RESULTS ====== */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12"><p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">Clinical Results</p><h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] mb-4">Visible Results After 4 Weeks</h2><p className="text-[#6b706a]">Based on a 4-week consumer test of women aged 25–40.</p></div>
          <div className="mb-12"><Image src={p.images[3]} alt="Clinical results timeline showing 4-week improvement" width={1400} height={700} className="w-full h-auto object-contain rounded-2xl" /></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">{timelineData.map((item) => (<div key={item.time} className="text-center p-5"><p className="text-xl font-bold text-[#b8a07a] mb-2">{item.time}</p><p className="text-sm text-[#555954] leading-snug">{item.label}</p></div>))}</div>
        </div>
      </section>
      {/* ====== SECTION 5: BEFORE & AFTER ====== */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12"><h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] mb-4">See The Difference</h2><p className="text-[#6b706a] max-w-xl mx-auto">With consistent use, skin appears smoother, firmer and more defined.</p></div>
          <div className="mb-12"><Image src={p.images[4]} alt="Before and after transformation" width={1400} height={700} className="w-full h-auto object-contain rounded-2xl" /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">{["Smoother-Looking Fine Lines","Improved Skin Firmness","More Defined Facial Contour"].map((item) => (<div key={item} className="p-6 rounded-xl bg-white border border-[#eef2ec] text-center shadow-sm"><p className="text-sm font-semibold text-[#2e3a33]">{item}</p></div>))}</div>
        </div>
      </section>
      {/* ====== SECTION 6: HOW TO USE ====== */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-14"><p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">How To Use</p><h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33]">Easy To Use, Anytime</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">{howToUseCards.map((card) => (<div key={card.title} className="p-6 rounded-xl bg-[#faf8f5] border border-[#eef2ec]"><h3 className="font-heading text-lg font-semibold text-[#2e3a33] mb-3">{card.title}</h3><p className="text-sm text-[#6b706a] leading-relaxed">{card.desc}</p></div>))}</div>
        </div>
      </section>
      {/* ====== SECTION 7: SUITABLE FOR ====== */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 text-center"><p className="text-sm font-semibold text-[#b8a07a] tracking-[0.25em] uppercase mb-4">Suitable For</p><h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-[#2e3a33] mb-10">Designed For Your Firming Care Routine</h2><div className="max-w-xl mx-auto space-y-4">{suitableItems.map((item) => (<div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#eef2ec]"><span className="w-6 h-6 rounded-full bg-[#b8a07a]/10 text-[#b8a07a] flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span><span className="text-sm text-[#555954]">{item}</span></div>))}</div></div>
      </section>
      {/* ====== SECTION 8: RELATED PRODUCTS ====== */}
      {(() => {
        const others = ALL_PRODUCTS.filter((op) => op.slug !== p.slug && op.isActive).slice(0, 2);
        if (others.length === 0) return null;
        return (<section className="py-20 md:py-28"><div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12"><h2 className="font-heading text-2xl font-bold text-[#2e3a33] mb-8 text-center">Complete Your Routine</h2><div className="grid grid-cols-2 gap-6 max-w-md mx-auto">{others.map((op) => (<Link key={op.slug} href={"/products/" + op.slug} className="group"><div className="aspect-square rounded-2xl overflow-hidden bg-[#faf8f5] mb-3 relative border border-[#eef2ec]"><Image src={op.images[0]} alt={op.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" /></div><p className="text-sm font-heading font-semibold text-[#2e3a33]">{op.name}</p><p className="text-sm font-bold text-[#74906f]">{formatCurrency(op.price)}</p></Link>))}</div></div></section>);
      })()}
    </div>
  );
}
