"use client";
import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function CartSidebar() {
  // Cart opens via useCartContext toggleCart
  const { items, isOpen, itemCount, total, removeItem, updateQuantity, toggleCart } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true); setCouponError("");
    try { const res = await fetch("/api/coupons/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponCode.trim(), cartTotal: total, items: items.map(i => ({ id: i.productId, quantity: i.quantity })) }) }); const data = await res.json(); if (data.valid) { setAppliedCoupon({ code: couponCode.trim().toUpperCase(), discount: data.discountAmount }); setCouponDiscount(data.discountAmount); setCouponCode(""); } else { setCouponError(data.message || "Invalid coupon"); } } catch { setCouponError("Failed"); } finally { setIsValidating(false); }
  };
  const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponDiscount(0); setCouponError(""); };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId || i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variantId: i.variant,
          })),
          customerEmail: email.trim(),
          customerName: "",
          couponCode: appliedCoupon?.code || null,
          discountAmount: couponDiscount || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error(data.error || "Checkout failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") toggleCart(); }, [toggleCart]);

  useEffect(() => {
    if (isOpen) { document.addEventListener("keydown", handleKeyDown); document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = ""; };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-black/50 transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={toggleCart} />
      <div className={cn("fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300", isOpen ? "translate-x-0" : "translate-x-full")} role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-800">Cart ({itemCount})</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleCheckout} disabled={itemCount === 0 || loading} className="px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-full hover:bg-primary-700 disabled:opacity-40 transition-colors">{loading ? "..." : "Checkout →"}</button>
            <button onClick={toggleCart} className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors" aria-label="Close"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-neutral-300 mb-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" /></svg>
              <p className="text-neutral-500 mb-4">Your cart is empty</p>
              <Link href="/products" onClick={toggleCart} className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">Shop Products</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-3 border-b border-neutral-100 last:border-0">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"><Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-neutral-800 truncate">{item.name}</h3>
                    <p className="text-sm text-neutral-500 mt-0.5">${Number(item.price).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))} className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500 hover:bg-neutral-100">-</button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500 hover:bg-neutral-100">+</button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto text-xs text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-6 py-4 space-y-3">
            <div className="space-y-2 mb-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg text-sm">
                  <span className="text-green-700 font-medium">{appliedCoupon.code}</span>
                  <button onClick={handleRemoveCoupon} className="text-xs text-green-600 hover:text-green-800">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 rounded-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  <button onClick={handleApplyCoupon} disabled={isValidating} className="px-4 py-2 bg-neutral-100 text-sm rounded-full hover:bg-neutral-200 disabled:opacity-50">{isValidating ? "..." : "Apply"}</button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500 px-1">{couponError}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-semibold text-neutral-800">${Number(total).toFixed(2)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">Discount ({appliedCoupon?.code})</span>
                <span className="font-semibold text-green-600">-${couponDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm font-semibold border-t border-neutral-200 pt-2">
              <span>Total</span>
              <span>${Math.max(0, Number(total) - couponDiscount).toFixed(2)}</span>
            </div>
            <input type="email" placeholder="Email for confirmation" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-full border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            <button onClick={handleCheckout} disabled={loading} className="block w-full text-center px-6 py-3 rounded-full bg-primary-600 text-white text-lg font-semibold hover:bg-primary-700 transition-colors">{loading ? "Processing..." : "Proceed to Checkout"}</button>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="text-xs text-neutral-500">Pay via:</span>
              <span className="text-xs font-semibold text-neutral-500">XTransfer Bank Transfer</span>
            </div>
            <div className="text-xs text-neutral-500 text-center mt-3 space-y-1">
              <p className="text-[10px] text-neutral-400">
                By placing this order, you agree to the{" "}
                <Link href="/terms-and-conditions" className="underline hover:text-neutral-600" target="_blank">Terms &amp; Conditions</Link>{" "}
                and acknowledge the{" "}
                <Link href="/privacy-policy" className="underline hover:text-neutral-600" target="_blank">Privacy Policy</Link>,{" "}
                <Link href="/shipping-policy" className="underline hover:text-neutral-600" target="_blank">Shipping Policy</Link>{" "}
                and{" "}
                <Link href="/refund-policy" className="underline hover:text-neutral-600" target="_blank">Refund Policy</Link>.
              </p>
            </div>
            <p className="text-xs text-neutral-500 text-center mt-2">⚡ No account needed · Guest checkout available</p>
            <button onClick={toggleCart} className="block w-full text-center text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}