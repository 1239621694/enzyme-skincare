"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCoupon } from "../actions";
import { t } from "@/lib/admin-i18n";

export default function CreateCouponPage() {
  const [state, formAction, pending] = useActionState(createCoupon, null);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-bold">{t("Create Coupon")}</h1>
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">{t("Coupon Name")}</label>
          <input name="name" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="例如：夏季促销 2026" />
          <p className="text-xs text-neutral-400 mt-1">优惠券的名称，用于内部识别</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("Coupon Code")} *</label>
          <div className="flex gap-2">
            <input name="code" required className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="例如：SUMMER20" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">客户在结账时输入的优惠码，建议使用大写字母和数字</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("Discount Type")} *</label>
          <select name="type" className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="PERCENTAGE">{t("Percentage (%)")}</option>
            <option value="FIXED">{t("Fixed Amount ($)")}</option>
          </select>
          <p className="text-xs text-neutral-400 mt-1">百分比折扣按订单总价百分比计算，固定金额直接减免指定金额</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("Discount Value")} *</label>
          <input name="value" type="number" step="0.01" required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="例如：20 表示 20% 或 $20" />
          <p className="text-xs text-neutral-400 mt-1">选择百分比时填百分比数字（如 20 表示 20%），固定金额时填美元金额</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("Status")}</label>
            <select name="status" className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="ACTIVE">{t("CouponActive")}</option>
              <option value="DRAFT">{t("Draft")}</option>
            </select>
            <p className="text-xs text-neutral-400 mt-1">草稿状态优惠券不会在结账时生效</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("Usage Limit")}</label>
            <input name="usageLimit" type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="不限制" />
            <p className="text-xs text-neutral-400 mt-1">留空表示不限制使用次数</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("Min Order Amount")}</label>
            <input name="minOrderAmount" type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="无限制" />
            <p className="text-xs text-neutral-400 mt-1">订单金额达到此值后才可使用该优惠券</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("Usage Per User")}</label>
            <input name="usagePerUser" type="number" defaultValue={1} className="w-full px-3 py-2 border rounded-lg text-sm" />
            <p className="text-xs text-neutral-400 mt-1">每个用户可使用该优惠券的次数</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("Expiry Date")}</label>
          <input name="expiresAt" type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
          <p className="text-xs text-neutral-400 mt-1">留空表示永不过期</p>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {pending ? t("Creating") + "..." : t("Create Coupon")}
          </button>
          <Link href="/admin/coupons" className="px-6 py-2 border rounded-lg text-sm hover:bg-neutral-50">{t("Cancel")}</Link>
        </div>
      </form>
    </div>
  );
}
