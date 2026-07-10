import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ERROR_CODES = {
  NOT_FOUND: { reason: "COUPON_NOT_FOUND", message: "Coupon code not found." },
  EXPIRED: { reason: "COUPON_EXPIRED", message: "This coupon has expired." },
  NOT_ACTIVE: { reason: "COUPON_INACTIVE", message: "This coupon is not active." },
  NOT_STARTED: { reason: "COUPON_NOT_STARTED", message: "This coupon is not yet valid." },
  USAGE_LIMIT: { reason: "COUPON_USAGE_LIMIT", message: "This coupon has reached its usage limit." },
  USER_LIMIT: { reason: "ALREADY_USED", message: "You have already used this coupon." },
  MIN_ORDER: { reason: "MIN_ORDER_NOT_MET", message: "Your order total does not meet the minimum requirement." },
  PRODUCT_ELIGIBILITY: { reason: "PRODUCT_NOT_ELIGIBLE", message: "Some items in your cart are not eligible for this coupon." },
  FIRST_TIME: { reason: "FIRST_TIME_ONLY", message: "This coupon is for first-time customers only." },
  MIN_QTY: { reason: "MIN_QUANTITY_NOT_MET", message: "Your cart does not meet the minimum quantity requirement." },
};

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal, items, customerEmail } = await req.json();
    if (!code) return NextResponse.json({ valid: false, ...ERROR_CODES.NOT_FOUND }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon) return NextResponse.json({ valid: false, ...ERROR_CODES.NOT_FOUND }, { status: 400 });
    if (!coupon.isActive) return NextResponse.json({ valid: false, ...ERROR_CODES.NOT_ACTIVE }, { status: 400 });
    if (coupon.status === "DISABLED" || coupon.status === "EXPIRED") return NextResponse.json({ valid: false, ...ERROR_CODES.NOT_ACTIVE }, { status: 400 });
    if (coupon.status === "DRAFT") return NextResponse.json({ valid: false, reason: "COUPON_DRAFT", message: "This coupon is not yet available." }, { status: 400 });

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) return NextResponse.json({ valid: false, ...ERROR_CODES.NOT_STARTED }, { status: 400 });
    if (coupon.expiresAt && coupon.expiresAt < now) return NextResponse.json({ valid: false, ...ERROR_CODES.EXPIRED }, { status: 400 });

    if (coupon.usageLimit && coupon.currentUses >= coupon.usageLimit) return NextResponse.json({ valid: false, ...ERROR_CODES.USAGE_LIMIT }, { status: 400 });

    if (coupon.usagePerUser && customerEmail) {
      const userUses = await prisma.couponUsage.count({ where: { couponId: coupon.id, customerEmail } });
      if (userUses >= coupon.usagePerUser) return NextResponse.json({ valid: false, ...ERROR_CODES.USER_LIMIT }, { status: 400 });
    }

    if (coupon.minOrderAmount && Number(cartTotal) < Number(coupon.minOrderAmount)) return NextResponse.json({ valid: false, ...ERROR_CODES.MIN_ORDER }, { status: 400 });

    if (coupon.minQuantity && items) {
      const totalQty = items.reduce((s: number, i: any) => s + (i.quantity || 0), 0);
      if (totalQty < coupon.minQuantity) return NextResponse.json({ valid: false, ...ERROR_CODES.MIN_QTY }, { status: 400 });
    }

    if (coupon.firstTimeOnly && customerEmail) {
      const orderCount = await prisma.order.count({ where: { customerEmail } });
      if (orderCount > 0) return NextResponse.json({ valid: false, ...ERROR_CODES.FIRST_TIME }, { status: 400 });
    }

    if (coupon.applicableProducts && coupon.applicableProducts.length > 0 && items) {
      const allEligible = items.every((i: any) => coupon.applicableProducts.includes(i.id));
      if (!allEligible) return NextResponse.json({ valid: false, ...ERROR_CODES.PRODUCT_ELIGIBILITY }, { status: 400 });
    }

    const total = Number(cartTotal);
    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.min(total * (Number(coupon.value) / 100), coupon.maxDiscount ? Number(coupon.maxDiscount) : total);
    } else if (coupon.type === "FIXED") {
      discountAmount = Math.min(Number(coupon.value), total);
    } else if (coupon.type === "FREE_SHIPPING") {
      discountAmount = 0;
    }
    discountAmount = Math.round(discountAmount * 100) / 100;

    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      type: coupon.type,
      value: Number(coupon.value),
      discountAmount,
      finalTotal: Math.round((total - discountAmount) * 100) / 100,
      description: coupon.description,
    });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}