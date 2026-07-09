export const dynamic = "force-dynamic";

import { ALL_PRODUCTS } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products — Enzyme Skincare",
  description:
    "Browse our complete collection of enzyme-powered skincare — all dermatologist tested.",
};

export default async function ProductsPage() {
  const products = ALL_PRODUCTS.filter((p) => p.isActive);

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
        <ProductGrid products={products} />
      </div>
    </>
  );
}