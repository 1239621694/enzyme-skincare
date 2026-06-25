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
  return p ? { title: p.name + " | Enzyme Skincare", description: p.tagline, openGraph: { images: [p.images[0]] } } : { title: "Not Found" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold mb-4">Product Not Found</h1><Link href="/products" className="text-primary-600">&larr; Back to All Products</Link></div>;

  const badgeLabel = p.badge === "BEST_SELLER" ? "Best Seller" : p.badge === "NEW" ? "New" : p.badge === "SALE" ? "Sale" : null;
  const badgeType = p.badge === "BEST_SELLER" ? "best-seller" as const : p.badge === "NEW" ? "new" as const : "sale" as const;
  const otherProducts = ALL_PRODUCTS.filter((op) => op.slug !== p.slug && op.isActive).slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-text-secondary mb-6"><Link href="/" className="hover:text-text-primary">Home</Link><span className="mx-2">/</span><Link href="/products" className="hover:text-text-primary">Products</Link><span className="mx-2">/</span><span className="text-text-primary">{p.name}</span></nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-lg overflow-hidden bg-bg-alt relative">
          <Image src={p.images[0]} alt={p.name} fill className="object-cover" priority sizes="(max-width:768px)100vw,50vw" />
        </div>
        <div>
          {p.badge && badgeLabel && <Badge type={badgeType}>{badgeLabel}</Badge>}
          <h1 className="text-2xl md:text-3xl font-heading font-bold mt-2 mb-1">{p.name}</h1>
          <p className="text-text-secondary mb-3">{p.tagline}</p>
          <div className="flex items-center gap-2 mb-4"><Stars rating={p.rating} /><span className="text-sm text-text-secondary">{p.rating} ({p.reviewsCount} reviews)</span></div>
          <div className="flex items-baseline gap-3 mb-4"><span className="text-2xl font-bold">{formatCurrency(p.price)}</span>{p.comparePrice && <span className="text-lg text-text-secondary line-through">{formatCurrency(p.comparePrice)}</span>}</div>
          <p className="text-text-secondary mb-4 leading-relaxed">{p.description}</p>
          <p className="text-sm text-text-secondary mb-6">Size: <span className="font-medium text-text-primary">{p.size}</span></p>
          <AddToCartButton product={p} />
          <div className="flex gap-4 mt-6 pt-6 border-t border-border">
            {["Enzyme-Powered","Dermatologist Tested","Cruelty-Free"].map(t => <div key={t} className="flex items-center gap-1.5 text-sm text-text-secondary"><span className="text-primary-600 font-bold">&#10003;</span> {t}</div>)}
          </div>
        </div>
      </div>
      <div className="mt-14 pt-8 border-t border-border max-w-3xl space-y-8">
        <section><h2 className="text-lg font-semibold mb-3">Description</h2><p className="text-text-secondary leading-relaxed">{p.description}</p></section>
        <section><h2 className="text-lg font-semibold mb-3">Ingredients</h2><p className="text-text-secondary text-sm leading-relaxed">{p.ingredients}</p></section>
        <section><h2 className="text-lg font-semibold mb-3">How to Use</h2><p className="text-text-secondary leading-relaxed">{p.howToUse}</p></section>
      </div>
      {otherProducts.length > 0 && (
        <section className="mt-14 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold mb-4">Complete Your Routine</h2>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {otherProducts.map(op => (
              <Link key={op.slug} href={"/products/" + op.slug} className="group">
                <div className="aspect-square rounded-lg overflow-hidden bg-bg-alt mb-2 relative"><Image src={op.images[0]} alt={op.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="200px" /></div>
                <p className="text-sm font-semibold">{op.name}</p><p className="text-sm font-bold">{formatCurrency(op.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}