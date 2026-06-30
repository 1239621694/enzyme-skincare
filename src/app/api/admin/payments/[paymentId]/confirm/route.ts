import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const paymentId = req.url.split("/payments/")[1]?.split("/")[0];
    if (!paymentId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();
    const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { order: true } });
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    if (payment.status !== "PENDING") return NextResponse.json({ error: "Payment not pending" }, { status: 400 });

    await prisma.payment.update({ where: { id: paymentId }, data: { status: "COMPLETED", confirmedBy: body.confirmedBy ?? null, confirmedNote: body.note ?? null, completedAt: new Date() } });
    await prisma.order.update({ where: { id: payment.orderId }, data: { status: "PAID", paidAt: new Date() } });
    await prisma.orderAuditLog.create({ data: { orderId: payment.orderId, action: "PAYMENT_CONFIRMED", performedBy: body.confirmedBy ?? "admin", metadata: { paymentId, note: body.note } } });

    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}