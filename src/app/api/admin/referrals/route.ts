import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const limit = 20; const skip = (page - 1) * limit;
  const [referrals, total] = await Promise.all([
    prisma.referral.findMany({ orderBy: { createdAt: "desc" }, take: limit, skip, include: { order: { select: { orderNumber: true, status: true, total: true } } } }),
    prisma.referral.count(),
  ]);
  return NextResponse.json({ referrals, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}