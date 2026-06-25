export const dynamic = "force-dynamic";

import { ALL_PRODUCTS } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products — Enzyme Skincare",
  description:
    "Browse our complete collection of enzyme-powered skincare. Cleansers, serums, moisturizers, and more — all dermatologist tested.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    concern?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const products = ALL_PRODUCTS.filter((p) => {
    if (!p.isActive) return false;
    if (params.category && p.category !== params.category.toUpperCase()) return false;
    if (params.concern && !p.skinConcerns.includes(params.concern.toUpperCase() as any)) return false;
    if (params.priceMin && p.price < Number(params.priceMin)) return false;
    if (params.priceMax && p.price > Number(params.priceMax)) return false;
    return true;
  });

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
        ]}
      />

      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800">
            All Products
          </h1>
          <p className="mt-2 text-neutral-500">
            {products.length} products found
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <aside className="hidden lg:block">
            <ProductFilters />
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="lg:hidden" />
              <ProductSort />
            </div>

            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </>
  );
}