import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata: Metadata = { title: "Rewards Program — Enzyme Skincare" };

export default function RewardsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14 space-y-8">
      <h1 className="text-3xl font-heading font-bold text-neutral-800">✨ Rewards Program</h1>
      <p className="text-neutral-500">Earn points on every purchase and redeem for discounts.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ["🌱", "Earn", "1 point per $1 spent", "Every purchase earns points automatically"],
          ["🎁", "Redeem", "100 points = $5 off", "Use points at checkout for instant savings"],
          ["👑", "VIP", "500+ points = VIP", "Early access to new products + free gifts"],
        ].map(([icon, title, highlight, desc]) => (
          <div key={title} className="p-6 border border-neutral-200 rounded-xl text-center">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-semibold text-neutral-800 mb-1">{title}</h3>
            <p className="text-primary-600 font-bold text-sm mb-2">{highlight}</p>
            <p className="text-xs text-neutral-500">{desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center pt-4">
        <Link href="/products"><Button size="lg">Start Earning Points</Button></Link>
      </div>
    </div>
  );
}