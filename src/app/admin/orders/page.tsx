"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  status: string;
  total: number;
  subtotal: number | null;
  shippingFee: number | null;
  discountAmount: number | null;
  itemCount: number;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveryStatus: string | null;
  trackingNumber: string | null;
  shippingCompany: string | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-neutral-100 text-neutral-600",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-red-50 text-red-500",
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

const ALLOWED_BULK_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkNote, setBulkNote] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      params.set("page", String(pagination.page));
      params.set("limit", "20");

      const res = await fetch("/api/admin/orders?" + params.toString());
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        setPagination((p) => ({ ...p, total: data.pagination.total, totalPages: data.pagination.totalPages }));
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, dateFrom, dateTo, sortBy, sortOrder, pagination.page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.id)));
    }
  };

  const handleBulkStatus = async () => {
    if (!bulkStatus || selectedIds.size === 0) return;
    try {
      const res = await fetch("/api/admin/orders/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: Array.from(selectedIds), status: bulkStatus, note: bulkNote }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        setBulkStatus("");
        setBulkNote("");
        fetchOrders();
      }
    } catch (e) {
      console.error("Bulk update failed:", e);
    }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (selectedIds.size > 0) params.set("ids", Array.from(selectedIds).join(","));
    else if (statusFilter) params.set("status", statusFilter);
    window.open("/api/admin/orders/export?" + params.toString(), "_blank");
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <span className="text-neutral-300 ml-1">↕</span>;
    return <span className="text-primary-600 ml-1">{sortOrder === "desc" ? "↓" : "↑"}</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">
          Orders{" "}
          <span className="text-base font-normal text-neutral-400">({pagination.total})</span>
        </h1>
        <button onClick={handleExport} className="px-4 py-2 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50">
          ⬇ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search order number, name, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 text-sm">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-2 py-2 border rounded-lg text-sm" />
          <span className="text-neutral-400">—</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-2 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
          <span className="text-sm font-medium text-primary-800">
            {selectedIds.size} selected
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm"
          >
            <option value="">Change status...</option>
            {ALLOWED_BULK_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Note (optional)"
            value={bulkNote}
            onChange={(e) => setBulkNote(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm flex-1 max-w-xs"
          />
          <button
            onClick={handleBulkStatus}
            disabled={!bulkStatus}
            className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50"
          >
            Apply
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="px-4 py-1.5 border rounded-lg text-sm hover:bg-neutral-50"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left">
              <tr>
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedIds.size === orders.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-3 font-medium cursor-pointer select-none" onClick={() => handleSort("orderNumber")}>
                  Order <SortIcon field="orderNumber" />
                </th>
                <th className="p-3 font-medium cursor-pointer select-none" onClick={() => handleSort("customerName")}>
                  Customer <SortIcon field="customerName" />
                </th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium cursor-pointer select-none" onClick={() => handleSort("total")}>
                  Total <SortIcon field="total" />
                </th>
                <th className="p-3 font-medium">Delivery</th>
                <th className="p-3 font-medium cursor-pointer select-none" onClick={() => handleSort("createdAt")}>
                  Date <SortIcon field="createdAt" />
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-6 text-center text-neutral-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center text-neutral-400">No orders found</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(o.id)}
                      onChange={() => toggleSelect(o.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-3">
                    <Link href={"/admin/orders/" + o.id} className="font-mono text-xs text-primary-600 hover:underline">
                      {o.orderNumber || o.id.slice(0, 12)}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{o.customerName || "—"}</div>
                    <div className="text-xs text-neutral-400">{o.customerEmail || ""}</div>
                  </td>
                  <td className="p-3">
                    <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (STATUS_COLORS[o.status] || "bg-neutral-100")}>
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-500">{o.itemCount}</td>
                  <td className="p-3 font-medium">${o.total.toFixed(2)}</td>
                  <td className="p-3 text-xs text-neutral-500">
                    {o.trackingNumber ? (
                      <span title={o.shippingCompany || ""}>📦 {o.trackingNumber}</span>
                    ) : o.deliveryStatus ? (
                      <span>{o.deliveryStatus}</span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="p-3 text-neutral-400 text-xs">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-neutral-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)
          </span>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-30 hover:bg-neutral-50"
            >
              ← Prev
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-30 hover:bg-neutral-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
