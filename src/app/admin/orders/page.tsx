export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
  const statusColor = (s: string) => ({ pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800", shipped: "bg-purple-100 text-purple-800", delivered: "bg-green-100 text-green-800" }[s] || "bg-neutral-100");
  return (<div><h1 className="mb-6 font-heading text-2xl font-bold">Orders ({orders.length})</h1>
    <div className="overflow-hidden rounded-xl border bg-white"><table className="w-full text-sm"><thead className="bg-neutral-50 text-left"><tr>
      <th className="p-3 font-medium">Order</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Items</th><th className="p-3 font-medium">Total</th><th className="p-3 font-medium">Date</th>
    </tr></thead><tbody>{orders.map((o) => (<tr key={o.id} className="border-t border-neutral-100 hover:bg-neutral-50">
      <td className="p-3"><Link href={"/admin/orders/" + o.id} className="font-mono text-xs text-primary-600 hover:underline">{o.id.slice(0, 12)}</Link></td>
      <td className="p-3"><span className={"rounded-full px-2 py-0.5 text-xs font-medium " + statusColor(o.status)}>{o.status}</span></td>
      <td className="p-3">{o.items.length}</td><td className="p-3 font-medium">${Number(o.total).toFixed(2)}</td>
      <td className="p-3 text-neutral-400">{new Date(o.createdAt).toLocaleDateString()}</td>
    </tr>))}</tbody></table></div></div>);
}