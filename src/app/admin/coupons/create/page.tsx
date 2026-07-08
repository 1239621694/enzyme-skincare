export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createCoupon(formData: FormData) {
  "use server";
  const code = (formData.get("code") as string || "").toUpperCase();
  const type = formData.get("type") as string || "PERCENTAGE";
  const value = Number(formData.get("value") || 0);
  const usagePerUser = formData.get("usagePerUser") ? Number(formData.get("usagePerUser")) : 1;
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null;
  const description = formData.get("description") as string || "";

  try {
    await prisma.coupon.create({
      data: {
        code,
        type: type as any,
        value,
        usagePerUser,
        expiresAt,
        description,
        isActive: true,
      },
    });
  } catch (e: any) {
    console.error("Failed to create coupon:", e);
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export default function CreateCouponPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-bold">Create Coupon</h1>
      <form action={createCoupon} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Coupon Code *</label>
          <input name="code" required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. SUMMER20" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Type *</label>
          <select name="type" className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Value *</label>
          <input name="value" type="number" step="0.01" required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. 20 = 20% or $20" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Usage Per User</label>
          <input name="usagePerUser" type="number" defaultValue={1} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input name="expiresAt" type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea name="description" className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder="Internal note" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Create Coupon</button>
          <a href="/admin/coupons" className="px-6 py-2 border rounded-lg text-sm hover:bg-neutral-50">Cancel</a>
        </div>
      </form>
    </div>
  );
}
