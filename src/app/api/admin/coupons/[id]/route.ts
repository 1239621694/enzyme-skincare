import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const id = req.url.split("/coupons/")[1]?.split("/")[0];
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(coupon);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.url.split("/coupons/")[1]?.split("/")[0];
    const body = await req.json();
    if (body.code) body.code = body.code.toUpperCase();
    const coupon = await prisma.coupon.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, coupon });
  } catch { return NextResponse.json({ error: "Failed to update" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.url.split("/coupons/")[1]?.split("/")[0];
    await prisma.coupon.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}