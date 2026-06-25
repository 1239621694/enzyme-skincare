export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { variants: true } });
  return (<div><h1 className="mb-6 font-heading text-2xl font-bold">Products ({products.length})</h1>
    <div className="overflow-hidden rounded-xl border bg-white"><table className="w-full text-sm"><thead className="bg-neutral-50 text-left"><tr>
      <th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Price</th><th className="p-3 font-medium">Category</th><th className="p-3 font-medium">Stock</th><th className="p-3 font-medium">Status</th>
    </tr></thead><tbody>{products.map((p) => {
      const ts = p.variants.reduce((s, v) => s + v.stock, 0) || (p.isActive ? 999 : 0);
      return (<tr key={p.id} className="border-t border-neutral-100">
        <td className="p-3 font-medium">{p.name}</td><td className="p-3">${Number(p.price).toFixed(2)}</td>
        <td className="p-3 text-neutral-500">{p.category || "-"}</td>
        <td className="p-3"><span className={ts > 0 && ts < 10 ? "text-red-600 font-medium" : ts === 0 ? "text-red-500" : "text-green-600"}>{ts > 999 ? "In Stock" : ts + " units"}</span></td>
        <td className="p-3"><span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (p.isActive ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500")}>{p.isActive ? "Active" : "Inactive"}</span></td>
      </tr>);
    })}</tbody></table></div></div>);
}