export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CouponsPage() {
  let coupons: any[] = [];
  let error = "";
  try {
    coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e: any) {
    error = e?.message || "Failed to load";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Coupons</h1>
        <Link href="/admin/coupons/create" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">+ Create Coupon</Link>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm text-red-700">数据库连接错误，显示部分功能可能受限</div>}

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
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-neutral-400">No coupons yet. Create your first coupon.</td></tr>
            )}
            {coupons.map((c: any) => (
              <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="p-3 font-mono text-xs">{c.code}</td>
                <td className="p-3">{c.type}</td>
                <td className="p-3">{c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}</td>
                <td className="p-3">{c.currentUses || 0}/{c.usageLimit || "∞"}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {c.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-3 text-neutral-400 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
                <td className="p-3">
                  <Link href={"/admin/coupons/" + c.id} className="text-primary-600 hover:text-primary-700 text-xs">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
