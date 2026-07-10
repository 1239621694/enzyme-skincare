"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { value: "", label: "All" },
  { value: "cleanser", label: "Cleansers" },
  { value: "serum", label: "Serums" },
  { value: "moisturizer", label: "Moisturizers" },
  { value: "mask", label: "Masks" },
  { value: "treatment", label: "Treatments" },
  { value: "spray", label: "Sprays" },
  { value: "set", label: "Sets" },
];

const skinConcerns = [
  { value: "acne", label: "Acne" },
  { value: "aging", label: "Aging" },
  { value: "pigmentation", label: "Pigmentation" },
  { value: "sensitivity", label: "Sensitivity" },
  { value: "dryness", label: "Dryness" },
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentConcern = searchParams.get("concern") ?? "";
  const priceMin = searchParams.get("priceMin") ?? "";
  const priceMax = searchParams.get("priceMax") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const activeFilterCount =
    (currentCategory ? 1 : 0) +
    (currentConcern ? 1 : 0) +
    (priceMin || priceMax ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Active filters badge */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}
          </span>
          <button
            onClick={clearAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-800 mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateParam("category", cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                currentCategory === cat.value
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-neutral-600 border-neutral-300 hover:border-primary-400"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Concerns */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-800 mb-2">Skin Concern</h3>
        <div className="space-y-2">
          {skinConcerns.map((concern) => (
            <label
              key={concern.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-neutral-600"
            >
              <input
                type="checkbox"
                checked={currentConcern === concern.value}
                onChange={() =>
                  updateParam(
                    "concern",
                    currentConcern === concern.value ? "" : concern.value
                  )
                }
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              {concern.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-800 mb-2">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => updateParam("priceMin", e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <span className="text-neutral-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => updateParam("priceMax", e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>
    </div>
  );
}