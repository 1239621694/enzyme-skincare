# XTransfer 支付对接 — Codex 执行指令

> 3 个任务，共半天工作量。
> 项目路径：`C:\Users\Administrator\Documents\Codex\2026-06-17\codex-tasks-md-task001-task\enzyme-skincare`

---

## 任务 1：创建下单接口

**文件**：`src/app/api/orders/create/route.ts`（新建）

**代码**：

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { items, email, name, shippingAddress } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    // 计算总价
    const total = items.reduce((sum: number, i: any) => sum + (i.price || 0) * (i.quantity || 1), 0);

    // 生成订单号 ES-YYYYMMDD-NNNN
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const counter = await prisma.orderCounter.upsert({
      where: { date: today },
      update: { sequence: { increment: 1 } },
      create: { date: today, sequence: 1 },
    });
    const orderNumber = "ES-" + today + "-" + String(counter.sequence).padStart(4, "0");

    // 创建订单（状态: pending）
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "pending",
        total,
        email: email ?? null,
        shippingAddress: shippingAddress ?? null,
      },
    });

    // 创建订单项
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId ?? null,
          quantity: item.quantity ?? 1,
          price: item.price ?? 0,
        },
      });
    }

    // XTransfer 付款链接（从环境变量读取）
    const xtransferUrl = process.env.NEXT_PUBLIC_XTRANSFER_URL || "https://www.xtransfer.com/cashier/purchase-order/@mylink/8bc6b9e2cbd54b928a305451da14ac8b";

    return NextResponse.json({
      orderNumber,
      total,
      xtransferUrl: xtransferUrl + "?order=" + orderNumber,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
```

---

## 任务 2：改造 CartSidebar Checkout 按钮

**文件**：`src/components/cart/CartSidebar.tsx`

**找到**（约第 13-25 行）：
```typescript
const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity, variantId: i.variant })) }),
      });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
    } catch {} finally { setLoading(false); }
  };
```

**替换为**：
```typescript
const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, price: i.price, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.xtransferUrl) {
        // 保存订单信息到 localStorage（Thank You 页要用）
        localStorage.setItem("lastOrder", JSON.stringify({
          orderNumber: data.orderNumber,
          total: data.total,
        }));
        // 跳转 XTransfer 付款
        window.location.href = data.xtransferUrl;
      }
    } catch {} finally { setLoading(false); }
  };
```

**同时修改页面底部的支付方式图标**（约第 81-87 行）：

```typescript
{paymentIconsVisible && (
  <div className="flex items-center justify-center gap-3 mt-3">
    <span className="text-xs text-neutral-500">Pay via:</span>
    <span className="text-xs font-semibold text-neutral-500">Bank Transfer</span>
  </div>
)}
```

> 把 Visa/Mastercard/Apple Pay/PayPal 改为 Bank Transfer，因为在用 XTransfer。

---

## 任务 3：新建 Thank You 页面

**文件**：`src/app/order/thankyou/page.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ThankYouPage() {
  const [order, setOrder] = useState<{ orderNumber: string; total: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastOrder");
    if (saved) {
      setOrder(JSON.parse(saved));
      localStorage.removeItem("lastOrder");
    }
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
      {order ? (
        <>
          <p className="text-text-secondary mb-1">Order #{order.orderNumber}</p>
          <p className="text-lg font-semibold mb-6">Total: ${Number(order.total).toFixed(2)}</p>
        </>
      ) : (
        <p className="text-text-secondary mb-6">Your order has been submitted.</p>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6 text-left">
        <h3 className="font-semibold text-amber-800 mb-2">⏳ Payment Pending</h3>
        <ul className="text-sm text-amber-700 space-y-2">
          <li>1. Complete the bank transfer to the account shown on XTransfer</li>
          <li>2. Include your order number as payment reference</li>
          <li>3. Funds arrive in 1-3 business days</li>
          <li>4. We&apos;ll email you once payment is confirmed</li>
        </ul>
      </div>

      <a
        href="https://wa.me/8613980551004?text=Hi! I just placed an order and have a payment question."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors mb-4"
      >
        💬 Chat on WhatsApp
      </a>

      <div>
        <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
```

---

## 任务 4：Admin 订单详情加"确认已付款"按钮

**文件**：`src/app/admin/orders/[id]/page.tsx`

**完整替换为**：

```typescript
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function markAsPaid(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "paid" },
  });
  
  await prisma.orderStatusHistory.create({
    data: { orderId, fromStatus: "pending", toStatus: "paid", note: "Admin confirmed payment" },
  });

  revalidatePath("/admin/orders/" + orderId);
}

export default async function AdminOrderDetailPage({ params }: any) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, statusHistory: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold">Order #{order.orderNumber || id.slice(0, 12)}</h1>

      <div className="rounded-xl border bg-white p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-neutral-500">Status</dt><dd className="font-medium">{order.status}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-500">Total</dt><dd className="font-medium">${Number(order.total).toFixed(2)}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-500">Email</dt><dd>{order.email || "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-500">Date</dt><dd>{new Date(order.createdAt).toLocaleDateString()}</dd></div>
        </dl>
      </div>

      {order.status === "pending" && (
        <form action={markAsPaid} className="mt-4">
          <input type="hidden" name="orderId" value={order.id} />
          <button type="submit" className="w-full px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors">
            ✅ Confirm Payment Received
          </button>
        </form>
      )}

      <div className="mt-4 rounded-xl border bg-white p-6">
        <h2 className="mb-3 font-semibold">Items</h2>
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between border-b py-2 text-sm">
            <span>{i.product?.name || "Product"} x{i.quantity}</span>
            <span>${Number(i.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {order.statusHistory.length > 0 && (
        <div className="mt-4 rounded-xl border bg-white p-6">
          <h2 className="mb-3 font-semibold">Status History</h2>
          {order.statusHistory.map((h) => (
            <div key={h.id} className="flex justify-between text-sm text-neutral-500 py-1 border-b last:border-0">
              <span>{h.fromStatus} → {h.toStatus}</span>
              <span>{new Date(h.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 任务 5：添加环境变量

**文件**：`.env.local`

**添加**：
```
NEXT_PUBLIC_XTRANSFER_URL=https://www.xtransfer.com/cashier/purchase-order/@mylink/8bc6b9e2cbd54b928a305451da14ac8b
```

---

## 验证

```bash
npm run build
```

确认无报错后：

1. 打开网站 → 加购 → 点 Checkout
2. 应跳转到 XTransfer 付款页
3. 手动改 URL 为 `/order/thankyou` → 看 Thank You 页显示正常
4. 登录 Admin → 找这条订单 → 点"Confirm Payment Received" → 状态变为 paid
