"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface BlogSidebarProps {
  categories: Array<{ slug: string; name: string }>;
  activeCategory?: string;
}

export function BlogSidebar({ categories, activeCategory }: BlogSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-800 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push("/blog")}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm border transition-colors",
              !activeCategory
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-neutral-600 border-neutral-300 hover:border-primary-400"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => router.push(`/blog/category/${cat.slug}`)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                activeCategory === cat.slug
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-neutral-600 border-neutral-300 hover:border-primary-400"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-800 mb-2">
          Get Skincare Insights
        </h3>
        <p className="text-xs text-neutral-500 mb-3">
          Subscribe to our newsletter for science-backed skincare tips.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
          className="space-y-2"
        >
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" size="sm" className="w-full">
            Subscribe
          </Button>
        </form>
      </div>
    </aside>
  );
}