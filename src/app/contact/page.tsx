"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/business-info";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", orderNumber: "", subject: "", message: "", consent: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) { toast.error("Please agree to the privacy consent."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, subject: formData.subject, message: formData.message }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Message sent successfully! We will respond within 24 hours on business days.");
      setFormData({ name: "", email: "", orderNumber: "", subject: "", message: "", consent: false });
    } catch {
      toast.error("Failed to send message. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-neutral-800 mb-3">Contact {BUSINESS_INFO.storeName}</h1>
        <p className="text-neutral-600 max-w-2xl mb-10">
          Our customer care team is available to assist with product information, order support, shipping, returns and skincare questions.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <Input label="Email *" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <Input label="Order Number (optional)" value={formData.orderNumber} onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })} />
              <Input label="Subject *" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Message *</label>
                <textarea rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
              <label className="flex items-start gap-2 text-sm text-neutral-600">
                <input type="checkbox" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} className="mt-0.5" />
                <span>By submitting this form, you agree that we may use your information to respond to your request in accordance with our <Link href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</Link>.</span>
              </label>
              <Button type="submit" loading={loading}>Send Message</Button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
              <h2 className="font-semibold text-neutral-800 mb-4">Customer Service</h2>
              <dl className="space-y-3 text-sm text-neutral-600">
                <div><dt className="font-semibold text-neutral-800">Email</dt><dd><a href={`mailto:${BUSINESS_INFO.supportEmail}`} className="text-primary-600 hover:text-primary-700">{BUSINESS_INFO.supportEmail}</a></dd></div>
                <div><dt className="font-semibold text-neutral-800">Phone</dt><dd><a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, "")}`} className="text-primary-600 hover:text-primary-700">{BUSINESS_INFO.phone}</a></dd></div>
                <div><dt className="font-semibold text-neutral-800">Business Hours</dt><dd>{BUSINESS_INFO.businessHours}</dd></div>
                <div><dt className="font-semibold text-neutral-800">Response Time</dt><dd>{BUSINESS_INFO.responseTime}</dd></div>
              </dl>
            </div>

            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
              <h2 className="font-semibold text-neutral-800 mb-2">Legal & Privacy</h2>
              <p className="text-sm text-neutral-600 mb-1">For privacy-related inquiries:</p>
              <a href={`mailto:${BUSINESS_INFO.legalEmail}`} className="text-sm text-primary-600 hover:text-primary-700">{BUSINESS_INFO.legalEmail}</a>
            </div>

            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
              <h2 className="font-semibold text-neutral-800 mb-2">WhatsApp</h2>
              <p className="text-sm text-neutral-600 mb-3">Message us on WhatsApp for quick product inquiries.</p>
              <a href="https://wa.me/8613980551004" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition-colors">Chat on WhatsApp</a>
            </div>

            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
              <h2 className="font-semibold text-neutral-800 mb-2">Company</h2>
              <p className="text-sm text-neutral-600">{BUSINESS_INFO.storeName} is operated by {BUSINESS_INFO.legalNameEN}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
