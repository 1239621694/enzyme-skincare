import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  const links = [
    { h: "/admin", l: "Dashboard" },
    { h: "/admin/orders", l: "Orders" },
    { h: "/admin/products", l: "Products" },
    { h: "/admin/reviews", l: "Reviews" },
    { h: "/admin/analytics", l: "Analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 flex-shrink-0 border-r border-neutral-200 bg-white p-6">
        <Link href="/admin" className="font-heading text-xl font-bold text-primary-700">Enzyme Admin</Link>
        <nav className="mt-8 space-y-1">
          {links.map((l) => (
            <Link key={l.h} href={l.h} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary-700">{l.l}</Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
