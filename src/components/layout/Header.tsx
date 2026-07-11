"use client";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/hooks/useCart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/cases", label: "BEFORE / AFTER" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { itemCount, openCart } = useCartContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        <Link href="/" className="font-heading text-2xl font-bold text-primary-700 tracking-tight">
          Enzyme
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="p-2 text-neutral-600 hover:text-primary-600 transition-colors" aria-label="Search">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
          <button onClick={openCart} className="p-2 text-neutral-600 hover:text-primary-600 transition-colors relative" aria-label="Cart">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>
          </button>
          <button
            className="lg:hidden p-2 text-neutral-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={cn("lg:hidden overflow-hidden transition-all duration-200", mobileOpen ? "max-h-96 border-t border-neutral-200" : "max-h-0")}>
        <nav className="flex flex-col px-4 py-3 space-y-2 bg-white">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="py-2 text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}