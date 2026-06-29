import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const { provider, invoiceUrl, amount } = await req.json();

    if (!provider || !invoiceUrl || !amount) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "当前订单状态不支持附加支付链接" }, { status: 400 });
    }
    if (Number(order.total) !== amount) {
      return NextResponse.json({ error: "金额与订单不匹配" }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        provider,
        providerMetadata: { invoiceUrl },
        amount,
        currency: order.currency,
        status: "PENDING",
      },
    });

    await prisma.orderAuditLog.create({
      data: {
        orderId,
        action: "PAYMENT_ATTACHED",
        performedBy: "admin",
        newStatus: "PENDING_PAYMENT",
        metadata: { provider, invoiceUrl },
      },
    });

    return NextResponse.json({ success: true, paymentId: payment.id });
  } catch (error) {
    console.error("Attach payment error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
