import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import { ALL_PRODUCTS } from "@/lib/products";

function createCartFingerprint(items: any[]): string {
  const normalized = items.map((i: any) => `${i.id}:${i.variantId ?? "base"}:${i.quantity}`).sort().join("|");
  const sessionKey = Math.random().toString(36).slice(2, 8);
  return createHash("sha256").update(normalized + sessionKey).digest("hex").slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // M7: Items limit validation - max 10 per item, max 50 total
    const totalQty = items.reduce((s: number, i: any) => s + i.quantity, 0);
    if (totalQty > 50) return NextResponse.json({ error: "Maximum 50 items per order" }, { status: 400 });
    for (const item of items) {
      if (item.quantity > 10) return NextResponse.json({ error: "Maximum 10 per item: " + item.name }, { status: 400 });
      if (item.quantity < 1) return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    // Validate products and prices
    for (const item of items) {
      const product = ALL_PRODUCTS.find((p) => p.id === item.id);
      if (!product) return NextResponse.json({ error: "Product not found: " + item.id }, { status: 400 });
      if (product.price !== item.price) return NextResponse.json({ error: "Price mismatch: " + product.name }, { status: 400 });
    }

    // Idempotency check
    const fingerprint = createCartFingerprint(items);
    const existing = await prisma.order.findFirst({
      where: { cartFingerprint: fingerprint, status: { in: ["pending", "paid"] }, createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) } },
      orderBy: { createdAt: "desc" },
    });
    if (existing?.stripeSessionId) {
      try {
        const session = await getStripe().checkout.sessions.retrieve(existing.stripeSessionId);
        if (session.status === "open") return NextResponse.json({ url: session.url });
      } catch {}
    }

    // C5: Atomic stock deduction at checkout creation
    for (const item of items) {
      if (item.variantId) {
        const result = await prisma.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          return NextResponse.json({ error: "Insufficient stock for item: " + item.name }, { status: 409 });
        }
      }
    }

    // M8: Atomic order counter using $transaction
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const { orderNumber } = await prisma.$transaction(async (tx: any) => {
      const counter = await tx.orderCounter.upsert({
        where: { date: today },
        update: { sequence: { increment: 1 } },
        create: { date: today, sequence: 1 },
      });
      return { orderNumber: "ES-" + today + "-" + String(counter.sequence).padStart(4, "0") };
    });

    // Calculate total
    const total = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

    // C4: Dynamic shipping_options based on order total
    const freeThreshold = 50;
    const shippingOptions = total >= freeThreshold
      ? [{ shipping_rate_data: { type: "fixed_amount" as const, fixed_amount: { amount: 0, currency: "usd" }, display_name: "Free Shipping", delivery_estimate: { minimum: { unit: "business_day" as const, value: 5 }, maximum: { unit: "business_day" as const, value: 8 } } } }]
      : [{ shipping_rate_data: { type: "fixed_amount" as const, fixed_amount: { amount: 595, currency: "usd" }, display_name: "Standard Shipping", delivery_estimate: { minimum: { unit: "business_day" as const, value: 3 }, maximum: { unit: "business_day" as const, value: 5 } } } }];

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: email,
      shipping_options: shippingOptions,
      success_url: (req.headers.get("origin") ?? "http://localhost:3000") + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: (req.headers.get("origin") ?? "http://localhost:3000") + "/checkout/cancel",
      shipping_address_collection: { allowed_countries: ["US", "GB"] },
      metadata: {
        orderNumber,
        items: JSON.stringify(items.map((i: any) => ({ id: i.id, variantId: i.variantId, quantity: i.quantity }))),
      },
    });

    // Create order
    await prisma.order.create({
      data: {
        status: "pending",
        total,
        stripeSessionId: session.id,
        orderNumber: orderNumber,
        cartFingerprint: fingerprint,
        email: email ?? null,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}