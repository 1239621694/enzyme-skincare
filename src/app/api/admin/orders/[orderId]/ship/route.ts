import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const orderId = req.url.split("/orders/")[1]?.split("/")[0];
    if (!orderId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!["PAID", "PROCESSING"].includes(order.status)) return NextResponse.json({ error: "Cannot ship" }, { status: 400 });

    await prisma.order.update({ where: { id: orderId }, data: { status: "SHIPPED" } });
    await prisma.orderAuditLog.create({ data: { orderId, action: "ORDER_SHIPPED", performedBy: body.confirmedBy ?? "admin", metadata: { trackingNumber: body.trackingNumber, shippingCompany: body.shippingCompany } } });

    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}