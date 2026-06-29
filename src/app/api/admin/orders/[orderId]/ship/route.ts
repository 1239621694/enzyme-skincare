import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email/orderEmails";

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const { trackingNumber, shippingCompany } = await req.json();

    if (!trackingNumber) {
      return NextResponse.json({ error: "缺少物流单号" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    if (!["PAID", "PROCESSING"].includes(order.status)) {
      return NextResponse.json({ error: "当前订单状态不支持发货" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED" },
    });

    await prisma.orderAuditLog.create({
      data: {
        orderId,
        action: "ORDER_SHIPPED",
        performedBy: "admin",
        previousStatus: order.status,
        newStatus: "SHIPPED",
        metadata: { trackingNumber, shippingCompany },
      },
    });

    // Send shipping notification email (fire and forget)
    if (order.customerEmail) {
      sendOrderConfirmationEmail({
        orderNumber: order.orderNumber || "",
        customerName: order.customerName || "",
        customerEmail: order.customerEmail,
        total: Number(order.total),
        items: order.items.map((i: any) => ({
          productName: i.productName || "商品",
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice || i.price),
        })),
        shippingName: order.shippingName || "",
        shippingAddress1: order.shippingAddress1 || "",
        shippingCity: order.shippingCity || "",
        shippingProvince: order.shippingProvince || "",
      }).catch((e) => console.error("Ship email failed:", e));
    }

    return NextResponse.json({ success: true, newStatus: "SHIPPED" });
  } catch (error) {
    console.error("Ship error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
