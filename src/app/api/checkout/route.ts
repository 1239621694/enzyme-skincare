import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_PRODUCTS } from "@/lib/products";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerEmail, customerName, customerPhone, shippingAddress } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items provided" }, { status: 400 });
    }
    if (!customerEmail) {
      return NextResponse.json({ success: false, error: "Customer email is required" }, { status: 400 });
    }
    if (items.length > 50) {
      return NextResponse.json({ success: false, error: "Maximum 50 items per order" }, { status: 400 });
    }

    // Lookup products from static data (server-side pricing)
    const orderItems: {
      productId: string; productName: string; productSlug: string; productImage: string;
      variantId: string | null; variantName: string | null; quantity: number; unitPrice: number; subtotal: number;
    }[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = ALL_PRODUCTS.find((p) => p.slug === item.productId || p.id === item.productId);
      if (!product) {
        return NextResponse.json({ success: false, error: "Product not found: " + item.productId }, { status: 400 });
      }

      const qty = Math.min(Math.max(1, item.quantity || 1), 10);
      const price = product.price;
      const lineSubtotal = price * qty;
      subtotal += lineSubtotal;

      const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images[0] ?? "",
        variantId: variant?.id ?? null,
        variantName: variant?.name ?? null,
        quantity: qty,
        unitPrice: price,
        subtotal: lineSubtotal,
      });
    }

    const shippingFee = subtotal >= 50 ? 0 : 5.95;
    const tax = 0;
    const total = subtotal + shippingFee + tax;

    // Generate order number
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let orderNumber = "ORD-" + today + "-0001";
    try {
      const counter = await prisma.orderCounter.upsert({
        where: { date: today },
        update: { sequence: { increment: 1 } },
        create: { date: today, sequence: 1 },
      });
      orderNumber = "ORD-" + today + "-" + String(counter.sequence).padStart(4, "0");
    } catch (dbErr) {
      console.warn("Order counter failed, using fallback:", dbErr);
    }

    // Generate access token
    const accessToken = randomUUID();

    // Create order
    let orderId = "";
    try {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          status: "PENDING_PAYMENT",
          customerEmail,
          customerName: customerName ?? null,
          customerPhone: customerPhone ?? null,
          subtotal,
          shippingFee,
          tax,
          total,
          currency: "USD",
          shippingName: shippingAddress?.name ?? null,
          shippingPhone: shippingAddress?.phone ?? null,
          shippingAddress1: shippingAddress?.address1 ?? null,
          shippingAddress2: shippingAddress?.address2 ?? null,
          shippingCity: shippingAddress?.city ?? null,
          shippingProvince: shippingAddress?.province ?? null,
          shippingPostal: shippingAddress?.postal ?? null,
          shippingCountry: shippingAddress?.country ?? "US",
          metadata: { accessToken },
        },
      });
      orderId = order.id;

      // Create order items
      for (const oi of orderItems) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: oi.productId,
            productName: oi.productName,
            productSlug: oi.productSlug,
            productImage: oi.productImage,
            variantId: oi.variantId,
            variantName: oi.variantName,
            quantity: oi.quantity,
            unitPrice: oi.unitPrice,
            subtotal: oi.subtotal,
            price: oi.unitPrice,
          },
        });
      }

      // Create audit log
      await prisma.orderAuditLog.create({
        data: { orderId: order.id, action: "ORDER_CREATED", metadata: { source: "checkout_api" } },
      });

      // Update counter
      await prisma.orderCounter.upsert({
        where: { date: today },
        update: { sequence: { increment: 1 } },
        create: { date: today, sequence: 1 },
      });
    } catch (dbErr) {
      console.error("Database error during order creation:", dbErr);
      return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      total,
      redirectUrl: "/orders/" + orderId + "?token=" + accessToken,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}