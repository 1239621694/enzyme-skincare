import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const usages = await prisma.couponUsage.findMany({ include: { coupon: { select: { code: true, type: true, value: true } } } });
  const byCode: any = {};
  usages.forEach(u => { if (!byCode[u.coupon.code]) byCode[u.coupon.code] = { code: u.coupon.code, uses: 0, totalDiscount: 0 }; byCode[u.coupon.code].uses++; byCode[u.coupon.code].totalDiscount += Number(u.discountAmount); });
  return NextResponse.json({ coupons: Object.values(byCode) });
}