import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const reps = await prisma.salesRep.findMany({ include: { orders: { select: { id: true, total: true, status: true } } } });
  const stats = reps.map(r => ({ name: r.name, code: r.salesCode, orderCount: r.orders.length, revenue: r.orders.reduce((s, o) => s + Number(o.total), 0), isActive: r.isActive }));
  return NextResponse.json({ stats });
}