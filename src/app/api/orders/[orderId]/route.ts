import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.pathname.split("/").pop();
    const token = url.searchParams.get("token");

    if (!orderId || !token) {
      return NextResponse.json({ error: "Missing order ID or token" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: { orderBy: { createdAt: "desc" } },
        auditLogs: { orderBy: { createdAt: "desc" } },
        trackingEvents: { orderBy: { timestamp: "asc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const metadata = order.metadata as any;
    if (!metadata?.accessToken || metadata.accessToken !== token) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      subtotal: order.subtotal ? Number(order.subtotal) : null,
      shippingFee: order.shippingFee ? Number(order.shippingFee) : null,
      discountAmount: order.discountAmount ? Number(order.discountAmount) : null,
      currency: order.currency ?? "USD",
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      couponCode: order.couponCode,
      salesCode: order.salesCode,
      items: order.items.map((i) => ({
        productName: i.productName ?? "Product",
        productImage: i.productImage,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice ?? i.price),
      })),
      shippingAddress: {
        firstName: order.shippingFirstName,
        lastName: order.shippingLastName,
        name: order.shippingName,
        phone: order.shippingPhone,
        address1: order.shippingAddress1,
        address2: order.shippingAddress2,
        city: order.shippingCity,
        province: order.shippingProvince,
        state: order.shippingProvince,
        postal: order.shippingPostal,
        postalCode: order.shippingPostal,
        country: order.shippingCountry,
      },
      trackingNumber: order.trackingNumber,
      shippingCompany: order.shippingCompany,
      deliveryStatus: order.deliveryStatus,
      trackingEvents: order.trackingEvents.map((e) => ({
        id: e.id,
        status: e.status,
        location: e.location,
        description: e.description,
        trackingNumber: e.trackingNumber,
        shippingCompany: e.shippingCompany,
        timestamp: e.timestamp,
      })),
      payment: order.payments.length > 0 ? {
        provider: order.payments[0].provider,
        status: order.payments[0].status,
        invoiceUrl: order.payments[0].invoiceUrl,
      } : null,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Order query error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
