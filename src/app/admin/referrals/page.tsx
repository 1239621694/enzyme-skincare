export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function AdminReferralsPage() {
  let referrals: any[] = [];
  try {
    referrals = await prisma.referral.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { order: { select: { orderNumber: true, total: true } } } });
  } catch (e) {
    console.error("Failed to load referrals:", e);
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Referrals ({referrals.length})</h1>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left">
            <tr><th className="p-3 font-medium">Referrer</th><th className="p-3 font-medium">Code</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Order</th><th className="p-3 font-medium">Commission</th><th className="p-3 font-medium">Date</th></tr>
          </thead>
          <tbody>
            {referrals.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-neutral-400">No referrals yet</td></tr>}
            {referrals.map((r: any) => (
              <tr key={r.id} className="border-t border-neutral-100">
                <td className="p-3">{r.referrerEmail}</td>
                <td className="p-3 font-mono text-xs">{r.referrerCode}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">{r.order?.orderNumber || "—"}</td>
                <td className="p-3">${Number(r.commissionAmount || 0).toFixed(2)}</td>
                <td className="p-3 text-neutral-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
