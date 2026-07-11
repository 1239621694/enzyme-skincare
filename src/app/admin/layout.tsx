import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/auth";
import { t } from "@/lib/admin-i18n";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  const links = [
    { h: "/admin", l: t("Dashboard") },
    { h: "/admin/orders", l: t("Orders") },
    { h: "/admin/customers", l: t("Customers") },
    { h: "/admin/products", l: t("Products") },
    { h: "/admin/coupons", l: t("Coupons") },
    { h: "/admin/sales-reps", l: t("Sales Reps") },
    { h: "/admin/referrals", l: t("Referrals") },
    { h: "/admin/reviews", l: t("Reviews") },
    { h: "/admin/reports", l: t("Reports") },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 flex-shrink-0 border-r border-neutral-200 bg-white p-6">
        <Link href="/admin" className="font-heading text-xl font-bold text-primary-700">{t("Enzyme Admin")}</Link>
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
