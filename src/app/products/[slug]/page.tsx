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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500 mb-6">
        <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800 font-medium">{p.name}</span>
      </nav>

      {/* Hero Section — Left: Image | Right: Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 mb-16">
        {/* Left: Main Image + Thumbnails */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative shadow-sm border border-neutral-200">
            <Image src={p.images[0]} alt={p.name} fill className="object-cover" priority sizes="(max-width:768px)100vw,50vw" />
          </div>
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {p.images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-neutral-100 relative border border-neutral-200">
                  <Image src={img} alt={p.name + " view " + (i + 2)} fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col">
          {p.badge && badgeLabel && (
            <div className="mb-3">
              <Badge type={badgeType}>{badgeLabel}</Badge>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-2">{p.name}</h1>
          <p className="text-neutral-500 text-base md:text-lg mb-4">{p.tagline}</p>
          <div className="flex items-center gap-2 mb-4">
            <Stars rating={p.rating} />
            <span className="text-sm text-neutral-500">{p.rating} ({p.reviewsCount} reviews)</span>
          </div>
          <div className="flex items-baseline gap-4 mb-5">
            <span className="text-3xl font-bold text-neutral-800">{formatCurrency(p.price)}</span>
            {p.comparePrice && <span className="text-lg text-neutral-400 line-through">{formatCurrency(p.comparePrice)}</span>}
            <span className="text-xs text-neutral-500">{p.size}</span>
          </div>
          <p className="text-neutral-600 leading-relaxed mb-6 whitespace-pre-line">{p.description.split('\n\n')[0]}</p>
          <AddToCartButton product={p} />
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-neutral-200">
            {[{ icon: "🧪", label: "Enzyme-Powered" }, { icon: "✅", label: "Dermatologist Tested" }, { icon: "🐰", label: "Cruelty-Free" }].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5 text-sm text-neutral-500">
                <span>{t.icon}</span> {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="max-w-4xl mx-auto space-y-10 mb-16">
        {/* Full Description */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-6">About This Product</h2>
          <div className="text-neutral-600 leading-relaxed whitespace-pre-line">{p.description}</div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-4">Ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {p.ingredients.split(", ").map((ing, i) => (
              <span key={i} className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm rounded-full">{ing}</span>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-4">How to Use</h2>
          <div className="text-neutral-600 leading-relaxed whitespace-pre-line">{p.howToUse}</div>
        </div>
      </div>

      {/* Full Image Gallery — all remaining images */}
      {p.images.length > 5 && (
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-6 text-center">Product Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {p.images.slice(5).map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative border border-neutral-200 shadow-sm">
                <Image src={img} alt={p.name + " detail"} fill className="object-cover" sizes="(max-width:768px)50vw,30vw" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {otherProducts.length > 0 && (
        <div className="max-w-4xl mx-auto pt-10 border-t border-neutral-200">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-6 text-center">Complete Your Routine</h2>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {otherProducts.map((op) => (
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
      )}
    </div>
  );
}
