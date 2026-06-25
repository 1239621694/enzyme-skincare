import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
  const [totalOrders, rev, totalProducts, subs] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.subscriber.count({ where: { isActive: true } }),
  ]);
  return NextResponse.json({ stats: { totalOrders, totalRevenue: rev._sum.total ?? 0, totalProducts, subscribers: subs } });
}