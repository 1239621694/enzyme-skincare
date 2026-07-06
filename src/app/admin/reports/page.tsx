export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
export default async function AdminReportsPage() {
  const [totalOrders, totalRevenue, totalCoupons, activeCoupons] = await Promise.all([
    prisma.order.count(), prisma.order.aggregate({ _sum: { total: true } }),
    prisma.coupon.count(), prisma.coupon.count({ where: { isActive: true } }),
  ]);
  return (<div><h1 className="mb-6 font-heading text-2xl font-bold">Reports</h1>
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">Total Orders</p><p className="mt-1 text-2xl font-bold">{totalOrders}</p></div>
      <div className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">Revenue</p><p className="mt-1 text-2xl font-bold">${Number(totalRevenue._sum.total || 0).toFixed(2)}</p></div>
      <div className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">Coupons</p><p className="mt-1 text-2xl font-bold">{totalCoupons}</p></div>
      <div className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">Active Coupons</p><p className="mt-1 text-2xl font-bold">{activeCoupons}</p></div>
    </div></div>);
}