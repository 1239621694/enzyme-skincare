"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/admin-i18n";

interface CustomerDetail {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  tags: string[];
  notes: string | null;
  referralSource: string | null;
  totalOrders: number;
  totalSpent: number;
  stats: { totalOrders: number; totalSpent: number; averageOrderValue: number };
  firstOrderAt: string | null;
  lastOrderAt: string | null;
  createdAt: string;
  orders: Array<{
    id: string;
    orderNumber: string | null;
    status: string;
    total: number;
    items: Array<{ productName: string | null; quantity: number; price: number }>;
    createdAt: string;
  }>;
}

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch("/api/admin/customers/" + params.id);
        const data = await res.json();
        if (!data.error) setCustomer(data);
      } catch (e) {
        console.error("Failed to load customer:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [params.id]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/customers/" + params.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) { setEditing(false); window.location.reload(); }
    } catch (e) {
      console.error("Failed to update:", e);
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    const updated = [...(editForm.tags || customer?.tags || []), newTag.trim()];
    setEditForm({ ...editForm, tags: updated });
    setNewTag("");
  };

  const removeTag = (index: number) => {
    const tags = editForm.tags || customer?.tags || [];
    setEditForm({ ...editForm, tags: tags.filter((_: any, i: number) => i !== index) });
  };

  if (loading) return <div className="text-center py-12 text-neutral-400">Loading...</div>;
  if (!customer) return <div className="text-center py-12">Customer not found</div>;

  const currentTags = editing ? (editForm.tags || []) : customer.tags;

  return (
    <div>
      <Link href="/admin/customers" className="text-sm text-primary-600 hover:underline">{t("← Customers")}</Link>
      <div className="flex items-center justify-between mt-1 mb-6">
        <h1 className="font-heading text-2xl font-bold">
          {[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Anonymous"}
        </h1>
        <button onClick={() => { setEditing(!editing); setEditForm({ firstName: customer.firstName, lastName: customer.lastName, phone: customer.phone, notes: customer.notes, tags: [...customer.tags], referralSource: customer.referralSource }); }} className="px-4 py-2 border rounded-lg text-sm hover:bg-neutral-50">
          {editing ? t("Cancel") : t("✏️ Edit")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Profile */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("Profile")}</h2>
            {editing ? (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <input value={editForm.firstName || ""} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="First name" />
                  <input value={editForm.lastName || ""} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="Last name" />
                </div>
                <input value={editForm.phone || ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Phone" />
                <input value={editForm.referralSource || ""} onChange={(e) => setEditForm({ ...editForm, referralSource: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Referral source" />
                <textarea value={editForm.notes || ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Notes..." />
                <div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {(editForm.tags || []).map((tag: string, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                        {tag}
                        <button onClick={() => removeTag(i)} className="text-primary-600 hover:text-primary-800">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className="flex-1 px-3 py-1.5 border rounded-lg text-sm" placeholder="Add tag..." />
                    <button onClick={addTag} className="px-3 py-1.5 bg-neutral-100 rounded-lg text-sm hover:bg-neutral-200">+</button>
                  </div>
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">{t("Save")}</button>
              </div>
            ) : (
              <div className="text-sm space-y-2 text-neutral-600">
                <p><span className="font-medium">{t("Email")}:</span> {customer.email}</p>
                <p><span className="font-medium">{t("Phone")}:</span> {customer.phone || "—"}</p>
                <p><span className="font-medium">{t("Referral Source")}:</span> {customer.referralSource || "—"}</p>
                <div>
                  <span className="font-medium">Tags: </span>
                  <div className="inline-flex gap-1 flex-wrap ml-1">
                    {currentTags.length > 0 ? currentTags.map((t: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs">{t}</span>
                    )) : <span className="text-neutral-300">—</span>}
                  </div>
                </div>
                {customer.notes && (
                  <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-neutral-400 mb-1">Notes:</p>
                    <p className="text-sm">{customer.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order History */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("Order History")} ({customer.orders.length})</h2>
            {customer.orders.length === 0 ? (
              <p className="text-sm text-neutral-400">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {customer.orders.map((o) => (
                  <Link key={o.id} href={"/admin/orders/" + o.id} className="block p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{o.orderNumber || o.id.slice(0, 12)}</p>
                        <p className="text-xs text-neutral-500 mt-1">{o.items.length} item(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${o.total.toFixed(2)}</p>
                        <p className="text-xs text-neutral-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-3">{t("Stats")}</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-neutral-500">{t("Total Orders")}</dt><dd className="font-semibold">{customer.stats.totalOrders}</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-500">{t("Total Spent")}</dt><dd className="font-semibold">${customer.stats.totalSpent.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-500">{t("Average Order")}</dt><dd className="font-semibold">${customer.stats.averageOrderValue.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-500">{t("First Order")}</dt><dd className="text-xs">{customer.firstOrderAt ? new Date(customer.firstOrderAt).toLocaleDateString() : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-500">{t("LastOrderDetail")}</dt><dd className="text-xs">{customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-500">{t("Customer Since")}</dt><dd className="text-xs">{new Date(customer.createdAt).toLocaleDateString()}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
