"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductReviews } from "./ProductReviews";

interface ProductTabsProps {
  product: {
    name: string;
    description: string | null;
    ingredients: string | null;
    howToUse: string | null;
    skinConcerns: string[];
    id: string;
  };
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    title: string | null;
    body: string | null;
    skinType: string | null;
    verifiedPurchase: boolean;
    createdAt: Date;
  }>;
}

const tabs = [
  { id: "description", label: "Description" },
  { id: "ingredients", label: "Ingredients" },
  { id: "how-to-use", label: "How to Use" },
  { id: "reviews", label: "Reviews" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ProductTabs({ product, reviews }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-neutral-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            )}
          >
            {tab.label}
            {tab.id === "reviews" && reviews.length > 0 && (
              <span className="ml-1.5 text-xs text-neutral-400">
                ({reviews.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6">
        {activeTab === "description" && (
          <div className="prose prose-neutral max-w-none">
            {product.description ? (
              <div className="space-y-4">
                {product.description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-neutral-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-neutral-400">No description available.</p>
            )}
          </div>
        )}

        {activeTab === "ingredients" && (
          <div>
            {product.ingredients ? (
              <div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-2">
                  Full Ingredients List
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {product.ingredients}
                </p>
              </div>
            ) : (
              <p className="text-neutral-400">Ingredients list coming soon.</p>
            )}
          </div>
        )}

        {activeTab === "how-to-use" && (
          <div>
            {product.howToUse ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-800">
                  How to Use
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600">
                  {product.howToUse.split("\n").map((step, i) => (
                    <li key={i} className="leading-relaxed">
                      {step.replace(/^\d+[\.\)]\s*/, "")}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-neutral-400">Usage instructions coming soon.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && <ProductReviews reviews={reviews} productId={product.id} />}
      </div>
    </div>
  );
}