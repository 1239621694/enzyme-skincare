import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const { orderId } = await params;
  const { token } = await searchParams;
  if (!token) return notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!order) return notFound();

  const payment = order.payments[0];
  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING_PAYMENT: { label: "等待付款", color: "bg-amber-100 text-amber-800" },
    PAID: { label: "已付款", color: "bg-green-100 text-green-800" },
    PROCESSING: { label: "处理中", color: "bg-blue-100 text-blue-800" },
    SHIPPED: { label: "已发货", color: "bg-purple-100 text-purple-800" },
    DELIVERED: { label: "已送达", color: "bg-green-100 text-green-800" },
    CANCELLED: { label: "已取消", color: "bg-red-100 text-red-800" },
    REFUNDED: { label: "已退款", color: "bg-neutral-100 text-neutral-800" },
  };
  const st = statusLabels[order.status] || { label: order.status, color: "bg-neutral-100" };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">← 返回首页</Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">订单 {order.orderNumber}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${st.color}`}>{st.label}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-500 mb-2">订单信息</h3>
          <p className="text-sm">订单号：{order.orderNumber}</p>
          <p className="text-sm">金额：¥{Number(order.total).toFixed(2)}</p>
          <p className="text-sm">创建时间：{new Date(order.createdAt).toLocaleString("zh-CN")}</p>
        </div>
        <div className="border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-500 mb-2">收货信息</h3>
          <p className="text-sm">{order.shippingName}</p>
          <p className="text-sm">{order.shippingPhone}</p>
          <p className="text-sm">
            {order.shippingAddress1}
            {order.shippingAddress2 ? ` ${order.shippingAddress2}` : ""}
          </p>
          <p className="text-sm">{order.shippingCity} {order.shippingProvince} {order.shippingPostal}</p>
        </div>
      </div>

      <div className="border rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-neutral-500 mb-3">商品清单</h3>
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
            <span>{item.productName || "商品"} × {item.quantity}</span>
            <span className="font-medium">¥{Number(item.unitPrice || item.price).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 text-base font-bold">
          <span>合计</span>
          <span>¥{Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {order.status === "PENDING_PAYMENT" && payment?.providerMetadata && (
        <div className="border border-primary-200 bg-primary-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">💳 等待付款</h3>
          <p className="text-sm text-neutral-600 mb-4">
            请点击下方按钮跳转到 XTransfer 完成付款。转账时请备注订单号。
          </p>
          <a
            href={(payment.providerMetadata as any)?.invoiceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            通过 XTransfer 付款
          </a>
          <div className="mt-4 text-xs text-neutral-500 space-y-1">
            <p>1. 点击上方按钮跳转到 XTransfer 付款页面</p>
            <p>2. 根据页面提示完成银行转账</p>
            <p>3. 转账时请备注订单号：{order.orderNumber}</p>
            <p>4. 转账完成后请等待管理员确认（通常 1-3 个工作日）</p>
          </div>
        </div>
      )}

      {order.status === "PENDING_PAYMENT" && !payment?.providerMetadata && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-6 mb-6">
          <p className="text-sm text-amber-800">⏳ 管理员正在处理您的订单，请稍候...</p>
        </div>
      )}

      {order.status === "PAID" && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-6 mb-6">
          <p className="text-green-800 font-semibold">✅ 付款成功！我们将尽快为您发货。</p>
        </div>
      )}
    </div>
  );
}
