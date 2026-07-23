"use client";

import { useState } from "react";
import { useCartContext } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "VN", name: "Vietnam" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "NZ", name: "New Zealand" },
  { code: "IE", name: "Ireland" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IL", name: "Israel" },
];

export default function CheckoutPage() {
  const { items, itemCount, total } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("US");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!email.trim()) { toast.error("Please enter your email"); return; }
    if (!firstName.trim() || !lastName.trim()) { toast.error("First and last name are required"); return; }
    if (!phone.trim()) { toast.error("Phone number is required"); return; }
    if (!city.trim()) { toast.error("City is required"); return; }
    if (!state.trim()) { toast.error("State/Province is required"); return; }
    if (!address1.trim()) { toast.error("Address line 1 is required"); return; }
    if (!postalCode.trim()) { toast.error("ZIP/Postal code is required"); return; }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variantId: i.variant,
          })),
          customerEmail: email.trim(),
          shippingAddress: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            country,
            state: state.trim(),
            city: city.trim(),
            address1: address1.trim(),
            address2: address2.trim() || undefined,
            postalCode: postalCode.trim(),
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || "Checkout failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-neutral-500 mb-6">Add some products to your cart before checking out.</p>
        <Link href="/products"><button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Shop Products</button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:grid lg:grid-cols-5 lg:gap-8">
        {/* Left: Checkout Form */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <Link href="/cart" className="text-sm text-primary-600 hover:underline">&larr; Back to Cart</Link>
            <h1 className="text-2xl font-heading font-bold mt-2">Checkout</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Contact */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-lg mb-4">Contact</h2>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">First Name *</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name *</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Country *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">State / Province *</label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="California"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">City *</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="Los Angeles"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Address Line 1 *</label>
                <input
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Address Line 2 (optional)</label>
                <input
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Apt, Suite, Unit"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">ZIP / Postal Code *</label>
                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="90001"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-2 mt-6 lg:mt-0">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <p className="text-sm text-neutral-500 mb-4">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 relative flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-neutral-800">{item.name}</p>
                    <p className="text-neutral-400">Qty: {item.quantity}</p>
                    <p className="font-medium">${Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">${Number(total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-neutral-500">{total >= 50 ? "Free" : "Calculated at payment"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax</span>
                <span className="text-neutral-500">$0.00</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 mt-4 pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${Number(total).toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-neutral-200">
              <span className="text-xs text-neutral-500">Secure Checkout</span>
              <span className="text-[10px] text-neutral-400">SSL Encrypted</span>
            </div>
            <p className="text-xs text-neutral-500 text-center mt-2">No account needed &middot; Guest checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
