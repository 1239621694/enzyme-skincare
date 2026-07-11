export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DuplicateButton } from "./DuplicateButton";
import { t } from "@/lib/admin-i18n";

export default async function CouponsPage() {
  let coupons: any[] = [];
  try {
    coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { usages: true } } },
    });
  } catch (e) {
    console.error("Failed to fetch coupons:", e);
  }

  const statusBadge: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    DRAFT: "bg-neutral-100 text-neutral-500",
    DISABLED: "bg-red-100 text-red-700",
    EXPIRED: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">{t("Coupons")} ({coupons.length})</h1>
        <Link href="/admin/coupons/create" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">+ {t("Create Coupon")}</Link>
      </div>

      {coupons.length === 0 ? (
        <div className="rounded-xl border bg-white py-12 text-center text-neutral-400">{t("No coupons yet")}.</div>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left">
                <tr>
                  <th className="p-3 font-medium">{t("Name / Code")}</th>
                  <th className="p-3 font-medium">{t("Type")}</th>
                  <th className="p-3 font-medium">{t("Value")}</th>
                  <th className="p-3 font-medium">{t("Uses")}</th>
                  <th className="p-3 font-medium">{t("Status")}</th>
                  <th className="p-3 font-medium">{t("Expires")}</th>
                  <th className="p-3 font-medium">{t("CouponActions")}</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                    <td className="p-3">
                      <div className="font-medium">{c.name || c.code}</div>
                      <div className="font-mono text-xs text-neutral-400">{c.code}</div>
                    </td>
                    <td className="p-3">{c.type}</td>
                    <td className="p-3">{c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}</td>
                    <td className="p-3">{c.currentUses || c._count?.usages || 0}</td>
                    <td className="p-3">
                      <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + (statusBadge[c.status] || "bg-neutral-100")}>
                        {c.status || (c.isActive ? "ACTIVE" : "DISABLED")}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-400 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link href={"/admin/coupons/" + c.id + "/edit"} className="px-2 py-1 text-xs border rounded hover:bg-neutral-50">{t("Edit")}</Link>
                        <DuplicateButton couponId={c.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
