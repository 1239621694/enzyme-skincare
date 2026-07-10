import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      todayOrders,
      todayRevenue,
      totalOrders,
      totalRevenue,
      pendingPayment,
      pendingShipment,
      completedOrders,
      monthOrders,
      newCustomers,
      couponUsage,
      topProducts,
      topSales,
      revenueTrend,
      recentOrders,
    ] = await Promise.all([
      // Today's order count
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      // Today's revenue
      prisma.order.aggregate({ where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } }, _sum: { total: true } }),
      // Total orders
      prisma.order.count(),
      // Total revenue
      prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } }),
      // Pending payment
      prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
      // Pending shipment
      prisma.order.count({ where: { status: "PAID" } }),
      // Completed (delivered) orders
      prisma.order.count({ where: { status: "DELIVERED" } }),
      // This month orders
      prisma.order.count({ where: { createdAt: { gte: monthAgo } } }),
      // New customers (this month)
      prisma.customer.count({ where: { createdAt: { gte: monthAgo } } }).catch(() => 0),
      // Coupon usage this month
      prisma.couponUsage.count({ where: { usedAt: { gte: monthAgo } } }).catch(() => 0),
      // Top products by order items
      prisma.orderItem.groupBy({
        by: ["productName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      // Top sales reps
      prisma.salesRep.findMany({
        where: { isActive: true },
        include: { orders: { select: { total: true, status: true } } },
        take: 5,
      }).catch(() => []),
      // Revenue trend (last 7 days)
      prisma.order.groupBy({
        by: ["createdAt"],
        where: { createdAt: { gte: weekAgo }, status: { not: "CANCELLED" } },
        _sum: { total: true },
        orderBy: { createdAt: "asc" },
      }),
      // Recent orders
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, orderNumber: true, customerName: true, status: true, total: true, createdAt: true },
      }),
    ]);

    // Build daily revenue trend
    const dailyRevenue: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
      dailyRevenue[d.toISOString().slice(0, 10)] = 0;
    }
    for (const r of revenueTrend) {
      const dateKey = new Date(r.createdAt).toISOString().slice(0, 10);
      if (dailyRevenue[dateKey] !== undefined) {
        dailyRevenue[dateKey] += Number(r._sum.total || 0);
      }
    }

    const returningCustomers = Math.max(0, (monthOrders - newCustomers));

    return NextResponse.json({
      today: {
        orders: todayOrders,
        revenue: Number(todayRevenue._sum.total || 0),
      },
      total: {
        orders: totalOrders,
        revenue: Number(totalRevenue._sum.total || 0),
      },
      pendingPayment,
      pendingShipment,
      completedOrders,
      newCustomers,
      returningCustomers,
      couponUsage,
      topProducts: topProducts.map((p) => ({
        name: p.productName || "Unknown",
        quantity: p._sum.quantity || 0,
      })),
      topSalesReps: topSales.map((s: any) => {
        const completed = s.orders.filter((o: any) => o.status !== "CANCELLED");
        return {
          name: s.name,
          code: s.salesCode,
          orders: s.orders.length,
          revenue: completed.reduce((sum: number, o: any) => sum + Number(o.total), 0),
        };
      }),
      revenueTrend: Object.entries(dailyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({ date, revenue })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        status: o.status,
        total: Number(o.total),
        createdAt: o.createdAt,
      })),
    });
  } catch (e) {
    console.error("Dashboard error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
