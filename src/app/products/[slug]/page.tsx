import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Stars } from "@/components/ui/Stars";
import { Button } from "@/components/ui/Button";
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
  return p
    ? { title: p.name + " | Enzyme Skincare", description: p.tagline, openGraph: { images: [p.images[0]] } }
    : { title: "Not Found" };
}

function parseSections(text: string) {
  // Split by double newlines or numbered sections
  const lines = text.split("\n").filter(Boolean);
  const sections: { type: "text" | "heading" | "bullet" | "step"; content: string }[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^[•●]\s/.test(trimmed)) {
      sections.push({ type: "bullet", content: trimmed.replace(/^[•●]\s*/, "") });
    } else if (/^\d+\.\s/.test(trimmed)) {
      sections.push({ type: "step", content: trimmed.replace(/^\d+\.\s*/, "") });
    } else if (trimmed.endsWith(":") || /^[A-Z][a-z]+ [A-Z]/.test(trimmed) || trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
      sections.push({ type: "heading", content: trimmed.replace(/:$/, "") });
    } else {
      sections.push({ type: "text", content: trimmed });
    }
  }
  return sections;
}

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

  const badgeLabel = p.badge === "BEST_SELLER" ? "Best Seller" : p.badge === "NEW" ? "New" : p.badge === "SALE" ? "Sale" : null;
  const badgeType = p.badge === "BEST_SELLER" ? ("best-seller" as const) : p.badge === "NEW" ? ("new" as const) : ("sale" as const);
  const otherProducts = ALL_PRODUCTS.filter((op) => op.slug !== p.slug && op.isActive).slice(0, 2);
  const descriptionSections = parseSections(p.description);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500 mb-6 font-body">
        <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800 font-medium">{p.name}</span>
      </nav>

      {/* Hero Section — 2 column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-14">
        {/* Left: Image Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative shadow-md mb-4">
            <Image src={p.images[0]} alt={p.name} fill className="object-cover" priority sizes="(max-width:768px)100vw,50vw" />
          </div>
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {p.images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-neutral-100 relative border border-neutral-200">
                  <Image src={img} alt={p.name + " view " + (i + 2)} fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-start">
          {p.badge && badgeLabel && (
            <div className="mb-3">
              <Badge type={badgeType}>{badgeLabel}</Badge>
            </div>
          )}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800 mb-2 leading-tight">{p.name}</h1>
          <p className="text-neutral-500 text-base md:text-lg mb-4 font-body">{p.tagline}</p>
          <div className="flex items-center gap-2 mb-4">
            <Stars rating={p.rating} />
            <span className="text-sm text-neutral-500 font-body">{p.rating} ({p.reviewsCount} reviews)</span>
          </div>
          <div className="flex items-baseline gap-4 mb-5">
            <span className="text-3xl font-bold text-neutral-800">{formatCurrency(p.price)}</span>
            {p.comparePrice && (
              <span className="text-lg text-neutral-400 line-through">{formatCurrency(p.comparePrice)}</span>
            )}
            <span className="text-xs text-neutral-500 font-body">{p.size}</span>
          </div>
          <div className="mb-6">
            <AddToCartButton product={p} />
          </div>
          <div className="flex flex-wrap gap-4 pt-6 border-t border-neutral-200">
            {[
              { icon: "🧪", label: "Enzyme-Powered" },
              { icon: "✅", label: "Dermatologist Tested" },
              { icon: "🐰", label: "Cruelty-Free" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5 text-sm text-neutral-500 font-body">
                <span>{t.icon}</span> {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Description Section */}
      <div className="max-w-4xl mx-auto mb-14">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-10 shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-6">About This Product</h2>
          <div className="space-y-3 font-body text-neutral-600 leading-relaxed">
            {descriptionSections.map((section, i) => {
              if (section.type === "heading") {
                return (
                  <h3 key={i} className="font-heading text-lg font-semibold text-neutral-800 pt-3 pb-1">
                    {section.content}
                  </h3>
                );
              }
              if (section.type === "bullet") {
                return (
                  <div key={i} className="flex items-start gap-2 pl-2">
                    <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                    <span>{section.content}</span>
                  </div>
                );
              }
              if (section.type === "step") {
                return (
                  <div key={i} className="flex items-start gap-3 pl-2">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5 flex-shrink-0">
                      {descriptionSections.slice(0, i).filter((s) => s.type === "step").length + 1}
                    </span>
                    <span>{section.content}</span>
                  </div>
                );
              }
              return <p key={i}>{section.content}</p>;
            })}
          </div>
        </div>
      </div>

      {/* Ingredients + How to Use (2 column) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto mb-14">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-4">Ingredients</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {p.ingredients.split(", ").map((ing, i) => (
              <span key={i} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-sm rounded-full font-body">
                {ing}
              </span>
            ))}
          </div>
          <p className="text-xs text-neutral-400 font-body mt-3">
            Full INCI list. All ingredients are carefully selected for efficacy and safety.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-4">How to Use</h2>
          <div className="font-body text-neutral-600 leading-relaxed text-sm whitespace-pre-line">{p.howToUse}</div>
        </div>
      </div>

      {/* More images gallery */}
      {p.images.length > 5 && (
        <div className="max-w-4xl mx-auto mb-14">
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-6 text-center">Product Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {p.images.slice(5).map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-neutral-100 relative border border-neutral-200 shadow-sm">
                <Image src={img} alt={p.name + " detail"} fill className="object-cover" sizes="(max-width:768px)50vw,30vw" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {otherProducts.length > 0 && (
        <div className="max-w-4xl mx-auto pt-10 border-t border-neutral-200">
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-6 text-center">Complete Your Routine</h2>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {otherProducts.map((op) => (
              <Link key={op.slug} href={"/products/" + op.slug} className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3 relative border border-neutral-200 shadow-sm">
                  <Image src={op.images[0]} alt={op.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                </div>
                <p className="text-sm font-heading font-semibold text-neutral-800">{op.name}</p>
                <p className="text-sm font-bold text-primary-700 font-body">{formatCurrency(op.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
