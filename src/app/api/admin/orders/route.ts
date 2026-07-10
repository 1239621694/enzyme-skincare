import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const deliveryStatus = url.searchParams.get("deliveryStatus") || "";
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";
    const paymentStatus = url.searchParams.get("paymentStatus") || "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const where: any = {};

    // Search across order number, customer name, email
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search } },
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by delivery status
    if (deliveryStatus) {
      where.deliveryStatus = deliveryStatus;
    }

    // Filter by date range
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z");
    }

    // Allowed sort fields (prevent injection)
    const sortFieldMap: Record<string, string> = {
      createdAt: "createdAt",
      total: "total",
      status: "status",
      orderNumber: "orderNumber",
      customerName: "customerName",
      customerEmail: "customerEmail",
      paidAt: "paidAt",
    };
    const field = sortFieldMap[sortBy] || "createdAt";

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { [field]: sortOrder },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          status: true,
          total: true,
          shippingFee: true,
          discountAmount: true,
          subtotal: true,
          createdAt: true,
          paidAt: true,
          shippedAt: true,
          deliveryStatus: true,
          trackingNumber: true,
          shippingCompany: true,
          items: { select: { id: true, quantity: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders: orders.map((o) => ({
        ...o,
        total: Number(o.total),
        subtotal: o.subtotal ? Number(o.subtotal) : null,
        shippingFee: o.shippingFee ? Number(o.shippingFee) : null,
        discountAmount: o.discountAmount ? Number(o.discountAmount) : null,
        itemCount: o.items.length,
        items: undefined,
      })),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("Orders list error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}