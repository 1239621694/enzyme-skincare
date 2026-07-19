import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/paypal/capture-order
 * Captures a PayPal order after buyer approval.
 * Body: { orderId: string, paypalOrderId: string, token: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId, paypalOrderId, token } = await req.json();
    if (!orderId || !paypalOrderId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify order and token
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "Order already processed" }, { status: 400 });
    }
    const meta = order.metadata as Record<string, unknown> | null;
    if (!meta || meta.accessToken !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Check for duplicate via ProcessedEvent
    const existing = await prisma.processedEvent.findUnique({ where: { eventId: paypalOrderId } });
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Capture via PayPal API
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    const env = process.env.PAYPAL_ENVIRONMENT || "sandbox";
    const baseUrl = env === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

    if (!clientId || !secret) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
    }

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();
    const accessTokenPayPal = tokenData.access_token;

    // Capture the order
    const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessTokenPayPal}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      console.error("PayPal capture failed:", captureData);
      return NextResponse.json({ error: "Capture failed", details: captureData }, { status: 500 });
    }

    // Verify capture status
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed", status: captureData.status }, { status: 400 });
    }

    // Get transaction details
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture) {
      return NextResponse.json({ error: "No capture found" }, { status: 400 });
    }

    // Verify amount
    const capturedAmount = parseFloat(capture.amount?.value || "0");
    if (Math.abs(capturedAmount - Number(order.total)) > 0.01) {
      console.error("Amount mismatch", { captured: capturedAmount, expected: order.total });
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Mark processed to prevent duplicates (before updating order)
    try {
      await prisma.processedEvent.create({ data: { eventId: paypalOrderId, type: "paypal_capture" } });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      throw err;
    }

    // Update order to PAID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paymentIntentId: capture.id,
        paidAt: new Date(),
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId,
        provider: "PayPal",
        providerMetadata: {
          paypalOrderId,
          captureId: capture.id,
          status: capture.status,
          createTime: capture.create_time,
        },
        amount: capturedAmount,
        currency: "USD",
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Record status history
    await prisma.orderStatusHistory.create({
      data: { orderId, fromStatus: "PENDING_PAYMENT", toStatus: "PAID" },
    });

    // Send confirmation email (non-blocking)
    const customerEmail = order.customerEmail;
    if (customerEmail) {
      sendEmail({
        to: customerEmail,
        subject: "Order Confirmed - Enzyme Skincare",
        html: `<h1>Thank you for your order!</h1>
<p>Order #${order.orderNumber || orderId.slice(0, 8)}</p>
<p>Total: $${Number(order.total).toFixed(2)}</p>
<p>Payment: PayPal (${capture.id})</p>
<p>We will notify you when your order ships.</p>`,
      }).catch((e) => console.error("Email failed (non-blocking):", e));
    }

    return NextResponse.json({ success: true, captureId: capture.id });
  } catch (err) {
    console.error("capture-order error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
