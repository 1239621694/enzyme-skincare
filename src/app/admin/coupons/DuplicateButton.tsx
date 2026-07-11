"use client";
import { t } from "@/lib/admin-i18n";

export function DuplicateButton({ couponId }: { couponId: string }) {
  const handleDuplicate = async () => {
    try {
      const res = await fetch("/api/admin/coupons/" + couponId + "/duplicate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert(data.error || "Failed to duplicate");
      }
    } catch (e) {
      console.error("Duplicate error:", e);
    }
  };

  return (
    <button onClick={handleDuplicate} className="px-2 py-1 text-xs border rounded hover:bg-neutral-50">
      {t("Duplicate")}
    </button>
  );
}
