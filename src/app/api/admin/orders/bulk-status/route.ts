import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderIds, status, note } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "orderIds array is required" }, { status: 400 });
    }
    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const validStatuses = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const timestamp = status === "SHIPPED" ? { shippedAt: new Date() }
      : status === "DELIVERED" ? { deliveredAt: new Date() }
      : {};

    // Update all orders
    const result = await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status, ...timestamp },
    });

    // Create audit logs for each
    await prisma.orderAuditLog.createMany({
      data: orderIds.map((orderId: string) => ({
        orderId,
        action: "BULK_STATUS_UPDATE",
        performedBy: "admin",
        previousStatus: null,
        newStatus: status,
        metadata: { bulk: true, note: note || "" },
      })),
    });

    return NextResponse.json({ success: true, updated: result.count });
  } catch (e) {
    console.error("Bulk status update error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
