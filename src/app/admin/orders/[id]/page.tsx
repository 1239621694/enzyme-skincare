export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendOrderConfirmationEmail } from "@/lib/email/orderEmails";

async function markAsPaid(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  const note = formData.get("note") as string;

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return;

  await prisma.order.update({ where: { id: orderId }, data: { status: "PAID", paidAt: new Date() } });

  await prisma.orderAuditLog.create({
    data: { orderId, action: "PAYMENT_CONFIRMED", performedBy: "admin", previousStatus: "PENDING_PAYMENT", newStatus: "PAID", metadata: { note } },
  });

  // 发送确认邮件
  if (order.customerEmail) {
    sendOrderConfirmationEmail({
      orderNumber: order.orderNumber || "",
      customerName: order.customerName || "",
      customerEmail: order.customerEmail,
      total: Number(order.total),
      items: order.items.map((i: any) => ({ productName: i.productName || "商品", quantity: i.quantity, unitPrice: Number(i.unitPrice || i.price) })),
      shippingName: order.shippingName || "",
      shippingAddress1: order.shippingAddress1 || "",
      shippingCity: order.shippingCity || "",
      shippingProvince: order.shippingProvince || "",
    }).catch((e) => console.error("Email failed:", e));
  }

  revalidatePath("/admin/orders/" + orderId);
}

async function cancelOrder(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || !["PENDING_PAYMENT", "PAID"].includes(order.status)) return;
  await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
  await prisma.orderAuditLog.create({
    data: { orderId, action: "ORDER_CANCELLED", performedBy: "admin", previousStatus: order.status, newStatus: "CANCELLED" },
  });
  revalidatePath("/admin/orders/" + orderId);
}

export default async function AdminOrderDetailPage({ params }: any) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true, auditLogs: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();

  const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "等待付款", PAID: "已付款", PROCESSING: "处理中",
    SHIPPED: "已发货", DELIVERED: "已送达", CANCELLED: "已取消", REFUNDED: "已退款",
  };
  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-100 text-amber-800", PAID: "bg-green-100 text-green-800",
    PROCESSING: "bg-blue-100 text-blue-800", SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800", CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold">订单 #{order.orderNumber || id.slice(0, 12)}</h1>
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-neutral-100"}`}>
        {statusLabels[order.status] || order.status}
      </span>

      {/* 基本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="rounded-xl border bg-white p-4 text-sm">
          <p className="text-neutral-500 mb-2">客户信息</p>
          <p className="font-medium">{order.customerName || "—"}</p>
          <p>{order.customerEmail || "—"}</p>
          <p>{order.customerPhone || "—"}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-sm">
          <p className="text-neutral-500 mb-2">收货地址</p>
          <p className="font-medium">{order.shippingName || "—"}</p>
          <p>{order.shippingPhone || ""}</p>
          <p>{order.shippingAddress1 || ""}</p>
          <p>{order.shippingCity} {order.shippingProvince}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-sm">
          <p className="text-neutral-500 mb-2">金额信息</p>
          <p>小计：¥{Number(order.subtotal || order.total).toFixed(2)}</p>
          <p>运费：¥{Number(order.shippingFee || 0).toFixed(2)}</p>
          <p className="text-base font-bold mt-1">总计：¥{Number(order.total).toFixed(2)}</p>
          <p className="text-xs text-neutral-400 mt-1">创建：{new Date(order.createdAt).toLocaleString("zh-CN")}</p>
        </div>
      </div>

      {/* 商品清单 */}
      <div className="rounded-xl border bg-white p-4 mt-4">
        <h2 className="font-semibold mb-3">商品清单</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-neutral-500 border-b"><th className="pb-2">商品</th><th className="pb-2">数量</th><th className="pb-2 text-right">单价</th><th className="pb-2 text-right">小计</th></tr></thead>
          <tbody>
            {order.items.map((i: any) => (
              <tr key={i.id} className="border-b last:border-0">
                <td className="py-2">{i.productName || "商品"}</td>
                <td className="py-2">×{i.quantity}</td>
                <td className="py-2 text-right">¥{Number(i.unitPrice || i.price).toFixed(2)}</td>
                <td className="py-2 text-right font-medium">¥{(Number(i.unitPrice || i.price) * i.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 支付信息 */}
      <div className="rounded-xl border bg-white p-4 mt-4">
        <h2 className="font-semibold mb-3">支付信息</h2>
        {order.payments.length > 0 ? (
          order.payments.map((p) => (
            <div key={p.id} className="text-sm space-y-1">
              <p>支付方式：{p.provider}</p>
              <p>状态：{p.status === "COMPLETED" ? "✅ 已付款" : p.status === "PENDING" ? "⏳ 等待付款" : p.status}</p>
              <p>金额：¥{Number(p.amount).toFixed(2)}</p>
              {(p.providerMetadata as any)?.invoiceUrl && (
                <p>Invoice：<a href={(p.providerMetadata as any).invoiceUrl} target="_blank" className="text-primary-600 hover:underline">查看</a></p>
              )}
              {p.confirmedBy && <p>确认人：{p.confirmedBy}</p>}
              {p.confirmedNote && <p>备注：{p.confirmedNote}</p>}
              {p.completedAt && <p>完成时间：{new Date(p.completedAt).toLocaleString("zh-CN")}</p>}
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500">暂无支付信息</p>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="mt-4 space-y-3">
        {order.status === "PENDING_PAYMENT" && (
          <>
            <details className="rounded-xl border border-primary-200 bg-white p-4">
              <summary className="font-semibold text-primary-700 cursor-pointer">📎 附加 XTransfer 支付链接</summary>
              <form action={async (fd) => {
                "use server";
                const orderId = fd.get("orderId") as string;
                const invoiceUrl = fd.get("invoiceUrl") as string;
                const order = await prisma.order.findUnique({ where: { id: orderId } });
                if (!order) return;
                await prisma.payment.create({
                  data: { orderId, provider: "XTRANSFER", providerMetadata: { invoiceUrl }, amount: order.total, status: "PENDING" },
                });
                await prisma.orderAuditLog.create({
                  data: { orderId, action: "PAYMENT_ATTACHED", performedBy: "admin", metadata: { invoiceUrl } },
                });
                revalidatePath("/admin/orders/" + orderId);
              }} className="mt-3">
                <input type="hidden" name="orderId" value={order.id} />
                <input name="invoiceUrl" placeholder="https://xtransfer.com/invoice/..." required className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">确认附加</button>
              </form>
            </details>

            <details className="rounded-xl border border-green-200 bg-white p-4">
              <summary className="font-semibold text-green-700 cursor-pointer">✅ 确认付款</summary>
              <form action={markAsPaid} className="mt-3 flex gap-2">
                <input type="hidden" name="orderId" value={order.id} />
                <input name="note" placeholder="备注（可选）" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">确认</button>
              </form>
            </details>

            <form action={cancelOrder}>
              <input type="hidden" name="orderId" value={order.id} />
              <button type="submit" className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                onClick={(e) => { if (!confirm("确定取消此订单？")) e.preventDefault(); }}>
                取消订单
              </button>
            </form>
          </>
        )}

        {["PAID", "PROCESSING"].includes(order.status) && (
          <details className="rounded-xl border border-purple-200 bg-white p-4">
            <summary className="font-semibold text-purple-700 cursor-pointer">📦 标记发货</summary>
            <form action={async (fd) => {
              "use server";
              const orderId = fd.get("orderId") as string;
              const trackingNumber = fd.get("trackingNumber") as string;
              await prisma.order.update({ where: { id: orderId }, data: { status: "SHIPPED" } });
              await prisma.orderAuditLog.create({
                data: { orderId, action: "ORDER_SHIPPED", performedBy: "admin", newStatus: "SHIPPED", metadata: { trackingNumber } },
              });
              revalidatePath("/admin/orders/" + orderId);
            }} className="mt-3 space-y-2">
              <input type="hidden" name="orderId" value={order.id} />
              <input name="trackingNumber" placeholder="物流单号" required className="w-full px-3 py-2 border rounded-lg text-sm" />
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">确认发货</button>
            </form>
          </details>
        )}

        {["SHIPPED"].includes(order.status) && (
          <form action={async (fd) => {
            "use server";
            const orderId = fd.get("orderId") as string;
            await prisma.order.update({ where: { id: orderId }, data: { status: "DELIVERED" } });
            revalidatePath("/admin/orders/" + orderId);
          }}>
            <input type="hidden" name="orderId" value={order.id} />
            <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">标记已送达</button>
          </form>
        )}
      </div>

      {/* 操作历史 */}
      {order.auditLogs.length > 0 && (
        <div className="rounded-xl border bg-white p-4 mt-4">
          <h2 className="font-semibold mb-3">操作历史</h2>
          <div className="space-y-2 text-sm">
            {order.auditLogs.map((log: any) => (
              <div key={log.id} className="flex justify-between text-neutral-500 py-1 border-b last:border-0">
                <span>
                  <span className="font-medium text-neutral-700">{log.action}</span>
                  {log.previousStatus && log.newStatus && (
                    <span className="text-neutral-400"> — {log.previousStatus} → {log.newStatus}</span>
                  )}
                </span>
                <span className="text-xs">{new Date(log.createdAt).toLocaleString("zh-CN")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
