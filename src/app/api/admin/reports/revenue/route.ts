import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const days = Number(req.nextUrl.searchParams.get("days")) || 30;
  const since = new Date(Date.now() - days * 86400000);
  const orders = await prisma.order.findMany({ where: { createdAt: { gte: since }, status: { not: "CANCELLED" } }, select: { total: true, createdAt: true } });
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  return NextResponse.json({ revenue: { total: totalRevenue, orders: orders.length, period: days + "d" } });
}