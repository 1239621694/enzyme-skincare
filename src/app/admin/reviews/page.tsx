export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function AdminReviewsPage() {
  let reviews: any[] = [];
  try {
    reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, include: { product: true } });
  } catch (e) {
    console.error("Failed to load reviews:", e);
  }

  const pending = reviews.filter((r: any) => !r.isApproved);
  const approved = reviews.filter((r: any) => r.isApproved);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Review Moderation ({pending.length} pending)</h1>
      {reviews.length === 0 && <div className="rounded-xl border bg-white p-8 text-center text-neutral-400">No reviews yet</div>}
      {pending.map((r: any) => (
        <div key={r.id} className="mb-3 rounded-xl border bg-white p-4">
          <p className="text-sm font-medium">{r.userName}{r.product ? " on " + r.product.name : ""}</p>
          <p className="text-xs text-neutral-500">{r.rating}/5{r.title ? " - " + r.title : ""}</p>
          {r.body && <p className="mt-1 text-sm">{r.body}</p>}
        </div>
      ))}
      {approved.length > 0 && <h2 className="mb-3 mt-8 font-semibold text-green-700">Approved ({approved.length})</h2>}
      {approved.map((r: any) => (
        <div key={r.id} className="mb-3 rounded-xl border bg-white p-4 opacity-60">
          <p className="text-sm font-medium">{r.userName}{r.product ? " on " + r.product.name : ""}</p>
          <p className="text-xs text-neutral-500">{r.rating}/5</p>
        </div>
      ))}
    </div>
  );
}
