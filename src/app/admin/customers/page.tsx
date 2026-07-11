"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { t } from "@/lib/admin-i18n";

interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  tags: string[];
  notes: string | null;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderAt: string | null;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 20;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy, sortOrder, page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      const res = await fetch("/api/admin/customers?" + params);
      const data = await res.json();
      if (data.customers) {
        setCustomers(data.customers);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (e) {
      console.error("Failed to load customers:", e);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">{t("Customers")} ({total})</h1>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder={t("Search by name, email, phone...")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left">
              <tr>
                <th className="p-3 font-medium">{t("Customer")}</th>
                <th className="p-3 font-medium">{t("Email")}</th>
                <th className="p-3 font-medium">{t("Phone")}</th>
                <th className="p-3 font-medium cursor-pointer select-none" onClick={() => { setSortBy("totalOrders"); setSortOrder(sortOrder === "desc" ? "asc" : "desc"); }}>
                  {t("Orders")} {sortBy === "totalOrders" ? (sortOrder === "desc" ? "↓" : "↑") : "↕"}
                </th>
                <th className="p-3 font-medium cursor-pointer select-none" onClick={() => { setSortBy("totalSpent"); setSortOrder(sortOrder === "desc" ? "asc" : "desc"); }}>
                  {t("Total Spent")} {sortBy === "totalSpent" ? (sortOrder === "desc" ? "↓" : "↑") : "↕"}
                </th>
                <th className="p-3 font-medium">{t("AOV")}</th>
                <th className="p-3 font-medium">{t("Tags")}</th>
                <th className="p-3 font-medium">{t("Last Order")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-6 text-center text-neutral-400">{t("Loading")}</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center text-neutral-400">{t("No customers found")}</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="p-3">
                    <Link href={"/admin/customers/" + c.id} className="font-medium text-primary-600 hover:underline">
                      {[c.firstName, c.lastName].filter(Boolean).join(" ") || "Anonymous"}
                    </Link>
                  </td>
                  <td className="p-3 text-neutral-600 text-xs">{c.email}</td>
                  <td className="p-3 text-neutral-500 text-xs">{c.phone || "—"}</td>
                  <td className="p-3">{c.totalOrders}</td>
                  <td className="p-3 font-medium">${c.totalSpent.toFixed(2)}</td>
                  <td className="p-3 text-neutral-500">${c.averageOrderValue.toFixed(2)}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {c.tags.length > 0 ? c.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-neutral-100 rounded-full text-xs">{t}</span>
                      )) : <span className="text-neutral-300">—</span>}
                    </div>
                  </td>
                  <td className="p-3 text-xs text-neutral-400">
                    {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-neutral-500">{t("Page")} {page} {t("of")} {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-30">{t("← Prev")}</button>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-30">{t("Next →")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
