export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createCoupon(formData: FormData) {
  "use server";
  const code = (formData.get("code") as string || "").toUpperCase();
  const type = formData.get("type") as string || "PERCENTAGE";
  const value = Number(formData.get("value") || 0);
  const minOrder = formData.get("minOrder") ? Number(formData.get("minOrder")) : null;
  const maxDiscount = formData.get("maxDiscount") ? Number(formData.get("maxDiscount")) : null;
  const usageLimit = formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null;
  const usagePerUser = formData.get("usagePerUser") ? Number(formData.get("usagePerUser")) : 1;
  const startsAt = formData.get("startsAt") ? new Date(formData.get("startsAt") as string) : new Date();
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null;
  const description = formData.get("description") as string || "";

  try {
    await prisma.coupon.create({
      data: {
        code,
        type,
        value,
        minOrderAmount: minOrder,
        maxDiscount,
        usageLimit,
        usagePerUser,
        startsAt,
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
          <label className="block text-sm font-medium mb-1">Code *</label>
          <input name="code" required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. SUMMER20" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <select name="type" className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
            <option value="FREE_SHIPPING">Free Shipping</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Value *</label>
          <input name="value" type="number" step="0.01" required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="20 = 20% or $20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Min Order</label>
            <input name="minOrder" type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Discount</label>
            <input name="maxDiscount" type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Usage Limit</label>
            <input name="usageLimit" type="number" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Per User</label>
            <input name="usagePerUser" type="number" defaultValue={1} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input name="startsAt" type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input name="expiresAt" type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Create Coupon</button>
          <a href="/admin/coupons" className="px-6 py-2 border rounded-lg text-sm hover:bg-neutral-50">Cancel</a>
        </div>
      </form>
    </div>
  );
}
