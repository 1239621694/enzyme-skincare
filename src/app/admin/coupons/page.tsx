export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CouponsPage() {
  let coupons: any[] = [];
  try {
    coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Failed to fetch coupons:", e);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Coupons</h1>
        <Link href="/admin/coupons/create" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">+ Create Coupon</Link>
      </div>

      {coupons.length === 0 ? (
        <div className="rounded-xl border bg-white py-12 text-center text-neutral-400">No coupons yet.</div>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left">
              <tr>
                <th className="p-3 font-medium">Code</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Value</th>
                <th className="p-3 font-medium">Uses</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Expires</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="p-3 font-mono text-xs">{c.code}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="p-3">{c.currentUses}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-400 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}