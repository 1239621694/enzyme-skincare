"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface TrackingEvent {
  id: string; status: string; location: string | null; description: string | null;
  trackingNumber: string | null; shippingCompany: string | null; timestamp: string;
}

interface OrderData {
  id: string; orderNumber: string; status: string; total: number; currency: string;
  subtotal: number | null; shippingFee: number | null; shippingMethod: string | null; discountAmount: number | null;
  customerEmail: string; customerName: string | null;
  couponCode?: string | null;
  salesCode?: string | null;
  shippingAddress?: { firstName: string | null; lastName: string | null; name: string | null; phone: string | null; address1: string | null; address2: string | null; city: string | null; province: string | null; state: string | null; postal: string | null; postalCode: string | null; country: string | null } | null;
  items: { productName: string; productImage: string | null; quantity: number; unitPrice: number }[];
  payment: { provider: string; status: string; invoiceUrl: string | null } | null;
  trackingNumber: string | null; shippingCompany: string | null;
  deliveryStatus: string | null; shippedAt: string | null; deliveredAt: string | null;
  trackingEvents: TrackingEvent[];
  createdAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paypalError, setPaypalError] = useState("");
  const [paypalProcessing, setPaypalProcessing] = useState(false);

  const orderId = params?.orderId as string;
  const token = searchParams?.get("token") ?? "";

  useEffect(() => {
    if (!orderId || !token) { setLoading(false); setError("Missing order ID or token"); return; }
    loadOrder();
  }, [orderId, token]);

  const loadOrder = () => {
    fetch("/api/orders/" + orderId + "?token=" + token)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  };

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const paypalEnabled = !!paypalClientId;

  const createPayPalOrder = async (): Promise<string> => {
    console.log("[PayPal] createOrder called for order:", orderId);
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, token }),
    });
    const data = await res.json();
    console.log("[PayPal] createOrder response:", res.status, data);
    if (!res.ok) throw new Error(data.error || "Failed to create PayPal order");
    // Must return the PayPal order ID as a plain string
    if (!data.id) {
      console.error("[PayPal] No order ID returned from server");
      throw new Error("No PayPal order ID returned");
    }
    return data.id;
  };

  const onApprove = async (paypalData: { orderID: string }) => {
    console.log("[PayPal] onApprove called, orderID:", paypalData.orderID);
    setPaypalProcessing(true);
    setPaypalError("");
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paypalOrderId: paypalData.orderID, token }),
      });
      const data = await res.json();
      console.log("[PayPal] capture response:", res.status, data);
      if (!res.ok) throw new Error(data.error || "Payment capture failed");
      loadOrder();
    } catch (err: any) {
      console.error("[PayPal] capture error:", err);
      setPaypalError(err.message || "Payment failed. Please try again.");
    } finally {
      setPaypalProcessing(false);
    }
  };

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
      {order.status === "PENDING_PAYMENT" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-amber-800 mb-3">💳 Payment Required</h2>
          <p className="text-sm text-amber-700 mb-4">Complete your payment to confirm this order.</p>

          {paypalEnabled ? (
            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                createOrder={createPayPalOrder}
                onApprove={onApprove}
                onCancel={() => setPaypalError("Payment was cancelled. You can try again.")}
                onError={(err) => setPaypalError("A payment error occurred. Please try again.")}
                disabled={paypalProcessing}
              />
            </PayPalScriptProvider>
          ) : (
            <div className="bg-white border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-sm text-neutral-500">PayPal is temporarily unavailable.</p>
            </div>
          )}

          {paypalError && (
            <p className="text-sm text-red-600 mt-3">{paypalError}</p>
          )}

          <div className="mt-4 text-xs text-amber-700 space-y-1">
            <p>• Secure payment via PayPal</p>
            <p>• Your order will be confirmed after payment</p>
          </div>
        </div>
      )}
      {order.status === "PAID" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-green-700 mb-2">✅ Payment Confirmed</h2>
          {order.payment && (
            <div className="text-sm text-green-600 space-y-1">
              <p>Payment via {order.payment.provider || "PayPal"}</p>
            </div>
          )}
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
        <div className="border-t border-neutral-200 mt-3 pt-3 space-y-1 text-sm text-right">
          <p>Subtotal: ${(order.subtotal || order.total).toFixed(2)}</p>
          <p>Shipping: {order.shippingMethod === "FREE SHIPPING" ? <span className="text-green-600 font-medium">FREE</span> : order.shippingFee ? `$${order.shippingFee.toFixed(2)}` : "$0.00"}</p>
          {order.discountAmount ? <p className="text-green-600">Discount: -${order.discountAmount.toFixed(2)}</p> : null}
          <div className="flex justify-between font-semibold text-base pt-1 border-t border-neutral-200">
            <span>Total</span><span>${order.total.toFixed(2)} {order.currency}</span>
          </div>
        </div>
        {order.couponCode && (
          <div className="mt-3 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            Coupon: <span className="font-mono">{order.couponCode}</span>
            {order.salesCode && <span className="ml-3">Referral: {order.salesCode}</span>}
          </div>
        )}
      </div>

      {/* Shipping & Tracking */}
      <div className="border border-neutral-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-2">Shipping</h2>
       {order.shippingAddress?.name ? (
          <div className="text-sm text-neutral-600 space-y-1">
            <p>{order.shippingAddress.firstName || order.shippingAddress.name || ""} {order.shippingAddress.lastName || ""}</p>
            {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
            {order.shippingAddress.address1 && <p>{order.shippingAddress.address1}{order.shippingAddress.address2 ? ", " + order.shippingAddress.address2 : ""}</p>}
            <p>{[order.shippingAddress.city, order.shippingAddress.province || order.shippingAddress.state, order.shippingAddress.postal || order.shippingAddress.postalCode].filter(Boolean).join(", ")}</p>
            {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
          </div>
        ) : <p className="text-sm text-neutral-400">No address collected</p>}
        {order.trackingNumber && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-sm"><span className="font-medium">Tracking:</span> {order.trackingNumber}</p>
            {order.shippingCompany && <p className="text-sm text-neutral-500">{order.shippingCompany}</p>}
            {order.deliveryStatus && <p className="text-sm text-neutral-500 mt-1">Status: {order.deliveryStatus}</p>}
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      {order.trackingEvents && order.trackingEvents.length > 0 && (
        <div className="border border-neutral-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-3">Tracking Timeline</h2>
          <div className="space-y-0">
            {order.trackingEvents.map((event, i) => (
              <div key={event.id} className="flex gap-4 pb-4 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-primary-600" : "bg-neutral-300"} mt-1.5 z-10`} />
                  {i < order.trackingEvents.length - 1 && <div className="w-0.5 flex-1 bg-neutral-200 -mt-0.5" />}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium text-neutral-800">{event.status.replace(/_/g, " ")}</p>
                  {event.description && <p className="text-neutral-500 text-xs">{event.description}</p>}
                  {event.location && <p className="text-neutral-400 text-xs">{event.location}</p>}
                  <p className="text-neutral-400 text-xs mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center space-x-3">
        <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">&larr; Continue Shopping</Link>
      </div>
    </div>
  );
}
