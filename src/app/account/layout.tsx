import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  let user: any = null;
  if (sessionId) {
    const session = await prisma.session.findUnique({ where: { sessionToken: sessionId }, include: { user: true } });
    if (session && session.expires > new Date()) user = session.user;
  }
  if (!user) redirect("/login");
  return (<div className="container mx-auto px-4 py-8">
    <div className="mb-6 flex gap-2 text-sm text-neutral-500"><Link href="/" className="hover:text-primary-600">Home</Link><span>/</span><span className="font-medium text-neutral-800">My Account</span></div>
    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
      <nav className="mb-6 space-y-1 lg:mb-0"><Link href="/account" className="block rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">Overview</Link><Link href="/account/orders" className="block rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">Order History</Link></nav>
      <div className="lg:col-span-3">{children}</div>
    </div>
  </div>);
}