import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, total, email, customerName, customerPhone, items } = await req.json();

    // Auto-create or find customer by email
    let customer = null;
    if (email) {
      customer = await prisma.customer.findUnique({ where: { email } });
      if (customer) {
        // Update existing customer
        await prisma.customer.update({
          where: { id: customer.id },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: total },
            lastOrderAt: new Date(),
            lastVisitAt: new Date(),
            ...(customerName ? { firstName: customer.firstName || customerName.split(" ")[0], lastName: customer.lastName || customerName.split(" ").slice(1).join(" ") } : {}),
          },
        });
      } else {
        // Create new customer
        customer = await prisma.customer.create({
          data: {
            email,
            firstName: customerName ? customerName.split(" ")[0] : null,
            lastName: customerName ? customerName.split(" ").slice(1).join(" ") : null,
            phone: customerPhone,
            totalOrders: 1,
            totalSpent: total,
            firstOrderAt: new Date(),
            lastOrderAt: new Date(),
            lastVisitAt: new Date(),
          },
        });
      }
    }

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const counter = await prisma.orderCounter.upsert({
      where: { date: today },
      update: { sequence: { increment: 1 } },
      create: { date: today, sequence: 1 },
    });
    const orderNum = orderNumber || ("ES-" + today + "-" + String(counter.sequence).padStart(4, "0"));

    const order = await prisma.order.create({
      data: { orderNumber: orderNum, status: "PENDING_PAYMENT", total, email: email ?? null, customerId: customer?.id ?? null, customerName: customerName ?? null, customerPhone: customerPhone ?? null },
    });

    for (const item of items || []) {
      await prisma.orderItem.create({
        data: { orderId: order.id, productId: item.productId ?? null, quantity: item.quantity ?? 1, price: item.price ?? 0, productName: item.productName ?? null, productImage: item.productImage ?? null },
      });
    }

    return NextResponse.json({ orderNumber: orderNum, total, orderId: order.id });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
