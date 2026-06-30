import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));
    const sortBy = url.searchParams.get("sortBy") === "total" ? "total" : "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: (page - 1) * limit,
        select: { id: true, orderNumber: true, customerName: true, customerEmail: true, status: true, total: true, createdAt: true },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders: orders.map((o) => ({ ...o, total: Number(o.total) })),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}