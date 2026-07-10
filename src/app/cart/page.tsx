"use client";
import { useCartContext } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, itemCount, total, updateQuantity, removeItem } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity, variantId: i.variant })),
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.redirectUrl) window.location.href = data.redirectUrl;
      else toast.error(data.error || "Checkout failed");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span className="text-green-600">Free</span></div>
            </div>
            <div className="border-t border-neutral-200 mt-4 pt-4 flex justify-between font-semibold"><span>Total</span><span>${Number(total).toFixed(2)}</span></div>

            <div className="mt-4">
              <input type="email" placeholder="Email for confirmation" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-full border border-neutral-300 px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              <Button onClick={handleCheckout} loading={loading} className="w-full text-lg py-4" size="lg">Proceed to Checkout</Button>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-xs text-neutral-500">We accept:</span>
              {["Visa", "Mastercard", "Apple Pay", "PayPal"].map((p) => (<span key={p} className="text-xs font-semibold text-neutral-500">{p}</span>))}
            </div>
            <p className="text-xs text-neutral-500 text-center mt-2">⚡ No account needed · Guest checkout available</p>
          </div>
        </div>
      </div>
    </div>
  );
}