"use client";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Stars } from "@/components/ui/Stars";
import { formatCurrency } from "@/lib/utils";
import { useCartContext } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export function ProductCard({ product }: { product: any }) {
  const { addItem, openCart } = useCartContext();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();

  const img = product.images?.[0] ?? "/placeholder.svg";
  const badgeLabel = product.badge === "BEST_SELLER" ? "Best Seller" : product.badge === "NEW" ? "New" : product.badge === "SALE" ? "Sale" : null;
  const badgeVariant = product.badge === "BEST_SELLER" ? "best-seller" as const : product.badge === "NEW" ? "new" as const : product.badge === "SALE" ? "sale" as const : undefined;

  const handleAddToCart = () => { console.log("🛒 ProductCard handleAddToCart FIRED");
    addItem({
      id: product.slug,
      productId: product.id ?? product.slug,
      name: product.name,
      price: Number(product.price),
      image: img,
      quantity: 1,
    });
    openCart();
  };

  return (
    <div className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden transition-shadow hover:shadow-lg">
      {/* Wishlist heart */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.slug); }}
        className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Toggle wishlist"
      >
        <svg className={"w-4 h-4 " + (isWishlisted(product.slug) ? "text-red-500 fill-red-500" : "text-neutral-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      {/* Image area — Link is full-overlay, button is sibling outside Link */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
        {/* Invisible Link overlay */}
        <Link href={"/products/" + product.slug} className="block absolute inset-0 z-10">
          <span className="sr-only">{product.name}</span>
        </Link>
        <Image
          src={img}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        {badgeLabel && badgeVariant && (
          <div className="absolute top-3 left-3 z-20">
            <Badge variant={badgeVariant}>{badgeLabel}</Badge>
          </div>
        )}
        {/* Quick Add — OUTSIDE Link, so click works independently */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-neutral-800 text-sm font-semibold rounded-lg hover:bg-neutral-900 hover:text-white transition-colors shadow-lg"
          >
            Quick Add to Cart
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-3">
        <Link href={"/products/" + product.slug}>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-1 text-neutral-800 hover:text-primary-600">{product.name}</h3>
        </Link>
        <p className="text-xs text-neutral-500 mb-1.5">{product.tagline || product.size || ""}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-neutral-800">{formatCurrency(Number(product.price))}</span>
          {product.comparePrice && (
            <span className="text-sm text-neutral-400 line-through">{formatCurrency(Number(product.comparePrice))}</span>
          )}
        </div>
      </div>
    </div>
  );
}