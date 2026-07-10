import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.url.split("/").pop()?.split("?")[0];
    if (!orderId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: { orderBy: { createdAt: "desc" } },
        auditLogs: { orderBy: { createdAt: "desc" } },
        trackingEvents: { orderBy: { timestamp: "asc" } },
      },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...order, total: Number(order.total), subtotal: order.subtotal ? Number(order.subtotal) : null,
      shippingFee: order.shippingFee ? Number(order.shippingFee) : null,
      tax: order.tax ? Number(order.tax) : null,
      discountAmount: order.discountAmount ? Number(order.discountAmount) : null,
      items: order.items.map((i) => ({ ...i, price: Number(i.price), unitPrice: i.unitPrice ? Number(i.unitPrice) : null, subtotal: i.subtotal ? Number(i.subtotal) : null })),
      payments: order.payments.map((p) => ({ ...p, amount: Number(p.amount) })),
    });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const orderId = req.url.split("/").pop()?.split("?")[0];
    if (!orderId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();

    // Only allow updating specific fields
    const allowedFields = [
      "customerName", "customerEmail", "customerPhone",
      "shippingName", "shippingPhone", "shippingAddress1", "shippingAddress2",
      "shippingCity", "shippingProvince", "shippingPostal", "shippingCountry",
      "adminNote", "customerNote",
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Audit log
    await prisma.orderAuditLog.create({
      data: {
        orderId,
        action: "ORDER_UPDATED",
        performedBy: "admin",
        metadata: { updatedFields: Object.keys(updateData) },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch { return NextResponse.json({ error: "Failed to update" }, { status: 500 }); }
}