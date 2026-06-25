import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const total = items.reduce((sum: number, i: any) => sum + (i.price || 0) * (i.quantity || 1), 0);
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const counter = await prisma.orderCounter.upsert({
      where: { date: today },
      update: { sequence: { increment: 1 } },
      create: { date: today, sequence: 1 },
    });
    const orderNumber = "ES-" + today + "-" + String(counter.sequence).padStart(4, "0");

    const order = await prisma.order.create({
      data: { orderNumber, status: "pending", total, email: email ?? null },
    });

    for (const item of items) {
      await prisma.orderItem.create({
        data: { orderId: order.id, productId: item.productId ?? null, quantity: item.quantity ?? 1, price: item.price ?? 0 },
      });
    }

    const xtransferUrl = process.env.NEXT_PUBLIC_XTRANSFER_URL || "https://www.xtransfer.com/cashier/purchase-order/@mylink/8bc6b9e2cbd54b928a305451da14ac8b";
    return NextResponse.json({ orderNumber, total, xtransferUrl: xtransferUrl + "?order=" + orderNumber });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}