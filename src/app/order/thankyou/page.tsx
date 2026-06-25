"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ThankYouPage() {
  const [order, setOrder] = useState<{ orderNumber: string; total: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastOrder");
    if (saved) {
      setOrder(JSON.parse(saved));
      localStorage.removeItem("lastOrder");
    }
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">Order Placed!</h1>
      {order ? (
        <>
          <p className="text-neutral-500 mb-1">Order #{order.orderNumber}</p>
          <p className="text-lg font-semibold text-neutral-800 mb-6">Total: ${Number(order.total).toFixed(2)}</p>
        </>
      ) : (
        <p className="text-neutral-500 mb-6">Your order has been submitted.</p>
      )}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 text-left">
        <h3 className="font-semibold text-amber-800 mb-2">⏳ Payment Pending</h3>
        <ul className="text-sm text-amber-700 space-y-2 list-disc list-inside">
          <li>Complete the bank transfer to the account shown on XTransfer</li>
          <li>Include your order number as payment reference</li>
          <li>Funds arrive in 1-3 business days</li>
          <li>We will email you once payment is confirmed</li>
        </ul>
      </div>
      <a href="https://wa.me/8613980551004?text=Hi!%20I%20just%20placed%20an%20order%20and%20have%20a%20payment%20question." target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors mb-4">
        💬 Chat on WhatsApp
      </a>
      <div>
        <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">&larr; Continue Shopping</Link>
      </div>
    </div>
  );
}