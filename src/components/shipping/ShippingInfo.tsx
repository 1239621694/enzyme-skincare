"use client";

import { SHIPPING_CONFIG } from "@/lib/business-info";

interface ShippingInfoProps {
  /** Optional: pass the raw merchandise subtotal to show a "you're $X away" message */
  merchandiseSubtotal?: number;
  /** If true, shows the compact inline version (for product pages) */
  compact?: boolean;
}

export function ShippingInfo({ merchandiseSubtotal: _merchandiseSubtotal, compact }: ShippingInfoProps) {
  if (compact) {
    return (
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5 flex-shrink-0">🚚</span>
          <div>
            <p className="text-sm font-semibold text-neutral-800">Shipping</p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              FREE Worldwide Shipping on Orders Over ${SHIPPING_CONFIG.freeThreshold}
            </p>
            <p className="text-xs text-neutral-400">
              Orders below ${SHIPPING_CONFIG.freeThreshold} incur a flat shipping fee of ${SHIPPING_CONFIG.flatRate}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Free-shipping progress indicator for cart / checkout.
 * `merchandiseSubtotal` = raw product total BEFORE any discounts.
 * Shipping qualification is based on MERCHANDISE SUBTOTAL only.
 */
export function ShippingProgressBar({ merchandiseSubtotal }: { merchandiseSubtotal: number }) {
  const qualifies = merchandiseSubtotal >= SHIPPING_CONFIG.freeThreshold;
  const progress = Math.min(100, (merchandiseSubtotal / SHIPPING_CONFIG.freeThreshold) * 100);
  const remaining = SHIPPING_CONFIG.freeThreshold - merchandiseSubtotal;

  return (
    <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
      {qualifies ? (
        <div className="text-center">
          <p className="text-sm font-semibold text-green-700 mb-2">🎉 Congratulations! You qualify for FREE Worldwide Shipping.</p>
          <div className="w-full bg-green-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "100%" }} />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-neutral-600 mb-2">
            You&apos;re only <span className="font-bold text-primary-700">${remaining.toFixed(2)}</span> away from{" "}
            <span className="font-semibold">FREE Worldwide Shipping</span>
          </p>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div
              className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, progress)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}