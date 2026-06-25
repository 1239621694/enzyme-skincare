import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Confirmed — Enzyme Skincare" };

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  if (!params.session_id) redirect("/products");

  const order = await prisma.order.findFirst({
    where: { stripeSessionId: params.session_id },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 className="font-heading text-2xl font-bold text-neutral-800 mb-2">Thank You for Your Order!</h1>
      {order && order.orderNumber && <p className="text-sm text-neutral-500 mb-4">Order #{order.orderNumber}</p>}
      <p className="text-neutral-500 mb-6">A confirmation email will be sent to your email shortly.</p>
      {order && (
        <div className="border border-neutral-200 rounded-xl p-4 mb-6 text-left text-sm">
          <h3 className="font-semibold text-neutral-800 mb-3">Order Summary</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-neutral-600">{item.product?.name ?? "Product"} x{item.quantity}</span>
                <span className="font-medium">${Number(item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-200 mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
          </div>
          <p className="text-xs text-green-600 mt-2">Status: {order.status}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/products"><Button size="lg">Continue Shopping</Button></Link>
        <Link href="/account/orders"><Button size="lg" variant="outline">View Orders</Button></Link>
      </div>
    </div>
  );
}