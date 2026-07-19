import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { getPayPalAccessToken, getOrderDetails, isPayPalConfigured } from "@/lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paypalOrderId, token } = await req.json();
    if (!orderId || !paypalOrderId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
    }

    // Verify order and token (read-only check before transaction)
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "Order already processed" }, { status: 400 });
    }
    const meta = order.metadata as Record<string, unknown> | null;
    if (!meta || meta.accessToken !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Capture via PayPal API
    const env = process.env.PAYPAL_ENVIRONMENT || "sandbox";
    const baseUrl = env === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

    const accessTokenPayPal = await getPayPalAccessToken();

    const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessTokenPayPal}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      console.error("PayPal capture failed");
      return NextResponse.json({ error: "Capture failed" }, { status: 500 });
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
      console.error("Amount mismatch", { captured: capturedAmount });
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Use paypalOrderId as unified idempotency key (same key used by capture-order and webhook)
    // All DB writes in a single transaction
    await prisma.$transaction(async (tx) => {
      // Lock: try to create processed event first
      const existing = await tx.processedEvent.findUnique({ where: { eventId: paypalOrderId } });
      if (existing) {
        throw new Error("DUPLICATE");
      }
      await tx.processedEvent.create({ data: { eventId: paypalOrderId, type: "paypal_capture" } });

      // Update order
      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID", paymentIntentId: capture.id, paidAt: new Date() },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          orderId,
          provider: "PayPal",
          providerMetadata: { paypalOrderId, captureId: capture.id, status: capture.status, createTime: capture.create_time },
          amount: capturedAmount,
          currency: "USD",
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Record status history
      await tx.orderStatusHistory.create({
        data: { orderId, fromStatus: "PENDING_PAYMENT", toStatus: "PAID" },
      });
    });

    // Send confirmation email (non-blocking, outside transaction)
    const customerEmail = order.customerEmail;
    if (customerEmail) {
      sendEmail({
        to: customerEmail,
        subject: "Order Confirmed - Enzyme Skincare",
        html: `<h1>Thank you for your order!</h1>
<p>Order #${order.orderNumber || orderId.slice(0, 8)}</p>
<p>Total: $${Number(order.total).toFixed(2)}</p>
<p>Payment method: PayPal</p>
<p>We will notify you when your order ships.</p>`,
      }).catch((e) => console.error("Email failed (non-blocking):", e));
    }

    return NextResponse.json({ success: true, captureId: capture.id });
  } catch (err: any) {
    if (err?.message === "DUPLICATE") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("capture-order error");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
