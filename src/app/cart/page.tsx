"use client";
import { useCartContext } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, itemCount, total, updateQuantity, removeItem } = useCartContext();


  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-neutral-500 mb-6">Looks like you have not added anything yet.</p>
        <Link href="/products"><Button size="lg">Shop Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold mb-6">Shopping Cart ({itemCount} items)</h1>
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border border-neutral-200 rounded-xl p-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-100 relative flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1">
                <Link href={"/products/" + item.productId} className="font-semibold text-neutral-800 hover:text-primary-600">{item.name}</Link>
                <p className="text-sm text-neutral-500 mt-1">${Number(item.price).toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))} className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-sm hover:bg-neutral-100">-</button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-sm hover:bg-neutral-100">+</button>
                  <button onClick={() => removeItem(item.id)} className="ml-auto text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 mt-6 lg:mt-0">
          <div className="border border-neutral-200 rounded-xl p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span className="font-medium">${Number(total).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span className="text-neutral-500">Calculated at checkout</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Tax</span><span className="text-neutral-500">$0.00</span></div>
            </div>
            <div className="border-t border-neutral-200 mt-4 pt-4 flex justify-between font-semibold"><span>Total</span><span>${Number(total).toFixed(2)}</span></div>

            <div className="mt-4 space-y-3">
              <Link href="/checkout">
                <Button className="w-full text-lg py-4" size="lg">Proceed to Checkout  →</Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-xs text-neutral-500">Secure Checkout</span>
              <span className="text-[10px] text-neutral-400">🔒 SSL Encrypted</span>
            </div>
            <div className="text-[10px] text-neutral-400 text-center mt-3">
              By placing this order, you agree to the{" "}
              <Link href="/terms-and-conditions" className="underline hover:text-neutral-600" target="_blank">Terms &amp; Conditions</Link>{" "}
              and acknowledge the{" "}
              <Link href="/privacy-policy" className="underline hover:text-neutral-600" target="_blank">Privacy Policy</Link>,{" "}
              <Link href="/shipping-policy" className="underline hover:text-neutral-600" target="_blank">Shipping Policy</Link>{" "}
              and{" "}
              <Link href="/refund-policy" className="underline hover:text-neutral-600" target="_blank">Refund Policy</Link>.
            </div>
            <p className="text-xs text-neutral-500 text-center mt-2">⚡ No account needed · Guest checkout available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
