"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/admin-i18n";

interface OrderDetail {
  id: string;
  orderNumber: string | null;
  status: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  subtotal: number | null;
  shippingFee: number | null;
  discountAmount: number | null;
  total: number;
  tax: number | null;
  currency: string;
  couponCode: string | null;
  salesCode: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress1: string | null;
  shippingAddress2: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingPostal: string | null;
  shippingCountry: string | null;
  customerNote: string | null;
  adminNote: string | null;
  deliveryStatus: string | null;
  trackingNumber: string | null;
  shippingCompany: string | null;
  estimatedDelivery: string | null;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: Array<{
    id: string;
    productName: string | null;
    quantity: number;
    price: number;
    unitPrice: number | null;
    subtotal: number | null;
  }>;
  payments: Array<{
    id: string;
    provider: string;
    status: string;
    amount: number;
    currency: string;
    invoiceUrl: string | null;
    confirmedBy: string | null;
    confirmedNote: string | null;
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    performedBy: string | null;
    previousStatus: string | null;
    newStatus: string | null;
    metadata: any;
    createdAt: string;
  }>;
  trackingEvents: Array<{
    id: string;
    status: string;
    location: string | null;
    description: string | null;
    trackingNumber: string | null;
    shippingCompany: string | null;
    timestamp: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-neutral-100 text-neutral-600",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-red-50 text-red-500",
};

async function markAsPaid(orderId: string) {
  const formData = new FormData();
  formData.set("orderId", orderId);
  await fetch("/api/admin/orders/" + orderId + "/payments", { method: "POST", body: formData });
  window.location.reload();
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [shippingCompany, setShippingCompany] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("/api/admin/orders/" + params.id);
        const data = await res.json();
        if (data.error) return;
        setOrder(data);
        setShippingCompany(data.shippingCompany || "");
        setTrackingNumber(data.trackingNumber || "");
      } catch (e) {
        console.error("Failed to load order:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id]);

  const handleEdit = async () => {
    try {
      const res = await fetch("/api/admin/orders/" + params.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditing(false);
        window.location.reload();
      }
    } catch (e) {
      console.error("Failed to update:", e);
    }
  };

  const handleShip = async () => {
    try {
      const res = await fetch("/api/admin/orders/" + params.id + "/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber, shippingCompany }),
      });
      if (res.ok) window.location.reload();
    } catch (e) {
      console.error("Ship failed:", e);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch("/api/admin/orders/" + params.id + "/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Admin cancellation" }),
      });
      if (res.ok) window.location.reload();
    } catch (e) {
      console.error("Cancel failed:", e);
    }
  };

  if (loading) return <div className="text-center py-12 text-neutral-400">Loading...</div>;
  if (!order) return <div className="text-center py-12">{t("Order not found")}</div>;

  const startEdit = () => {
    setEditForm({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingAddress1: order.shippingAddress1,
      shippingAddress2: order.shippingAddress2,
      shippingCity: order.shippingCity,
      shippingProvince: order.shippingProvince,
      shippingPostal: order.shippingPostal,
      shippingCountry: order.shippingCountry,
      adminNote: order.adminNote,
    });
    setEditing(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/orders" className="text-sm text-primary-600 hover:underline">{t("← Orders")}</Link>
          <h1 className="font-heading text-2xl font-bold mt-1">
            Order #{order.orderNumber || order.id.slice(0, 12)}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={"px-3 py-1 rounded-full text-xs font-medium " + (STATUS_COLORS[order.status] || "bg-neutral-100")}>
            {order.status.replace(/_/g, " ")}
          </span>
          <button onClick={startEdit} className="px-4 py-2 border rounded-lg text-sm hover:bg-neutral-50">{t("✏️ Edit")}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Info */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("OrderCustomer")}</h2>
            {editing ? (
              <div className="space-y-2 text-sm">
                <input value={editForm.customerName || ""} onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Name" />
                <input value={editForm.customerEmail || ""} onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Email" />
                <input value={editForm.customerPhone || ""} onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Phone" />
              </div>
            ) : (
              <div className="text-sm space-y-1 text-neutral-600">
                <p><span className="font-medium">Name:</span> {order.customerName || "—"}</p>
                <p><span className="font-medium">Email:</span> {order.customerEmail || "—"}</p>
                <p><span className="font-medium">Phone:</span> {order.customerPhone || "—"}</p>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("Shipping Address")}</h2>
            {editing ? (
              <div className="space-y-2 text-sm">
                <input value={editForm.shippingName || ""} onChange={(e) => setEditForm({ ...editForm, shippingName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Recipient name" />
                <input value={editForm.shippingPhone || ""} onChange={(e) => setEditForm({ ...editForm, shippingPhone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Phone" />
                <input value={editForm.shippingAddress1 || ""} onChange={(e) => setEditForm({ ...editForm, shippingAddress1: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Address line 1" />
                <input value={editForm.shippingAddress2 || ""} onChange={(e) => setEditForm({ ...editForm, shippingAddress2: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Address line 2" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={editForm.shippingCity || ""} onChange={(e) => setEditForm({ ...editForm, shippingCity: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="City" />
                  <input value={editForm.shippingProvince || ""} onChange={(e) => setEditForm({ ...editForm, shippingProvince: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="State/Province" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={editForm.shippingPostal || ""} onChange={(e) => setEditForm({ ...editForm, shippingPostal: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="Postal code" />
                  <input value={editForm.shippingCountry || ""} onChange={(e) => setEditForm({ ...editForm, shippingCountry: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="Country" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleEdit} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">Save</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-neutral-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="text-sm space-y-1 text-neutral-600">
                {order.shippingName ? <p>{order.shippingName}{order.shippingPhone ? " | " + order.shippingPhone : ""}</p> : <p>{t("No address collected")}</p>}
                {order.shippingAddress1 && <p>{order.shippingAddress1}{order.shippingAddress2 ? ", " + order.shippingAddress2 : ""}</p>}
                {order.shippingCity && <p>{order.shippingCity}{order.shippingProvince ? ", " + order.shippingProvince : ""} {order.shippingPostal || ""}</p>}
                {order.shippingCountry && <p>{order.shippingCountry}</p>}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("Items")}</h2>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-neutral-500"><th className="pb-2">Product</th><th className="pb-2">Qty</th><th className="pb-2">Price</th><th className="pb-2 text-right">Subtotal</th></tr></thead>
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.id} className="border-t border-neutral-100">
                    <td className="py-2">{i.productName || "Product"}</td>
                    <td className="py-2">{i.quantity}</td>
                    <td className="py-2">${(i.unitPrice || i.price).toFixed(2)}</td>
                    <td className="py-2 text-right">${(i.subtotal || i.quantity * i.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-neutral-200 mt-3 pt-3 space-y-1 text-sm text-right">
              <p>Subtotal: ${(order.subtotal || order.total).toFixed(2)}</p>
              {order.discountAmount ? <p className="text-red-500">Discount: -${order.discountAmount.toFixed(2)}</p> : null}
              {order.shippingFee ? <p>Shipping: ${order.shippingFee.toFixed(2)}</p> : null}
              {order.couponCode ? <p className="text-xs text-neutral-400">Coupon: {order.couponCode}</p> : null}
              <p className="font-semibold text-base">Total: ${order.total.toFixed(2)} {order.currency || "USD"}</p>
            </div>
          </div>

          {/* Tracking Timeline */}
          {order.trackingEvents && order.trackingEvents.length > 0 && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="font-semibold mb-3">{t("Tracking Timeline")}</h2>
              <div className="space-y-0">
                {order.trackingEvents.map((event, i) => (
                  <div key={event.id} className="flex gap-4 pb-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-600 mt-1.5 z-10" />
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

          {/* Admin Notes */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("Admin Notes")}</h2>
            {editing ? (
              <textarea value={editForm.adminNote || ""} onChange={(e) => setEditForm({ ...editForm, adminNote: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Internal notes..." />
            ) : (
              <p className="text-sm text-neutral-600">{order.adminNote || "No notes"}</p>
            )}
            {order.customerNote && (
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">Customer Note:</p>
                <p className="text-sm text-neutral-600">{order.customerNote}</p>
              </div>
            )}
          </div>

          {/* Audit Log */}
          {order.auditLogs.length > 0 && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="font-semibold mb-3">{t("Activity Log")}</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {order.auditLogs.map((log) => (
                  <div key={log.id} className="flex justify-between text-sm text-neutral-500 py-1 border-b border-neutral-100 last:border-0">
                    <span>{log.action}{log.newStatus ? " → " + log.newStatus : ""}{log.performedBy ? " by " + log.performedBy : ""}</span>
                    <span className="text-xs">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("OrderSummary")}</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-neutral-500">{t("Created")}</dt><dd>{new Date(order.createdAt).toLocaleString()}</dd></div>
              {order.paidAt && <div className="flex justify-between"><dt className="text-neutral-500">{t("Paid")}</dt><dd>{new Date(order.paidAt).toLocaleString()}</dd></div>}
              {order.shippedAt && <div className="flex justify-between"><dt className="text-neutral-500">{t("Shipped")}</dt><dd>{new Date(order.shippedAt).toLocaleString()}</dd></div>}
              {order.deliveredAt && <div className="flex justify-between"><dt className="text-neutral-500">{t("Delivered")}</dt><dd>{new Date(order.deliveredAt).toLocaleString()}</dd></div>}
              {order.deliveryStatus && <div className="flex justify-between"><dt className="text-neutral-500">{t("Delivery Status")}</dt><dd>{order.deliveryStatus}</dd></div>}
            </dl>
          </div>

          {/* Shipping Info Card */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("Shipping & Tracking")}</h2>
            <div className="text-sm space-y-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">{t("Shipping Company")}</label>
                <input value={shippingCompany} onChange={(e) => setShippingCompany(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. USPS, FedEx" />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">{t("Tracking Number")}</label>
                <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Enter tracking number" />
              </div>
              <button onClick={handleShip} className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
                {t("📦 Update Tracking")}
              </button>
            </div>
          </div>

          {/* Payment Card */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("Payment")}</h2>
            {order.payments.length > 0 ? order.payments.map((p) => (
              <div key={p.id} className="text-sm space-y-1 text-neutral-600 border-b border-neutral-100 pb-3 mb-3 last:border-0">
                <p>Provider: {p.provider} | Status: <span className="font-medium">{p.status}</span></p>
                <p>Amount: ${p.amount.toFixed(2)} {p.currency}</p>
                {p.invoiceUrl && <p>Invoice: <a href={p.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Open →</a></p>}
              </div>
            )) : <p className="text-sm text-neutral-400">No payment record yet.</p>}
          </div>

          {/* Actions Card */}
          <div className="rounded-xl border bg-white p-6 space-y-3">
            <h2 className="font-semibold mb-3">{t("Actions")}</h2>
            {order.status === "PENDING_PAYMENT" && (
              <button onClick={() => markAsPaid(order.id)} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-semibold">
                {t("✅ Confirm Payment")}
              </button>
            )}
            {["PENDING_PAYMENT", "PAID"].includes(order.status) && (
              <button onClick={handleCancel} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                {t("✕ Cancel Order")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
