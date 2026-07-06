import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const total = await prisma.referral.count();
  const conversions = await prisma.referral.count({ where: { status: { in: ["ORDERED", "PAID", "COMMISSIONED"] } } });
  const commissionDue = await prisma.referral.aggregate({ where: { status: "PAID", commissionPaid: false }, _sum: { commissionAmount: true } });
  return NextResponse.json({ stats: { total, conversions, conversionRate: total ? Math.round(conversions/total*100) : 0, commissionDue: commissionDue._sum.commissionAmount || 0 } });
}