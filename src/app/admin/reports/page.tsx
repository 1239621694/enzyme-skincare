export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { t } from "@/lib/admin-i18n";

export default async function AdminReportsPage() {
  let totalOrders = 0, totalRevenue = 0, totalCoupons = 0, activeCoupons = 0;
  try {
    [totalOrders, totalRevenue, totalCoupons, activeCoupons] = await Promise.all([
      prisma.order.count(), prisma.order.aggregate({ _sum: { total: true } }).then(r => Number(r._sum.total || 0)),
      prisma.coupon.count(), prisma.coupon.count({ where: { isActive: true } }),
    ]);
  } catch (e) {
    console.error("Failed to load reports:", e);
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">{t("Reports")}</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">{t("Total Orders")}</p><p className="mt-1 text-2xl font-bold">{totalOrders}</p></div>
        <div className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">{t("Revenue")}</p><p className="mt-1 text-2xl font-bold">${totalRevenue.toFixed(2)}</p></div>
        <div className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">{t("CouponLabel")}</p><p className="mt-1 text-2xl font-bold">{totalCoupons}</p></div>
        <div className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">{t("ActiveCoupon")}</p><p className="mt-1 text-2xl font-bold">{activeCoupons}</p></div>
      </div>
    </div>
  );
}
