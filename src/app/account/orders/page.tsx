export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function AccountOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  if (orders.length === 0) return (<div><h1 className="mb-4 font-heading text-xl font-bold">Order History</h1><p className="text-neutral-500">No orders yet.</p></div>);
  return (<div><h1 className="mb-4 font-heading text-xl font-bold">Order History</h1>
    <div className="space-y-3">{orders.map((o) => (<Link key={o.id} href={"/account/orders/" + o.id} className="block rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm"><div className="flex justify-between"><div><p className="text-sm font-medium">Order #{o.id.slice(0, 8)}</p><p className="text-xs text-neutral-400">{new Date(o.createdAt).toLocaleDateString()}</p></div><div className="text-right"><p className="font-medium">${Number(o.total).toFixed(2)}</p><p className="text-xs text-neutral-500">{o.status}</p></div></div></Link>))}</div></div>);
}