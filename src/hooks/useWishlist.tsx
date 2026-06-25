"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const WishlistContext = createContext<{
  items: string[];
  toggle: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
} | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    try { const saved = localStorage.getItem("enzyme_wishlist"); if (saved) setItems(JSON.parse(saved)); } catch {}
  }, []);
  useEffect(() => { localStorage.setItem("enzyme_wishlist", JSON.stringify(items)); }, [items]);
  const toggle = (slug: string) => setItems(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  const isWishlisted = (slug: string) => items.includes(slug);
  return <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}