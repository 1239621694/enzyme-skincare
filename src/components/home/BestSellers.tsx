import { getProducts } from "@/lib/supabase/queries";
import { ProductGrid } from "@/components/products/ProductGrid";

export async function BestSellers() {
  let products;
  try {
    const result = await getProducts({ badge: "best-seller", limit: 4 });
    products = result.products;
  } catch {
    return null;
  }

  if (products.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-3xl font-bold text-neutral-800">Best Sellers</h2>
          <a
            href="/products"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Shop All &rarr;
          </a>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}