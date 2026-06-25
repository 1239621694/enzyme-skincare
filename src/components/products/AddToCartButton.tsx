"use client";

import { Button } from "@/components/ui/Button";
import { useCartContext } from "@/hooks/useCart";

interface AddToCartButtonProps {
  product: {
    slug: string;
    id: string;
    name: string;
    price: number | Number | { toNumber(): number };
    images: string[];
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartContext();

  const handleAdd = () => { console.log("🛒 AddToCartButton handleClick FIRED", product);
    addItem({
      id: product.slug,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] ?? "",
      quantity: 1,
    });
    openCart();
  };

  return (
    <Button onClick={handleAdd} className="w-full" size="lg">
      Add to Cart — ${Number(product.price).toFixed(2)}
    </Button>
  );
}