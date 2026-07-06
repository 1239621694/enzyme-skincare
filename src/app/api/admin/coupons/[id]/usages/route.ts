import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const id = req.url.split("/coupons/")[1]?.split("/")[0];
    const usages = await prisma.couponUsage.findMany({
      where: { couponId: id },
      orderBy: { usedAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ usages });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}