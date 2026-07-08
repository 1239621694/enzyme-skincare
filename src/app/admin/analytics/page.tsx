export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  let oc = 0, rev = 0, ap = 0, subs = 0;
  try {
    const revResult = await prisma.order.aggregate({ _sum: { total: true } });
    rev = Number(revResult._sum.total || 0);
    oc = await prisma.order.count();
    ap = await prisma.product.count({ where: { isActive: true } });
    subs = await prisma.subscriber.count({ where: { isActive: true } });
  } catch (e) {
    console.error("Failed to load analytics:", e);
  }

  const metrics = [
    { l: "Total Orders", v: oc },
    { l: "Revenue", v: "$" + rev.toFixed(2) },
    { l: "Products", v: ap },
    { l: "Subscribers", v: subs },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Analytics</h1>
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.l} className="rounded-xl border bg-white p-5">
            <p className="text-sm text-neutral-500">{m.l}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-800">{m.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
