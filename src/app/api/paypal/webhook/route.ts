import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/paypal/webhook
 * Verifies PayPal webhook events and updates order status.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.clone().text();
    const event = JSON.parse(rawBody);
    const eventType = event.event_type;
    const eventId = event.id;

    if (!eventId || !eventType) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    // Deduplicate using ProcessedEvent
    try {
      await prisma.processedEvent.create({ data: { eventId, type: eventType } });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      throw err;
    }

    if (eventType === "CHECKOUT.ORDER.APPROVED") {
      // Order approved - nothing to do yet, wait for capture
      return NextResponse.json({ received: true });
    }

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource;
      const customId = resource.custom_id;
      const captureId = resource.id;
      const amount = parseFloat(resource.amount?.value || "0");

      if (!customId) {
        return NextResponse.json({ error: "No custom_id" }, { status: 400 });
      }

      const order = await prisma.order.findUnique({ where: { id: customId } });
      if (!order) {
        console.error("Order not found for custom_id:", customId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.status === "PAID") {
        return NextResponse.json({ received: true, duplicate: true });
      }

      // Verify amount
      if (Math.abs(amount - Number(order.total)) > 0.01) {
        console.error("Amount mismatch in webhook", { captured: amount, expected: order.total });
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }

      // Update order
      await prisma.order.update({
        where: { id: customId },
        data: {
          status: "PAID",
          paymentIntentId: captureId,
          paidAt: new Date(),
        },
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          orderId: customId,
          provider: "PayPal",
          providerMetadata: { eventId, captureId, status: "COMPLETED", createTime: resource.create_time },
          amount,
          currency: "USD",
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Status history
      await prisma.orderStatusHistory.create({
        data: { orderId: customId, fromStatus: "PENDING_PAYMENT", toStatus: "PAID" },
      });

      // Email notification
      if (order.customerEmail) {
        sendEmail({
          to: order.customerEmail,
          subject: "Order Confirmed - Enzyme Skincare",
          html: `<h1>Thank you for your order!</h1>
<p>Order #${order.orderNumber || customId.slice(0, 8)}</p>
<p>Total: $${Number(order.total).toFixed(2)}</p>
<p>Payment: PayPal</p>
<p>We will notify you when your order ships.</p>`,
        }).catch((e) => console.error("Email failed:", e));
      }

      return NextResponse.json({ received: true });
    }

    // Acknowledge other events
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
