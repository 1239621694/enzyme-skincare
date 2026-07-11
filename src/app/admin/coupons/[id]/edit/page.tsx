"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { t } from "@/lib/admin-i18n";

export default function EditCouponPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await fetch("/api/admin/coupons/" + params.id);
        const data = await res.json();
        if (data.error) return;
        setForm({
          name: data.name || "",
          code: data.code,
          type: data.type,
          value: data.value,
          status: data.status || "ACTIVE",
          minOrderAmount: data.minOrderAmount || "",
          maxDiscount: data.maxDiscount || "",
          usageLimit: data.usageLimit || "",
          usagePerUser: data.usagePerUser || 1,
          expiresAt: data.expiresAt ? data.expiresAt.slice(0, 10) : "",
          description: data.description || "",
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCoupon();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body: any = { ...form };
      body.minOrderAmount = form.minOrderAmount ? Number(form.minOrderAmount) : null;
      body.maxDiscount = form.maxDiscount ? Number(form.maxDiscount) : null;
      body.usageLimit = form.usageLimit ? Number(form.usageLimit) : null;
      body.usagePerUser = form.usagePerUser ? Number(form.usagePerUser) : 1;
      body.value = Number(form.value);
      body.expiresAt = form.expiresAt ? new Date(form.expiresAt).toISOString() : null;

      const res = await fetch("/api/admin/coupons/" + params.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else router.push("/admin/coupons");
    } catch (e) { setError("Failed to save"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-8 text-neutral-400">{t("Loading")}</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-bold">{t("Edit Coupon")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <div><label className="block text-sm font-medium mb-1">{t("Coupon Name")}</label>
          <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">{t("Code")}</label>
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">{t("Type")}</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="PERCENTAGE">{t("Percentage (%)")}</option>
              <option value="FIXED">{t("Fixed Amount ($)")}</option>
            </select></div>
          <div><label className="block text-sm font-medium mb-1">{t("Value")}</label>
            <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">{t("Status")}</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="ACTIVE">{t("CouponActive")}</option>
            <option value="DRAFT">{t("Draft")}</option>
            <option value="DISABLED">{t("Disabled")}</option>
          </select></div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">{t("Usage Limit")}</label>
            <input value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} type="number" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">{t("Usage Per User")}</label>
            <input value={form.usagePerUser} onChange={(e) => setForm({ ...form, usagePerUser: e.target.value })} type="number" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">{t("Min Order Amount")}</label>
            <input value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">{t("Expiry Date")}</label>
          <input value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} type="date" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">{t("Description")}</label>
          <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">{saving ? t("Saving") + "..." : t("Save Changes")}</button>
          <button type="button" onClick={() => router.push("/admin/coupons")} className="px-6 py-2 border rounded-lg text-sm hover:bg-neutral-50">{t("Cancel")}</button>
        </div>
      </form>
    </div>
  );
}
