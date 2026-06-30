import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const orderId = req.url.split("/orders/")[1]?.split("/")[0];
    if (!orderId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payments: true } });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!["PENDING_PAYMENT", "PAID"].includes(order.status)) return NextResponse.json({ error: "Cannot cancel" }, { status: 400 });

    await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
    if (order.payments.length > 0) await prisma.payment.updateMany({ where: { orderId }, data: { status: "CANCELLED" } });
    await prisma.orderAuditLog.create({ data: { orderId, action: "ORDER_CANCELLED", performedBy: body.confirmedBy ?? "admin", metadata: { reason: body.reason } } });

    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}