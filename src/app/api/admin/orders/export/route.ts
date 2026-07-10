import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const ids = url.searchParams.get("ids") || "";
    const status = url.searchParams.get("status") || "";

    const where: any = {};

    // Export specific orders by IDs
    if (ids) {
      const idArray = ids.split(",").filter(Boolean);
      if (idArray.length > 0) where.id = { in: idArray };
    }

    // Or filter by status
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    // Generate CSV
    const headers = [
      "Order Number", "Status", "Customer Name", "Customer Email", "Customer Phone",
      "Shipping Name", "Shipping Address", "Shipping City", "Shipping Province",
      "Shipping Postal", "Shipping Country",
      "Subtotal", "Shipping Fee", "Discount", "Total", "Currency",
      "Payment Status", "Paid At",
      "Shipping Company", "Tracking Number", "Delivery Status",
      "Coupon Code", "Sales Code",
      "Items Count", "Created At",
    ];

    const rows = orders.map((o: any) => [
      o.orderNumber || "",
      o.status,
      o.customerName || "",
      o.customerEmail || "",
      o.customerPhone || "",
      o.shippingName || "",
      o.shippingAddress1 || "",
      o.shippingCity || "",
      o.shippingProvince || "",
      o.shippingPostal || "",
      o.shippingCountry || "",
      o.subtotal ? Number(o.subtotal).toFixed(2) : "",
      o.shippingFee ? Number(o.shippingFee).toFixed(2) : "",
      o.discountAmount ? Number(o.discountAmount).toFixed(2) : "",
      Number(o.total).toFixed(2),
      o.currency || "USD",
      o.payments?.[0]?.status || "",
      o.paidAt ? new Date(o.paidAt).toISOString() : "",
      o.shippingCompany || "",
      o.trackingNumber || "",
      o.deliveryStatus || "",
      o.couponCode || "",
      o.salesCode || "",
      o.items?.length || 0,
      o.createdAt ? new Date(o.createdAt).toISOString() : "",
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));

    const csv = "﻿" + headers.join(",") + "\n" + rows.join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e) {
    console.error("Export error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
