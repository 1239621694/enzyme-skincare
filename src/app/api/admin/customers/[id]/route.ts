import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const id = req.url.split("/").pop()?.split("?")[0];
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: { orderBy: { createdAt: "desc" }, take: 20, include: { items: true } },
      },
    });

    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const stats = {
      totalOrders: customer.totalOrders,
      totalSpent: Number(customer.totalSpent),
      averageOrderValue: customer.totalOrders > 0 ? Number(customer.totalSpent) / customer.totalOrders : 0,
    };

    return NextResponse.json({
      ...customer,
      totalSpent: Number(customer.totalSpent),
      orders: customer.orders.map((o) => ({
        ...o,
        total: Number(o.total),
        items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
      })),
      stats,
    });
  } catch (e) {
    console.error("Customer detail error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.url.split("/").pop()?.split("?")[0];
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();
    const allowedFields = ["firstName", "lastName", "phone", "tags", "notes", "referralSource"];
    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const customer = await prisma.customer.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, customer });
  } catch (e) {
    console.error("Customer update error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
