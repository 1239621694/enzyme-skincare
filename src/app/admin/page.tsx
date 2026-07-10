"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  today: { orders: number; revenue: number };
  total: { orders: number; revenue: number };
  pendingPayment: number;
  pendingShipment: number;
  completedOrders: number;
  newCustomers: number;
  returningCustomers: number;
  couponUsage: number;
  topProducts: Array<{ name: string; quantity: number }>;
  topSalesReps: Array<{ name: string; code: string; orders: number; revenue: number }>;
  revenueTrend: Array<{ date: string; revenue: number }>;
  recentOrders: Array<{ id: string; orderNumber: string | null; customerName: string | null; status: string; total: number; createdAt: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  PAID: "bg-green-100 text-green-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-neutral-100 text-neutral-600",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const d = await res.json();
        if (!d.error) setData(d);
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-12 text-neutral-400">Loading Dashboard...</div>;
  if (!data) return <div className="text-center py-12">Failed to load dashboard</div>;

  const maxRevenue = Math.max(...data.revenueTrend.map((r) => r.revenue), 1);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Today Orders</p>
          <p className="mt-1 text-3xl font-bold">{data.today.orders}</p>
          <p className="text-xs text-neutral-400 mt-1">${data.today.revenue.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Pending Payment</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{data.pendingPayment}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Pending Shipment</p>
          <p className="mt-1 text-3xl font-bold text-purple-600">{data.pendingShipment}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Completed</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{data.completedOrders}</p>
        </div>
      </div>

      {/* Revenue Trend & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-xl border bg-white p-6">
          <h2 className="font-semibold mb-4">Revenue (7 Days)</h2>
          <div className="flex items-end gap-2 h-32">
            {data.revenueTrend.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-neutral-400">${d.revenue.toFixed(0)}</span>
                <div className="w-full bg-primary-500 rounded-t" style={{ height: Math.max(4, (d.revenue / maxRevenue) * 100) + "%" }} />
                <span className="text-xs text-neutral-400">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold mb-4">Summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-neutral-500">Total Orders</dt><dd className="font-semibold">{data.total.orders}</dd></div>
            <div className="flex justify-between"><dt className="text-neutral-500">Total Revenue</dt><dd className="font-semibold">${data.total.revenue.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-neutral-500">New Customers</dt><dd className="font-semibold">{data.newCustomers}</dd></div>
            <div className="flex justify-between"><dt className="text-neutral-500">Returning</dt><dd className="font-semibold">{data.returningCustomers}</dd></div>
            <div className="flex justify-between"><dt className="text-neutral-500">Coupon Uses</dt><dd className="font-semibold">{data.couponUsage}</dd></div>
          </dl>
        </div>
      </div>

      {/* Top Products & Sales Reps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold mb-4">Top Products</h2>
          {data.topProducts.length === 0 ? <p className="text-sm text-neutral-400">No data yet</p> : (
            <div className="space-y-3">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 text-xs flex items-center justify-center font-medium">{i + 1}</span>
                    <span className="text-sm">{p.name}</span>
                  </div>
                  <span className="text-sm font-medium">{p.quantity} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold mb-4">Top Sales Reps</h2>
          {data.topSalesReps.length === 0 ? <p className="text-sm text-neutral-400">No data yet</p> : (
            <div className="space-y-3">
              {data.topSalesReps.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 text-xs flex items-center justify-center font-medium">{i + 1}</span>
                    <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-neutral-400">{s.code}</p></div>
                  </div>
                  <div className="text-right"><p className="text-sm font-medium">${s.revenue.toFixed(2)}</p><p className="text-xs text-neutral-400">{s.orders} orders</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary-600 hover:underline">View All</Link>
        </div>
        {data.recentOrders.length === 0 ? <p className="text-sm text-neutral-400">No orders yet</p> : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left">
              <tr><th className="p-2 font-medium">Order</th><th className="p-2 font-medium">Customer</th><th className="p-2 font-medium">Status</th><th className="p-2 font-medium text-right">Total</th><th className="p-2 font-medium">Date</th></tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-neutral-100">
                  <td className="p-2"><Link href={"/admin/orders/" + o.id} className="font-mono text-xs text-primary-600 hover:underline">{o.orderNumber || o.id.slice(0, 12)}</Link></td>
                  <td className="p-2">{o.customerName || "—"}</td>
                  <td className="p-2"><span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (STATUS_COLORS[o.status] || "bg-neutral-100")}>{o.status.replace(/_/g, " ")}</span></td>
                  <td className="p-2 font-medium text-right">${o.total.toFixed(2)}</td>
                  <td className="p-2 text-xs text-neutral-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
