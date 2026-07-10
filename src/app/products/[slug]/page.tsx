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
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800 font-medium">{p.name}</span>
      </nav>

      {/* ── TOP BUY BOX ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
        <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative shadow-md border border-neutral-200">
          <Image src={p.images[0]} alt={p.name} fill className="object-cover" priority sizes="(max-width:768px)100vw,50vw" />
        </div>
        <div className="flex flex-col">
          {p.badge && badgeLabel && <div className="mb-3"><Badge type={badgeType}>{badgeLabel}</Badge></div>}
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

      {/* ── DETAIL IMAGES FLOW (淘宝详情图流) ── */}
      {/* Show all remaining images as full-width detail blocks */}
      {p.images.length > 0 && (
        <div className="mb-12 space-y-1">
          {p.images.map((img, i) => (
            <div key={i} className="w-full bg-neutral-50 rounded-2xl overflow-hidden relative border border-neutral-200 shadow-sm">
              <Image
                src={img}
                alt={p.name + " detail " + (i + 1)}
                width={1200}
                height={1200}
                className="w-full h-auto object-contain"
                sizes="(max-width:768px)100vw,80vw"
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── RELATED PRODUCTS ── */}
      {otherProducts.length > 0 && (
        <div className="pt-10 border-t border-neutral-200">
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-6 text-center">Complete Your Routine</h2>
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
