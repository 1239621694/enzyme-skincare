export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
export default async function AccountPage() {
  const c = await cookies(); const s = c.get("admin_session")?.value;
  const session = s ? await prisma.session.findUnique({ where: { sessionToken: s }, include: { user: true } }) : null;
  const user = session?.user as any;
  const orderCount = await prisma.order.count();
  return (<div><h1 className="mb-6 font-heading text-2xl font-bold">Welcome, {user?.name || "Customer"}</h1><div className="rounded-xl border bg-white p-6"><p className="text-3xl font-bold text-primary-600">{orderCount}</p><p className="mt-1 text-sm text-neutral-500">Orders</p></div></div>);
}