import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const orderId = req.url.split("/orders/")[1]?.split("/")[0];
    if (!orderId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();
    const { provider, invoiceUrl, amount, currency } = body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "PENDING_PAYMENT") return NextResponse.json({ error: "Order not in PENDING_PAYMENT" }, { status: 400 });
    if (Math.abs(Number(amount) - Number(order.total)) > 0.01) return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });

    const payment = await prisma.payment.create({
      data: { orderId, provider: provider ?? "XTRANSFER", invoiceUrl, amount, currency: currency ?? "USD", status: "PENDING" },
    });
    await prisma.orderAuditLog.create({ data: { orderId, action: "PAYMENT_ATTACHED", metadata: { paymentId: payment.id, invoiceUrl } } });

    return NextResponse.json({ success: true, paymentId: payment.id });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}