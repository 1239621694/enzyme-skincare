import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.clone().text();
    const sig = request.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

    let event;
    try {
      event = getStripe().webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // C1: Try ProcessedEvent insert FIRST as distributed lock (unique constraint on eventId)
    // If event was already processed, P2002 is thrown and we return early
    try {
      await prisma.processedEvent.create({ data: { eventId: event.id, type: event.type } });
    } catch (err: any) {
      if (err?.code === "P2002" || (err?.message && err.message.includes("Unique constraint"))) {
        return NextResponse.json({ received: true, duplicate: true });
      }
      throw err;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const paymentIntentId = (session.payment_intent as string) ?? null;

        if (!paymentIntentId && session.payment_status === "paid") {
          console.warn("Payment confirmed without payment_intent:", session.id);
        }

        // Handle async payment methods
        if (session.payment_status === "unpaid") {
          console.log("Async payment, waiting for payment_intent.succeeded:", session.id);
          break;
        }

        // Find order
        const order = await prisma.order.findFirst({ where: { stripeSessionId: session.id } });
        if (!order) {
          console.error("No order found for session:", session.id);
          break;
        }

        // C3: Parse items from session metadata
        const lineItems: any[] = session.metadata?.items ? JSON.parse(session.metadata.items) : [];

        // Stock already deducted at checkout creation (C5)

        // M1: Safe access to shipping details
        const shipping = session.shipping_details;
        const shippingAddress = shipping ? {
          name: shipping.name ?? null,
          line1: shipping.address?.line1 ?? null,
          line2: shipping.address?.line2 ?? null,
          city: shipping.address?.city ?? null,
          state: shipping.address?.state ?? null,
          postal_code: shipping.address?.postal_code ?? null,
          country: shipping.address?.country ?? null,
        } : {};

        // Update order to paid
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            paymentIntentId: paymentIntentId,
            email: session.customer_details?.email ?? order.email,
            shippingAddress: shippingAddress,
          },
        });

        // Record status history
        await prisma.orderStatusHistory.create({
          data: { orderId: order.id, fromStatus: "PENDING_PAYMENT", toStatus: "PAID" },
        });

        // Send confirmation email (non-blocking)
        const customerEmail = session.customer_details?.email ?? order.email;
        if (customerEmail) {
          sendEmail({
            to: customerEmail,
            subject: "Order Confirmed - Enzyme Skincare",
            html: `<h1>Thank you for your order!</h1><p>Order #${order.orderNumber || order.id.slice(0, 8)}</p><p>Total: $${Number(order.total).toFixed(2)}</p><p>We will notify you when your order ships.</p>`,
          }).catch((e: any) => console.error("Email failed (non-blocking):", e));
        }

        console.log("Order completed:", order.id);
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as any;
        const order = await prisma.order.findFirst({ where: { paymentIntentId: pi.id } });
        if (order && order.status === "PENDING_PAYMENT") {
          await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
          await prisma.orderStatusHistory.create({
            data: { orderId: order.id, fromStatus: "PENDING_PAYMENT", toStatus: "PAID" },
          });
        }
        break;
      }

      // M4: Handle payment_intent.processing (async payment methods like Klarna)
      case "payment_intent.processing": {
        const pi = event.data.object as any;
        await prisma.orderStatusHistory.create({
          data: { orderId: pi.id, fromStatus: "PENDING_PAYMENT", toStatus: "PROCESSING", note: "Payment processing (async)" },
        });
        console.log("Payment processing (async):", pi.id);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as any;
        const order = await prisma.order.findFirst({ where: { stripeSessionId: session.id } });
        if (order && order.status === "PENDING_PAYMENT") {
          // C5: Restore stock that was deducted at checkout creation
          const lineItems: any[] = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
          for (const item of lineItems) {
            if (item.variantId) {
              await prisma.productVariant.updateMany({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
              });
            }
          }
          await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
          await prisma.orderStatusHistory.create({
            data: { orderId: order.id, fromStatus: "PENDING_PAYMENT", toStatus: "CANCELLED", note: "Session expired - stock restored" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}