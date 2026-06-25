export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function AccountOrderDetailPage({ params }: any) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
  if (!order) notFound();
  return (<div><Link href="/account/orders" className="text-sm text-primary-600 hover:underline">&larr; Back</Link>
    <h1 className="mt-2 font-heading text-xl font-bold">Order #{id.slice(0, 8)}</h1>
    <div className="mt-4 rounded-xl border bg-white p-6"><dl className="space-y-2 text-sm"><div className="flex justify-between"><dt className="text-neutral-500">Status</dt><dd className="font-medium">{order.status}</dd></div><div className="flex justify-between"><dt className="text-neutral-500">Total</dt><dd className="font-medium">${Number(order.total).toFixed(2)}</dd></div><div className="flex justify-between"><dt className="text-neutral-500">Date</dt><dd>{new Date(order.createdAt).toLocaleDateString()}</dd></div></dl></div>
    <div className="mt-4 rounded-xl border bg-white p-6"><h2 className="mb-3 font-semibold">Items</h2>{order.items.map((i) => (<div key={i.id} className="flex justify-between border-b py-2 text-sm"><span>{i.product?.name || "Product"} x{i.quantity}</span><span>${Number(i.price).toFixed(2)}</span></div>))}</div></div>);
}