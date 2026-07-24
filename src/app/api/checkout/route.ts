import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_PRODUCTS } from "@/lib/products";
import { randomUUID } from "crypto";
import { isShippingCountrySupported, getCountryByCode } from "@/config/shipping-countries";
import { SHIPPING_CONFIG } from "@/lib/business-info";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
const { items, customerEmail, customerName, customerPhone, shippingAddress, couponCode, discountAmount, salesRepCode } = body;
    // Validate shipping address fields
    if (!shippingAddress || typeof shippingAddress !== "object") {
      return NextResponse.json({ success: false, error: "Shipping address is required" }, { status: 400 });
    }
    const { firstName, lastName, phone, country, state, city, address1, address2, postalCode } = shippingAddress;
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ success: false, error: "First name and last name are required" }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }
    // Country validation against shipping white list
    if (!country?.trim()) {
      return NextResponse.json({ success: false, error: "Country is required" }, { status: 400 });
    }
    const normalizedCountry = country.trim().toUpperCase();
    if (!isShippingCountrySupported(normalizedCountry)) {
      return NextResponse.json({ success: false, error: "Shipping is not available for the selected destination." }, { status: 400 });
    }
    const countryConfig = getCountryByCode(normalizedCountry);
    // Conditionally required: state/province
    if (countryConfig?.requiresRegion && !state?.trim()) {
      return NextResponse.json({ success: false, error: "State/Province is required for this destination" }, { status: 400 });
    }
    if (!city?.trim()) {
      return NextResponse.json({ success: false, error: "City is required" }, { status: 400 });
    }
    if (!address1?.trim()) {
      return NextResponse.json({ success: false, error: "Address line 1 is required" }, { status: 400 });
    }
    // Conditionally required: postal code
    if (countryConfig?.requiresPostalCode && !postalCode?.trim()) {
      return NextResponse.json({ success: false, error: "ZIP/Postal code is required for this destination" }, { status: 400 });
    }

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

    const shippingFee = subtotal >= SHIPPING_CONFIG.freeThreshold ? 0 : SHIPPING_CONFIG.flatRate;
    const shippingMethod = shippingFee === 0 ? "FREE SHIPPING" : "STANDARD SHIPPING";
    const tax = 0;
    const discount = Math.min(Math.max(0, Number(discountAmount || 0)), subtotal);
    const total = Math.max(0, subtotal + shippingFee + tax - discount);

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

    // Check for sales rep referral cookie
    let salesCode: string | undefined;
    let salesRepId: string | null = null;
    if (salesRepCode) {
      salesCode = salesRepCode;
      try {
        const rep = await prisma.salesRep.findUnique({ where: { salesCode: salesCode as string } });
        if (rep) salesRepId = rep.id;
      } catch (_) { /* ignore */ }
    }

    // Create or find customer
    let customerId: string | null = null;
    try {
      let customer = await prisma.customer.findUnique({ where: { email: customerEmail } });
      if (customer) {
        await prisma.customer.update({
          where: { id: customer.id },
          data: { totalOrders: { increment: 1 }, totalSpent: { increment: total }, lastOrderAt: new Date(), lastVisitAt: new Date() },
        });
        customerId = customer.id;
      } else {
      customer = await prisma.customer.create({
          data: { email: customerEmail, firstName, lastName, totalOrders: 1, totalSpent: total, firstOrderAt: new Date(), lastOrderAt: new Date(), lastVisitAt: new Date() },
        });
        customerId = customer.id;
      }
    } catch (err) {
      console.warn("Customer sync failed (non-blocking):", err);
    }

    // Create order
    let orderId = "";
    try {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          status: "PENDING_PAYMENT",
          customerId,
          customerEmail,
          customerName: customerName ?? null,
          customerPhone: customerPhone ?? null,
          salesCode,
          salesRepId,
          couponCode: couponCode || null,
          discountAmount: discount > 0 ? discount : null,
          subtotal,
          shippingFee,
          shippingMethod,
          tax,
          total,
          currency: "USD",
          shippingName: `${firstName} ${lastName}`,
          shippingFirstName: firstName,
          shippingLastName: lastName,
          shippingPhone: phone,
          shippingAddress1: address1,
          shippingAddress2: address2 || null,
          shippingCity: city,
          shippingProvince: state,
          shippingPostal: postalCode,
          shippingCountry: normalizedCountry,
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

      // Create payment record (XTransfer, manual confirmation)
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "XTRANSFER",
          amount: total,
          currency: "USD",
          status: "PENDING",
        },
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
