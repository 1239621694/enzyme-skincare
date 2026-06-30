export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

async function markAsPaid(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  await prisma.order.update({ where: { id: orderId }, data: { status: "PAID", paidAt: new Date() } });
  await prisma.orderAuditLog.create({ data: { orderId, action: "PAYMENT_CONFIRMED", performedBy: "admin", metadata: { source: "admin_ui" } } });
  revalidatePath("/admin/orders/" + orderId);
}

async function cancelOrder(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
  await prisma.payment.updateMany({ where: { orderId }, data: { status: "CANCELLED" } });
  await prisma.orderAuditLog.create({ data: { orderId, action: "ORDER_CANCELLED", performedBy: "admin", metadata: { reason: String(formData.get("reason") || "") } } });
  revalidatePath("/admin/orders/" + orderId);
}

async function markShipped(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  await prisma.order.update({ where: { id: orderId }, data: { status: "SHIPPED" } });
  await prisma.orderAuditLog.create({ data: { orderId, action: "ORDER_SHIPPED", performedBy: "admin", metadata: { trackingNumber: String(formData.get("trackingNumber") || ""), shippingCompany: String(formData.get("shippingCompany") || "") } } });
  revalidatePath("/admin/orders/" + orderId);
}

async function attachPayment(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  const invoiceUrl = formData.get("invoiceUrl") as string;
  const amount = Number(formData.get("amount") ?? 0);
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;
  await prisma.payment.create({ data: { orderId, provider: "XTRANSFER", invoiceUrl, amount, currency: "USD", status: "PENDING" } });
  await prisma.orderAuditLog.create({ data: { orderId, action: "PAYMENT_ATTACHED", metadata: { invoiceUrl } } });
  revalidatePath("/admin/orders/" + orderId);
}

export default async function AdminOrderDetailPage({ params }: any) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "desc" } },
      auditLogs: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!order) notFound();

  const statusColor: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-100 text-amber-800", PAID: "bg-green-100 text-green-800",
    PROCESSING: "bg-blue-100 text-blue-800", SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-neutral-100 text-neutral-600", CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-red-50 text-red-500",
  };

  return (
    <div>
      {/* Card 1: Basic Info */}
      <div className="rounded-xl border bg-white p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading text-2xl font-bold">Order #{order.orderNumber || id.slice(0, 12)}</h1>
          <span className={"px-3 py-1 rounded-full text-xs font-medium " + (statusColor[order.status] || "bg-neutral-100")}>{order.status}</span>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-neutral-500">Created</dt><dd>{new Date(order.createdAt).toLocaleString()}</dd></div>
          {order.paidAt && <div className="flex justify-between"><dt className="text-neutral-500">Paid At</dt><dd>{new Date(order.paidAt).toLocaleString()}</dd></div>}
        </dl>
      </div>

      {/* Card 2: Customer Info */}
      <div className="rounded-xl border bg-white p-6 mb-4">
        <h2 className="font-semibold mb-3">Customer</h2>
        <div className="text-sm space-y-1 text-neutral-600">
          <p>Name: {order.customerName || order.email || "—"}</p>
          <p>Email: {order.customerEmail || order.email || "—"}</p>
          <p>Phone: {order.customerPhone || "—"}</p>
        </div>
      </div>

      {/* Card 3: Shipping Address */}
      <div className="rounded-xl border bg-white p-6 mb-4">
        <h2 className="font-semibold mb-3">Shipping Address</h2>
        <div className="text-sm space-y-1 text-neutral-600">
          {order.shippingName ? <p>{order.shippingName}{order.shippingPhone ? " | " + order.shippingPhone : ""}</p> : <p>No address collected</p>}
          {order.shippingAddress1 && <p>{order.shippingAddress1}{order.shippingAddress2 ? ", " + order.shippingAddress2 : ""}</p>}
          {order.shippingCity && <p>{order.shippingCity}{order.shippingProvince ? ", " + order.shippingProvince : ""} {order.shippingPostal || ""}</p>}
          {order.shippingCountry && <p>{order.shippingCountry}</p>}
        </div>
      </div>

      {/* Card 4: Items */}
      <div className="rounded-xl border bg-white p-6 mb-4">
        <h2 className="font-semibold mb-3">Items</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-neutral-500"><th className="pb-2">Product</th><th className="pb-2">Qty</th><th className="pb-2">Price</th><th className="pb-2 text-right">Subtotal</th></tr></thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id} className="border-t border-neutral-100">
                <td className="py-2">{i.productName || "Product"}</td>
                <td className="py-2">{i.quantity}</td>
                <td className="py-2">${Number(i.unitPrice || i.price).toFixed(2)}</td>
                <td className="py-2 text-right">${Number(i.subtotal || Number(i.price) * i.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-neutral-200 mt-3 pt-3 space-y-1 text-sm text-right">
          <p>Subtotal: ${Number(order.subtotal || order.total).toFixed(2)}</p>
          {order.shippingFee ? <p>Shipping: ${Number(order.shippingFee).toFixed(2)}</p> : null}
          <p className="font-semibold text-base">Total: ${Number(order.total).toFixed(2)} {order.currency || "USD"}</p>
        </div>
      </div>

      {/* Card 5: Payment Info */}
      <div className="rounded-xl border bg-white p-6 mb-4">
        <h2 className="font-semibold mb-3">Payment</h2>
        {order.payments.length > 0 ? order.payments.map((p) => (
          <div key={p.id} className="text-sm space-y-1 text-neutral-600 border-b border-neutral-100 pb-3 mb-3 last:border-0">
            <p>Provider: {p.provider} | Status: <span className="font-medium">{p.status}</span></p>
            <p>Amount: ${Number(p.amount).toFixed(2)} {p.currency}</p>
            {p.invoiceUrl && <p>Invoice: <a href={p.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Open &rarr;</a></p>}
            {p.confirmedBy && <p>Confirmed by: {p.confirmedBy}{p.confirmedNote ? " - " + p.confirmedNote : ""}</p>}
          </div>
        )) : <p className="text-sm text-neutral-400">No payment record yet.</p>}
      </div>

      {/* Card 6: Actions */}
      <div className="rounded-xl border bg-white p-6 mb-4 space-y-3">
        <h2 className="font-semibold mb-3">Actions</h2>

        {order.status === "PENDING_PAYMENT" && (
          <form action={attachPayment} className="space-y-2 border-b border-neutral-100 pb-4 mb-4">
            <h3 className="text-sm font-medium">Attach Payment Link</h3>
            <input type="hidden" name="orderId" value={order.id} />
            <input name="invoiceUrl" placeholder="Invoice URL" className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm" required />
            <input name="amount" type="number" step="0.01" defaultValue={Number(order.total).toFixed(2)} className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm" />
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-sm rounded-full hover:bg-primary-700">Attach Payment</button>
          </form>
        )}

        {order.status === "PENDING_PAYMENT" && (
          <form action={markAsPaid} className="border-b border-neutral-100 pb-4 mb-4">
            <input type="hidden" name="orderId" value={order.id} />
            <button type="submit" className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-700">✅ Confirm Payment Received</button>
          </form>
        )}

        {(order.status === "PAID" || order.status === "PROCESSING") && (
          <form action={markShipped} className="border-b border-neutral-100 pb-4 mb-4">
            <h3 className="text-sm font-medium mb-2">Mark as Shipped</h3>
            <input type="hidden" name="orderId" value={order.id} />
            <div className="flex gap-2 mb-2">
              <input name="shippingCompany" placeholder="Shipping company" className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm" />
              <input name="trackingNumber" placeholder="Tracking number" className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm" />
            </div>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-sm rounded-full hover:bg-primary-700">Ship Order</button>
          </form>
        )}

        {["PENDING_PAYMENT", "PAID"].includes(order.status) && (
          <form action={cancelOrder}>
            <input type="hidden" name="orderId" value={order.id} />
            <input name="reason" placeholder="Cancellation reason" className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm mb-2" />
            <button type="submit" className="px-4 py-2 bg-red-600 text-white text-sm rounded-full hover:bg-red-700">Cancel Order</button>
          </form>
        )}
      </div>

      {/* Card 7: Audit Log */}
      {order.auditLogs.length > 0 && (
        <div className="rounded-xl border bg-white p-6 mb-4">
          <h2 className="font-semibold mb-3">Audit Log</h2>
          <div className="space-y-2">
            {order.auditLogs.map((log) => (
              <div key={log.id} className="flex justify-between text-sm text-neutral-500 py-1 border-b border-neutral-100 last:border-0">
                <span>{log.action}{log.performedBy ? " by " + log.performedBy : ""}</span>
                <span className="text-xs">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}