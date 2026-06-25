export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, include: { product: true } });
  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);
  return (<div><h1 className="mb-6 font-heading text-2xl font-bold">Review Moderation ({pending.length} pending)</h1>
    {pending.map((r) => (<div key={r.id} className="mb-3 rounded-xl border bg-white p-4"><p className="text-sm font-medium">{r.userName} on {r.product.name}</p><p className="text-xs text-neutral-500">{r.rating}/5{r.title ? " - " + r.title : ""}</p>{r.body && <p className="mt-1 text-sm">{r.body}</p>}</div>))}
    {approved.length > 0 && <h2 className="mb-3 mt-8 font-semibold text-green-700">Approved ({approved.length})</h2>}
    {approved.map((r) => (<div key={r.id} className="mb-3 rounded-xl border bg-white p-4 opacity-60"><p className="text-sm font-medium">{r.userName} on {r.product.name}</p><p className="text-xs text-neutral-500">{r.rating}/5</p></div>))}
  </div>);
}