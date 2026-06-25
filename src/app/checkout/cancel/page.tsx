import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout Cancelled — Enzyme Skincare" };

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 className="font-heading text-2xl font-bold text-neutral-800 mb-2">Checkout Cancelled</h1>
      <p className="text-neutral-500 mb-2">Your payment was not completed. No charges have been made.</p>
      <p className="text-sm text-neutral-400 mb-8">Your cart items are still saved — you can checkout anytime.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/cart"><Button size="lg">Return to Cart</Button></Link>
        <Link href="/products"><Button size="lg" variant="outline">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}