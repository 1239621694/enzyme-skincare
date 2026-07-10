"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCoupon(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const code = ((formData.get("code") as string) || "").toUpperCase();
  const type = (formData.get("type") as string) || "PERCENTAGE";
  const value = parseFloat(formData.get("value") as string) || 0;
  const usagePerUser = formData.get("usagePerUser")
    ? parseInt(formData.get("usagePerUser") as string, 10)
    : 1;
  const expiresAtStr = formData.get("expiresAt") as string | null;
  const expiresAt = expiresAtStr ? new Date(expiresAtStr) : null;

  try {
    await prisma.coupon.create({
      data: {
        code,
        type: type as "PERCENTAGE" | "FIXED" | "FREE_SHIPPING",
        value,
        name: (formData.get("name") as string) || null,
        status: (formData.get("status") as string) || "ACTIVE",
        usageLimit: formData.get("usageLimit")
          ? parseInt(formData.get("usageLimit") as string, 10)
          : null,
        minOrderAmount: formData.get("minOrderAmount")
          ? parseFloat(formData.get("minOrderAmount") as string)
          : null,
        usagePerUser: usagePerUser || 1,
        expiresAt,
        isActive: true,
      },
    });
  } catch (e: unknown) {
    console.error("Failed to create coupon:", e);
    // Check for unique constraint violation (duplicate code)
    if (typeof e === "object" && e !== null && "code" in e && (e as any).code === "P2002") {
      return { error: `Coupon code "${code}" already exists. Please use a different code.` };
    }
    return { error: "Failed to create coupon. Please try again." };
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}