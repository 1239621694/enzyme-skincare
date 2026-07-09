export const dynamic = "force-dynamic";
import Link from "next/link";

export default function AdminDashboard() {
  const cards = [
    { l: "Orders", v: 0, h: "/admin/orders", c: "bg-blue-50 text-blue-700" },
    { l: "Products", v: 0, h: "/admin/products", c: "bg-green-50 text-green-700" },
    { l: "Revenue", v: "$0.00", h: "/admin", c: "bg-teal-50 text-teal-700" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Dashboard</h1>
      <div className="mb-8 grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.l} href={c.h} className={"rounded-xl p-4 " + c.c}>
            <p className="text-2xl font-bold">{c.v}</p>
            <p className="mt-1 text-sm opacity-80">{c.l}</p>
          </Link>
        ))}
      </div>
      <div className="rounded-xl border bg-white p-6 text-center text-neutral-400 text-sm">
        Database connection unavailable. Some features may be limited.
      </div>
    </div>
  );
}
