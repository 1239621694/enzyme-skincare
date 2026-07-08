export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  let stats: any = { orderCount: 0, productCount: 0, reviewCount: 0, subCount: 0, revenue: 0, lowStock: [], recentOrders: [] };
  try {
    const [orderCount, productCount, reviewCount, subCount, revenue, lowStock, recentOrders] = await Promise.all([
      prisma.order.count(), prisma.product.count({ where: { isActive: true } }),
      prisma.review.count({ where: { isApproved: false } }), prisma.subscriber.count({ where: { isActive: true } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.productVariant.findMany({ where: { stock: { lt: 10 } }, include: { product: true } }),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { items: true } }),
    ]);
    stats = { orderCount, productCount, reviewCount, subCount, revenue: revenue._sum.total ?? 0, lowStock, recentOrders };
  } catch (e) {
    console.error("Dashboard DB error:", e);
  }

  const cards = [
    { l: "Orders", v: stats.orderCount, h: "/admin/orders", c: "bg-blue-50 text-blue-700" },
    { l: "Products", v: stats.productCount, h: "/admin/products", c: "bg-green-50 text-green-700" },
    { l: "Reviews", v: stats.reviewCount, h: "/admin/reviews", c: "bg-amber-50 text-amber-700" },
    { l: "Revenue", v: "$" + Number(stats.revenue).toFixed(2), h: "/admin", c: "bg-teal-50 text-teal-700" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Dashboard</h1>
      <div className="mb-8 grid grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.l} href={c.h} className={"rounded-xl p-4 " + c.c}>
            <p className="text-2xl font-bold">{c.v}</p>
            <p className="mt-1 text-sm opacity-80">{c.l}</p>
          </Link>
        ))}
      </div>

      {stats.recentOrders.length > 0 && (
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Recent Orders</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-neutral-500"><th className="pb-2">ID</th><th className="pb-2">Total</th><th className="pb-2">Items</th><th className="pb-2">Date</th></tr></thead>
            <tbody>
              {stats.recentOrders.map((o: any) => (
                <tr key={o.id} className="border-t border-neutral-100">
                  <td className="py-2 font-mono text-xs">{o.id.slice(0, 8)}</td>
                  <td className="py-2">${Number(o.total).toFixed(2)}</td>
                  <td className="py-2">{o.items.length}</td>
                  <td className="py-2 text-neutral-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {stats.recentOrders.length === 0 && (
        <div className="rounded-xl border bg-white p-6 text-center text-neutral-400 text-sm">No orders yet</div>
      )}
    </div>
  );
}
