export function serializeDecimal(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "object" && value.toNumber) return value.toNumber();
  return Number(value);
}
export function serializeProduct(product: any) {
  return {
    ...product,
    price: serializeDecimal(product.price),
    comparePrice: product.comparePrice ? serializeDecimal(product.comparePrice) : null,
    rating: serializeDecimal(product.rating),
    variants: product.variants?.map((v: any) => ({ ...v, price: v.price ? serializeDecimal(v.price) : null })),
  };
}