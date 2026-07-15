"use client";
import Link from "next/link";
import { BUSINESS_INFO, getOperatorDisclosure } from "@/lib/business-info";

const footerLinks = {
  Shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?badge=best-seller", label: "Best Sellers" },
    { href: "/products?badge=new", label: "New Arrivals" },
  ],
  Learn: [
    { href: "/cases", label: "Case Studies" },
    { href: "/about", label: "Our Story" },
  ],
  "Legal & Support": [
    { href: "/contact", label: "Contact Us" },
    { href: "/about", label: "About Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/shipping-policy", label: "Shipping Policy" },
    { href: "/refund-policy", label: "Refund & Return Policy" },
    { href: "/payment-policy", label: "Payment Policy" },
    { href: "/cookie-policy", label: "Cookie Policy" },
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

        {/* Business Info Block */}
        <div className="mt-10 pt-8 border-t border-neutral-800">
          <div className="max-w-4xl">
            <h3 className="text-sm font-semibold text-white mb-3">Business Information</h3>
            <div className="text-xs text-neutral-400 space-y-1 leading-relaxed">
              <p><strong className="text-neutral-300">Legal Name:</strong> {BUSINESS_INFO.legalNameEN} ({BUSINESS_INFO.legalNameCN})</p>
              <p><strong className="text-neutral-300">Registration Number:</strong> {BUSINESS_INFO.registrationNumber}</p>
              <p><strong className="text-neutral-300">Registered Address:</strong> {BUSINESS_INFO.registeredAddress}</p>
              <p><strong className="text-neutral-300">Customer Support:</strong> <a href={`mailto:${BUSINESS_INFO.supportEmail}`} className="text-neutral-400 hover:text-white transition-colors">{BUSINESS_INFO.supportEmail}</a></p>
              <p><strong className="text-neutral-300">Phone:</strong> <a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, "")}`} className="text-neutral-400 hover:text-white transition-colors">{BUSINESS_INFO.phone}</a></p>
              <p><strong className="text-neutral-300">Business Hours:</strong> {BUSINESS_INFO.businessHours}</p>
              <p className="pt-1 text-neutral-500">{getOperatorDisclosure()}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} {BUSINESS_INFO.legalNameEN}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
