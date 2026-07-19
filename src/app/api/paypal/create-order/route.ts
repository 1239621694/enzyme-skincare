import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayPalAccessToken, isPayPalConfigured } from "@/lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { orderId, token } = await req.json();
    if (!orderId || !token) {
      return NextResponse.json({ error: "Missing orderId or token" }, { status: 400 });
    }

    if (!isPayPalConfigured()) {
      console.error("PayPal not configured - missing credentials");
      return NextResponse.json({ error: "PayPal not configured. Check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET" }, { status: 503 });
    }

    // Log environment info (safe)
    const env = process.env.PAYPAL_ENVIRONMENT || "sandbox";
    const hasClientId = !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const hasSecret = !!process.env.PAYPAL_CLIENT_SECRET;
    console.log(`[PayPal] ENV=${env} hasClientId=${hasClientId} hasSecret=${hasSecret}`);

    // Find the order with token verification
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "Order is not pending payment" }, { status: 400 });
    }
    const meta = order.metadata as Record<string, unknown> | null;
    if (!meta || meta.accessToken !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Get PayPal access token
    let accessTokenPayPal: string;
    try {
      accessTokenPayPal = await getPayPalAccessToken();
      console.log("[PayPal] Access token obtained successfully");
    } catch (authErr: any) {
      console.error("[PayPal] Access token failed:", authErr?.message || authErr);
      return NextResponse.json({ error: `PayPal auth failed: ${authErr?.message || "Unknown"}` }, { status: 500 });
    }

    // Build PayPal order request
    const baseUrl = env === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

    const amount = Number(order.total).toFixed(2);
    const currency = order.currency || "USD";
    console.log(`[PayPal] Creating order: amount=${amount} ${currency} orderId=${orderId}`);

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          description: `Order ${order.orderNumber || orderId.slice(0, 8)}`,
          amount: {
            currency_code: currency,
            value: amount,
          },
          custom_id: orderId,
        },
      ],
      application_context: {
        brand_name: "Enzyme Skincare",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    };

    console.log("[PayPal] Request body:", JSON.stringify(orderPayload, null, 2));

    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessTokenPayPal}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const responseBody = await orderRes.text();
    console.log(`[PayPal] Response status: ${orderRes.status}`);
    console.log(`[PayPal] Response body: ${responseBody}`);

    if (!orderRes.ok) {
      console.error(`[PayPal] Order creation FAILED: ${orderRes.status} ${responseBody}`);
      return NextResponse.json({
        error: `PayPal order creation failed: ${orderRes.status} ${responseBody.substring(0, 500)}`
      }, { status: 500 });
    }

    const paypalOrder = JSON.parse(responseBody);
    console.log(`[PayPal] Order created successfully: id=${paypalOrder.id}`);

    return NextResponse.json({ id: paypalOrder.id });
  } catch (err: any) {
    console.error("[PayPal] create-order UNCAUGHT ERROR:", err?.message || err, err?.stack || "");
    return NextResponse.json({
      error: `Internal error: ${err?.message || "Unknown"}`
    }, { status: 500 });
  }
}
