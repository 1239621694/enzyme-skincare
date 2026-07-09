"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCoupon } from "../actions";

export default function CreateCouponPage() {
  const [state, formAction, pending] = useActionState(createCoupon, null);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-bold">Create Coupon</h1>
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}
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
          <input name="value" type="number" step="0.01" required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. 20 = 20% or " />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Usage Per User</label>
          <input name="usagePerUser" type="number" defaultValue={1} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input name="expiresAt" type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {pending ? "Creating..." : "Create Coupon"}
          </button>
          <Link href="/admin/coupons" className="px-6 py-2 border rounded-lg text-sm hover:bg-neutral-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
