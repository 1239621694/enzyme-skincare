import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));
    const sortBy = url.searchParams.get("sortBy") || "totalSpent";
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    const sortFieldMap: Record<string, string> = {
      totalSpent: "totalSpent",
      totalOrders: "totalOrders",
      email: "email",
      createdAt: "createdAt",
      lastOrderAt: "lastOrderAt",
    };
    const field = sortFieldMap[sortBy] || "totalSpent";

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { [field]: sortOrder },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      customers: customers.map((c) => ({
        ...c,
        totalSpent: Number(c.totalSpent),
        averageOrderValue: c.totalOrders > 0 ? Number(c.totalSpent) / c.totalOrders : 0,
      })),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("Customers list error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
