export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
export default async function AdminReferralsPage() {
  const referrals = await prisma.referral.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { order: { select: { orderNumber: true, total: true } } } });
  return (<div><h1 className="mb-6 font-heading text-2xl font-bold">Referrals ({referrals.length})</h1>
    <div className="overflow-hidden rounded-xl border bg-white"><table className="w-full text-sm"><thead className="bg-neutral-50 text-left"><tr><th className="p-3">Referrer</th><th className="p-3">Code</th><th className="p-3">Status</th><th className="p-3">Order</th><th className="p-3">Commission</th><th className="p-3">Date</th></tr></thead><tbody>
    {referrals.map(r => (<tr key={r.id} className="border-t border-neutral-100"><td className="p-3">{r.referrerEmail}</td><td className="p-3 font-mono text-xs">{r.referrerCode}</td><td className="p-3">{r.status}</td><td className="p-3">{r.order?.orderNumber || "—"}</td><td className="p-3">${Number(r.commissionAmount || 0).toFixed(2)}</td><td className="p-3 text-neutral-400">{new Date(r.createdAt).toLocaleDateString()}</td></tr>))}
    </tbody></table></div></div>);
}