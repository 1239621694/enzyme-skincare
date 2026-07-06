import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
  const referrals = await prisma.referral.findMany({ where: { referrerEmail: email }, orderBy: { createdAt: "desc" } });
  const total = referrals.length;
  const conversions = referrals.filter(r => r.status === "PAID").length;
  const pendingCommission = referrals.filter(r => r.status === "PAID" && !r.commissionPaid).reduce((s, r) => s + Number(r.commissionAmount || 0), 0);
  const paidCommission = referrals.filter(r => r.commissionPaid).reduce((s, r) => s + Number(r.commissionAmount || 0), 0);
  return NextResponse.json({ stats: { total, conversions, conversionRate: total ? Math.round(conversions/total*100) : 0, pendingCommission, paidCommission }, recent: referrals.slice(0, 20) });
}