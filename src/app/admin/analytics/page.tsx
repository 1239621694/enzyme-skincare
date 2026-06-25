export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
export default async function AdminAnalyticsPage() {
  const [oc, rev, ap, subs] = await Promise.all([
    prisma.order.count(), prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { isActive: true } }), prisma.subscriber.count({ where: { isActive: true } }),
  ]);
  const metrics = [{ l: "Total Orders", v: oc }, { l: "Revenue", v: "$" + Number(rev._sum.total || 0).toFixed(2) }, { l: "Products", v: ap }, { l: "Subscribers", v: subs }];
  return (<div><h1 className="mb-6 font-heading text-2xl font-bold">Analytics</h1><div className="grid grid-cols-4 gap-4">{metrics.map((m) => (<div key={m.l} className="rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">{m.l}</p><p className="mt-1 text-2xl font-bold text-neutral-800">{m.v}</p></div>))}</div></div>);
}