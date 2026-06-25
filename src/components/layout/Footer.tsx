"use client";
import Link from "next/link";

const footerLinks = {
  Shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?badge=best-seller", label: "Best Sellers" },
    { href: "/products?badge=new", label: "New Arrivals" },
    { href: "/science", label: "The Science" },
  ],
  Learn: [
    { href: "/blog", label: "Journal" },
    { href: "/cases", label: "Case Studies" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "Our Story" },
  ],
  Support: [
    { href: "/contact", label: "Contact Us" },
    
    { href: "/faq", label: "Shipping & Returns" },
    { href: "/rewards", label: "Rewards" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading text-xl font-bold text-white">
              Enzyme
            </Link>
            <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
              Science-backed enzyme skincare that activates your skin&apos;s natural renewal.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-neutral-800">
          <div className="max-w-md">
            <h3 className="text-sm font-semibold text-white mb-2">Stay in touch</h3>
            <p className="text-sm text-neutral-400 mb-3">
              Get 10% off your first order and exclusive enzyme science insights.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Enzyme Skincare. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/faq" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/faq" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}