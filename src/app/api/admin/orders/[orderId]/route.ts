import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.url.split("/").pop()?.split("?")[0];
    if (!orderId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payments: { orderBy: { createdAt: "desc" } }, auditLogs: { orderBy: { createdAt: "desc" } } },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...order, total: Number(order.total), subtotal: order.subtotal ? Number(order.subtotal) : null,
      shippingFee: order.shippingFee ? Number(order.shippingFee) : null,
      tax: order.tax ? Number(order.tax) : null,
      items: order.items.map((i) => ({ ...i, price: Number(i.price), unitPrice: i.unitPrice ? Number(i.unitPrice) : null, subtotal: i.subtotal ? Number(i.subtotal) : null })),
      payments: order.payments.map((p) => ({ ...p, amount: Number(p.amount) })),
    });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}