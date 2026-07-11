"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/admin-i18n";

interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  salesCode: string;
  commissionRate: number;
  isActive: boolean;
  totalOrders: number;
  totalRevenue: number;
  referralLink: string;
  notes: string | null;
  createdAt: string;
}

export default function AdminSalesRepsPage() {
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", salesCode: "", commissionRate: "5" });
  const [error, setError] = useState("");

  const fetchReps = async () => {
    try {
      const res = await fetch("/api/admin/sales-reps");
      const data = await res.json();
      if (data.salesReps) setReps(data.salesReps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReps(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/sales-reps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else { setShowCreate(false); setCreateForm({ name: "", email: "", salesCode: "", commissionRate: "5" }); fetchReps(); }
    } catch (e) {
      setError("Failed to create");
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch("/api/admin/sales-reps/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchReps();
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">{t("Sales Reps")} ({reps.length})</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
          {showCreate ? t("Cancel") : "+ " + t("Create")}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 p-6 bg-white rounded-xl border space-y-3">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-neutral-500 mb-1">{t("Name *")}</label><input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-xs text-neutral-500 mb-1">{t("Email *")}</label><input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-xs text-neutral-500 mb-1">{t("Sales Code *")}</label><input value={createForm.salesCode} onChange={(e) => setCreateForm({ ...createForm, salesCode: e.target.value })} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. S001" /></div>
            <div><label className="block text-xs text-neutral-500 mb-1">{t("CommissionRate")} (%)</label><input type="number" value={createForm.commissionRate} onChange={(e) => setCreateForm({ ...createForm, commissionRate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          </div>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">{t("Create")}</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-8 text-neutral-400">{t("Loading")}</div>
        ) : reps.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">{t("No sales reps yet")}</div>
        ) : reps.map((rep) => (
          <div key={rep.id} className="rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {rep.name}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rep.isActive ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {rep.isActive ? t("Active") : t("Disabled")}
                  </span>
                </h3>
                <p className="text-sm text-neutral-500">{rep.email} · {t("Code")}: <span className="font-mono">{rep.salesCode}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copyLink(rep.referralLink)} className="px-3 py-1.5 text-xs border rounded-lg hover:bg-neutral-50">{t("📋 Copy Link")}</button>
                <button onClick={() => toggleActive(rep.id, rep.isActive)} className={`px-3 py-1.5 text-xs border rounded-lg hover:bg-neutral-50 ${rep.isActive ? "text-red-600" : "text-green-600"}`}>
                  {rep.isActive ? t("Disable") : t("Enable")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-neutral-50 rounded-lg text-center">
                <p className="text-xs text-neutral-500">{t("Referral Link")}</p>
                <p className="text-xs font-mono text-primary-600 mt-1 truncate">{rep.referralLink}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{rep.totalOrders}</p>
                <p className="text-xs text-neutral-500">{t("Visitors")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{rep.totalOrders}</p>
                <p className="text-xs text-neutral-500">{t("Orders")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">${rep.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-neutral-500">{t("Revenue")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{rep.commissionRate}%</p>
                <p className="text-xs text-neutral-500">{t("CommissionAmount")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
