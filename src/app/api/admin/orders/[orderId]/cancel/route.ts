import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const { reason } = await req.json();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    if (!["PENDING_PAYMENT", "PAID"].includes(order.status)) {
      return NextResponse.json({ error: "当前订单状态不支持取消" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    await prisma.payment.updateMany({
      where: { orderId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });

    await prisma.orderAuditLog.create({
      data: {
        orderId,
        action: "ORDER_CANCELLED",
        performedBy: "admin",
        previousStatus: order.status,
        newStatus: "CANCELLED",
        metadata: { reason },
      },
    });

    return NextResponse.json({ success: true, newStatus: "CANCELLED" });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
