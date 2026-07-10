import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const id = req.url.split("/coupons/")[1]?.split("/")[0];
    const coupon = await prisma.coupon.findUnique({ where: { id }, include: { _count: { select: { usages: true } } } });
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Get usage stats
    const usages = await prisma.couponUsage.findMany({
      where: { couponId: id },
      include: { order: { select: { total: true, createdAt: true } } },
      orderBy: { usedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      ...coupon,
      value: Number(coupon.value),
      minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
      totalUses: usages.length,
      totalRevenue: usages.reduce((sum, u) => sum + Number(u.order?.total || 0), 0),
      totalDiscount: usages.reduce((sum, u) => sum + Number(u.discountAmount), 0),
      usages: usages.map((u) => ({
        id: u.id,
        customerEmail: u.customerEmail,
        discountAmount: Number(u.discountAmount),
        orderTotal: Number(u.order?.total || 0),
        usedAt: u.usedAt,
      })),
    });
  } catch (e) {
    console.error("Coupon stats error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.url.split("/coupons/")[1]?.split("/")[0];
    const body = await req.json();
    if (body.code) body.code = body.code.toUpperCase();
    const coupon = await prisma.coupon.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, coupon });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.url.split("/coupons/")[1]?.split("/")[0];
    await prisma.coupon.update({ where: { id }, data: { isActive: false, status: "DISABLED" } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
