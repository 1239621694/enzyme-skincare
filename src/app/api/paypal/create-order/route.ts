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
      return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
    }

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

    // Create PayPal order
    const env = process.env.PAYPAL_ENVIRONMENT || "sandbox";
    const baseUrl = env === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

    const accessTokenPayPal = await getPayPalAccessToken();
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessTokenPayPal}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId,
            description: `Order ${order.orderNumber || orderId.slice(0, 8)}`,
            amount: {
              currency_code: order.currency || "USD",
              value: Number(order.total).toFixed(2),
            },
            custom_id: orderId,
          },
        ],
        application_context: {
          brand_name: "Enzyme Skincare",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
        },
      }),
    });

    if (!orderRes.ok) {
      const errBody = await orderRes.text();
      console.error("PayPal order creation failed");
      return NextResponse.json({ error: "PayPal order creation failed" }, { status: 500 });
    }

    const paypalOrder = await orderRes.json();
    return NextResponse.json({ id: paypalOrder.id });
  } catch (err) {
    console.error("create-order error");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
