export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

async function markAsPaid(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "paid" },
  });

  await prisma.orderStatusHistory.create({
    data: { orderId, fromStatus: "pending", toStatus: "paid", note: "Admin confirmed payment" },
  });

  revalidatePath("/admin/orders/" + orderId);
}

export default async function AdminOrderDetailPage({ params }: any) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, statusHistory: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold">Order #{order.orderNumber || id.slice(0, 12)}</h1>

      <div className="rounded-xl border bg-white p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-neutral-500">Status</dt><dd className="font-medium">{order.status}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-500">Total</dt><dd className="font-medium">${Number(order.total).toFixed(2)}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-500">Email</dt><dd>{order.email || "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-500">Date</dt><dd>{new Date(order.createdAt).toLocaleDateString()}</dd></div>
        </dl>
      </div>

      {order.status === "pending" && (
        <form action={markAsPaid} className="mt-4">
          <input type="hidden" name="orderId" value={order.id} />
          <button type="submit" className="w-full px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors">
            ✅ Confirm Payment Received
          </button>
        </form>
      )}

      <div className="mt-4 rounded-xl border bg-white p-6">
        <h2 className="mb-3 font-semibold">Items</h2>
        {order.items.map((i: any) => (
          <div key={i.id} className="flex justify-between border-b py-2 text-sm"><span>{i.product?.name || "Product"} x{i.quantity}</span><span>${Number(i.price).toFixed(2)}</span></div>
        ))}
      </div>

      {order.statusHistory.length > 0 && (
        <div className="mt-4 rounded-xl border bg-white p-6">
          <h2 className="mb-3 font-semibold">Status History</h2>
          {order.statusHistory.map((h: any) => (
            <div key={h.id} className="flex justify-between text-sm text-neutral-500 py-1 border-b last:border-0"><span>{h.fromStatus} → {h.toStatus}</span><span>{new Date(h.createdAt).toLocaleString()}</span></div>
          ))}
        </div>
      )}
    </div>
  );
}
