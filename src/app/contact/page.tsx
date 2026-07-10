"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto lg:grid lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-3">
          <h1 className="font-heading text-3xl font-bold text-neutral-800">Contact Us</h1>
          <p className="mt-2 text-neutral-500">We would love to hear from you.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Email *" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Message *</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <Button type="submit" loading={loading}>Send Message</Button>
          </form>
        </div>
        <div className="lg:col-span-2 mt-8 lg:mt-0 space-y-6">
          <div className="p-6 bg-neutral-50 rounded-xl">
            <h2 className="font-semibold text-neutral-800 mb-4">Contact Information</h2>
            <div className="space-y-3 text-sm text-neutral-600">
              <p><strong>Email:</strong> tkyds888@gmail.com</p>
              <p><strong>Phone:</strong> +86 13980551004</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}