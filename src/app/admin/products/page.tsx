export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { t } from "@/lib/admin-i18n";

export default async function AdminProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { updatedAt: "desc" }, include: { variants: true } });
  } catch (e) {
    console.error("Failed to load products:", e);
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">{t("Products")} ({products.length})</h1>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left">
            <tr>
              <th className="p-3 font-medium">{t("Name")}</th>
              <th className="p-3 font-medium">{t("Price")}</th>
              <th className="p-3 font-medium">{t("Category")}</th>
              <th className="p-3 font-medium">{t("Stock")}</th>
              <th className="p-3 font-medium">{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-neutral-400">{t("No products yet")}</td></tr>}
            {products.map((p: any) => {
              const ts = p.variants?.reduce((s: number, v: any) => s + v.stock, 0) || (p.isActive ? 999 : 0);
              return (
                <tr key={p.id} className="border-t border-neutral-100">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">${Number(p.price).toFixed(2)}</td>
                  <td className="p-3 text-neutral-500">{p.category || "-"}</td>
                  <td className="p-3"><span className={ts > 0 && ts < 10 ? "text-red-600 font-medium" : ts === 0 ? "text-red-500" : "text-green-600"}>{ts > 999 ? t("In Stock") : ts + " " + t("units")}</span></td>
                  <td className="p-3"><span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (p.isActive ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500")}>{p.isActive ? t("ActiveProduct") : t("Inactive")}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
