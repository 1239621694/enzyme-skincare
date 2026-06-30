"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface OrderData {
  id: string; orderNumber: string; status: string; total: number; currency: string;
  customerEmail: string; customerName: string | null;
  items: { productName: string; quantity: number; unitPrice: number }[];
  shippingAddress: { name: string | null; address1: string | null; city: string | null; province: string | null };
  payment: { provider: string; status: string; invoiceUrl: string | null } | null;
  createdAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = params?.orderId as string;
  const token = searchParams?.get("token") ?? "";

  useEffect(() => {
    if (!orderId || !token) { setLoading(false); setError("Missing order ID or token"); return; }
    fetch("/api/orders/" + orderId + "?token=" + token)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId, token]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-neutral-500">Loading...</div>;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-red-500 mb-4">{error}</p><Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">&larr; Back to Home</Link></div>;
  if (!order) return null;

  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-100 text-amber-800", PAID: "bg-green-100 text-green-800",
    PROCESSING: "bg-blue-100 text-blue-800", SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-neutral-100 text-neutral-600", CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-red-50 text-red-500",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-800">Order #{order.orderNumber}</h1>
        <span className={"px-3 py-1 rounded-full text-xs font-medium " + (statusColors[order.status] || "bg-neutral-100")}>{order.status}</span>
      </div>

      {/* Payment Section */}
      {order.payment?.status === "PENDING" && order.payment?.invoiceUrl && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-green-800 mb-3">💳 Payment Required</h2>
          <p className="text-sm text-green-700 mb-4">Click the button below to complete your payment via {order.payment.provider}.</p>
          <a href={order.payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full">Pay via {order.payment.provider}</Button>
          </a>
          {order.payment.invoiceUrl && (
            <div className="mt-3 text-xs text-green-600 space-y-1">
              <p>1. Click the button above to go to the payment page.</p>
              <p>2. Complete the bank transfer as instructed.</p>
              <p>3. Include order number <strong>{order.orderNumber}</strong> as payment reference.</p>
              <p>4. Payment confirmation takes 1-3 business days.</p>
            </div>
          )}
        </div>
      )}
      {order.payment?.status === "COMPLETED" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <p className="font-semibold text-green-700">✅ Payment Confirmed</p>
        </div>
      )}
      {!order.payment && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <p className="text-sm text-amber-700">⏳ Waiting for admin to attach payment method.</p>
        </div>
      )}

      {/* Items */}
      <div className="border border-neutral-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-neutral-600">{item.productName} x{item.quantity}</span>
              <span className="font-medium">${Number(item.unitPrice).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-neutral-200 mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span><span>${order.total.toFixed(2)} {order.currency}</span>
        </div>
      </div>

      {/* Shipping */}
      {order.shippingAddress?.name && (
        <div className="border border-neutral-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p className="text-sm text-neutral-600">{order.shippingAddress.name}</p>
          <p className="text-sm text-neutral-600">{order.shippingAddress.address1}</p>
          <p className="text-sm text-neutral-600">{order.shippingAddress.city}, {order.shippingAddress.province}</p>
        </div>
      )}

      <div className="text-center">
        <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">&larr; Continue Shopping</Link>
      </div>
    </div>
  );
}