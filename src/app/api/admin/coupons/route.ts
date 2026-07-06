import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Number(url.searchParams.get("limit")) || 20);
    const isActive = url.searchParams.get("isActive");
    const where: any = {};
    if (isActive === "true") where.isActive = true;
    else if (isActive === "false") where.isActive = false;

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip: (page - 1) * limit }),
      prisma.coupon.count({ where }),
    ]);
    return NextResponse.json({ coupons, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.type || body.value === undefined) {
      return NextResponse.json({ error: "code, type, and value are required" }, { status: 400 });
    }
    const coupon = await prisma.coupon.create({ data: { code: body.code.toUpperCase(), type: body.type, value: body.value, ...body } });
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}