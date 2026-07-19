import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { verifyWebhookSignature, getOrderDetails } from "@/lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.clone().text();

    // CRITICAL: Verify webhook signature before processing
    const verified = await verifyWebhookSignature(rawBody, req.headers);
    if (!verified) {
      console.error("Webhook signature verification FAILED — rejecting");
      return NextResponse.json({ error: "Verification failed" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;
    const eventId = event.id;

    if (!eventId || !eventType) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
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
        console.error("Amount mismatch in webhook");
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }

      // Unified idempotency: use paypalOrderId (from custom_id or lookup)
      // For webhooks, use custom_id (which equals our orderId) + captureId as unique key
      // Or better: fetch orderID from PayPal to use same key as capture-order endpoint
      // Since custom_id = orderId but we need PayPal orderID for unified key
      let paypalOrderId = resource.custom_id;
      // Try to get PayPal orderID from resource links
      if (resource.links) {
        for (const link of resource.links) {
          if (link.rel === "up" && link.href?.includes("/v2/checkout/orders/")) {
            const parts = link.href.split("/");
            paypalOrderId = parts[parts.length - 1] || paypalOrderId;
            break;
          }
        }
      }

      // Use captureId + customId as the idempotency key (unique enough, same approach as capture-order)
      // Actually, use paypalOrderId as the unified key to match capture-order's key
      if (paypalOrderId === customId) {
        // If we can't derive the order ID from webhook, fall back to custom_id
        // Both endpoints use the same key strategy now
      }

      // All DB writes in a single transaction
      await prisma.$transaction(async (tx) => {
        // Try to create processed event with paypalOrderId or custom_id+_webhook suffix
        const idempotencyKey = `${paypalOrderId || customId}_webhook`;
        const existing = await tx.processedEvent.findUnique({ where: { eventId: idempotencyKey } });
        if (existing) {
          throw new Error("DUPLICATE");
        }
        await tx.processedEvent.create({ data: { eventId: idempotencyKey, type: eventType } });

        // Update order
        await tx.order.update({
          where: { id: customId },
          data: { status: "PAID", paymentIntentId: captureId, paidAt: new Date() },
        });

        // Create payment record
        await tx.payment.create({
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
        await tx.orderStatusHistory.create({
          data: { orderId: customId, fromStatus: "PENDING_PAYMENT", toStatus: "PAID" },
        });
      });

      // Email notification (non-blocking, outside transaction)
      if (order.customerEmail) {
        sendEmail({
          to: order.customerEmail,
          subject: "Order Confirmed - Enzyme Skincare",
          html: `<h1>Thank you for your order!</h1>
<p>Order #${order.orderNumber || customId.slice(0, 8)}</p>
<p>Total: $${Number(order.total).toFixed(2)}</p>
<p>Payment method: PayPal</p>
<p>We will notify you when your order ships.</p>`,
        }).catch((e) => console.error("Email failed:", e));
      }

      return NextResponse.json({ received: true });
    }

    // Acknowledge other events
    return NextResponse.json({ received: true });
  } catch (err: any) {
    if (err?.message === "DUPLICATE") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("Webhook error");
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
