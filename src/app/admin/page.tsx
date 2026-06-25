export const dynamic = "force-dynamic";
export const revalidate = 0; // M1: No ISR cache for admin
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function AdminDashboard() {
  const [orderCount, productCount, reviewCount, subCount, revenue, lowStock] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.subscriber.count({ where: { isActive: true } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.productVariant.findMany({ where: { stock: { lt: 10 } }, include: { product: true } }),
  ]);
  const recentOrders = await prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } });
  const cards = [
    { l: "Orders", v: orderCount, h: "/admin/orders", c: "bg-blue-50 text-blue-700" },
    { l: "Products", v: productCount, h: "/admin/products", c: "bg-green-50 text-green-700" },
    { l: "Pending Reviews", v: reviewCount, h: "/admin/reviews", c: "bg-amber-50 text-amber-700" },
    { l: "Subscribers", v: subCount, h: "/admin/analytics", c: "bg-purple-50 text-purple-700" },
    { l: "Revenue", v: "$" + Number(revenue._sum.total ?? 0).toFixed(2), h: "/admin/analytics", c: "bg-teal-50 text-teal-700" },
  ];
  return (<div><h1 className="mb-6 font-heading text-2xl font-bold">Dashboard</h1>
    <div className="mb-8 grid grid-cols-5 gap-4">{cards.map((c) => (<Link key={c.l} href={c.h} className={"rounded-xl p-4 " + c.c}><p className="text-2xl font-bold">{c.v}</p><p className="mt-1 text-sm opacity-80">{c.l}</p></Link>))}</div>
    {lowStock.length > 0 && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6"><h2 className="mb-3 font-semibold text-red-800">Low Stock Alerts</h2>{lowStock.map((v) => (<p key={v.id} className="text-sm text-red-700">{v.product.name}: {v.stock} left</p>))}</div>}
    {recentOrders.length > 0 && <div className="rounded-xl border bg-white p-6"><h2 className="mb-4 font-semibold">Recent Orders</h2><table className="w-full text-sm"><thead><tr className="text-left text-neutral-500"><th className="pb-2">ID</th><th className="pb-2">Status</th><th className="pb-2">Total</th><th className="pb-2">Date</th></tr></thead><tbody>{recentOrders.map((o) => (<tr key={o.id} className="border-t border-neutral-100"><td className="py-2 font-mono text-xs">{o.id.slice(0, 8)}</td><td className="py-2">{o.status}</td><td className="py-2">${Number(o.total).toFixed(2)}</td><td className="py-2 text-neutral-400">{new Date(o.createdAt).toLocaleDateString()}</td></tr>))}</tbody></table></div>}
  </div>);
}