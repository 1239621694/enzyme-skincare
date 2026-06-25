import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    slug: string;
    name: string;
    tagline?: string | null;
    price: number | { toNumber(): number };
    comparePrice?: number | { toNumber(): number } | null;
    rating: number | { toNumber(): number };
    reviewsCount: number;
    images: string[];
    badge?: string | null;
  }>;
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-neutral-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}