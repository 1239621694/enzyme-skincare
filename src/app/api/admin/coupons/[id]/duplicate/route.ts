import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const id = req.url.split("/coupons/")[1]?.split("/")[0];
    const original = await prisma.coupon.findUnique({ where: { id } });
    if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newCode = original.code + "-COPY";
    const coupon = await prisma.coupon.create({
      data: {
        code: newCode,
        name: (original.name || "Copy of " + original.code) + " (Copy)",
        type: original.type,
        value: original.value,
        minOrderAmount: original.minOrderAmount,
        maxDiscount: original.maxDiscount,
        usageLimit: original.usageLimit,
        usagePerUser: original.usagePerUser,
        isActive: false,
        status: "DRAFT",
        description: original.description,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Copy code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to duplicate" }, { status: 500 });
  }
}
