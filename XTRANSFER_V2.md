# XTransfer Payment Integration — 最终执行方案 (V2)

**目标**：抛弃 Stripe，纯 XTransfer，实现"看起来像自动支付"的电商体验

---

## 一、整体流程

```
[网站]                             [XTransfer]                      [你]
  │                                    │                             │
  │ 1. 用户下单                        │                             │
  │ 订单状态: pending                  │                             │
  │ 生成 orderId: ES-20260622-0001     │                             │
  │                                    │                             │
  │ 2. 跳转 XTransfer 付款页           │                             │
  │ ──────────────────────────────────→│                             │
  │ https://pay.xtransfer.com/         │                             │
  │ invoice/xxx?order=ES-20260622-0001 │                             │
  │                                    │                             │
  │ 3. 用户付款（银行转账）             │                             │
  │                                    │                             │
  │ 4. 跳回 /order/thankyou            │                             │
  │◄───────────────────────────────────│                             │
  │                                    │                             │
  │ 5. 显示"支付成功，等待确认"         │                             │
  │                                    │                             │
  │                                    │  6. 你在 XTransfer 后台     │
  │                                    │     看到钱到账              │
  │                                    │                             │
  │                                    │  7. 你在 Admin 后台         │
  │                                    │     点"确认付款"            │
  │                                    │                             │
  │ 8. 用户收到确认邮件                │                             │
  │◄───────────────────────────────────│                             │
```

**自动化程度**：人工确认付款（XTransfer 不支持自动回调），但网站流程全自动。

---

## 二、你网站要改的东西（总共 4 个文件）

### 改动 1：下单接口 — `src/app/api/orders/create/route.ts`

```typescript
// 用户点击 Place Order → 这个接口被调用
export async function POST(req) {
  const { items, email, shippingAddress } = await req.json()

  // 1. 生成订单号
  const orderNumber = "ES-" + getToday() + "-" + getSeq()

  // 2. 存数据库（状态: pending）
  await prisma.order.create({
    data: {
      orderNumber,
      email,
      total: calculatedTotal,
      status: "PENDING",
      // ... 其他字段
    }
  })

  // 3. 返回订单信息和 XTransfer 付款链接（你手动配置的固定链接）
  return {
    orderNumber,
    xtransferUrl: "https://pay.xtransfer.com/invoice/xxx",  // 这个你从 XTransfer 后台拿到
    total: calculatedTotal
  }
}
```

### 改动 2：Checkout 页 — 前端跳转

**在 `src/components/cart/CartSidebar.tsx` 里改 Checkout 按钮**：

```tsx
const handleCheckout = async () => {
  // 1. 调你的下单接口
  const res = await fetch("/api/orders/create", {
    method: "POST",
    body: JSON.stringify({
      items: cartItems,
      email: userEmail,
      shippingAddress: address,
    }),
  })
  const { orderNumber, xtransferUrl } = await res.json()

  // 2. 存到 localStorage（Thank You 页要用）
  localStorage.setItem("lastOrder", JSON.stringify({ orderNumber, total }))

  // 3. 跳转 XTransfer
  window.location.href = `${xtransferUrl}?order=${orderNumber}`
}
```

### 改动 3：Thank You 页 — 新建 `src/app/order/thankyou/page.tsx`

```tsx
// 用户从 XTransfer 跳回来后看到这个页面
export default function ThankYouPage() {
  // 从 localStorage 读取订单信息
  const order = JSON.parse(localStorage.getItem("lastOrder"))

  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
      <p>Order #: {order.orderNumber}</p>
      <p>Total: ${order.total}</p>

      <div className="mt-8 p-6 bg-amber-50 rounded-lg max-w-md mx-auto">
        <h3>⏳ Payment Pending</h3>
        <p className="text-sm">
          We'll confirm your payment within 1-3 business days after the
          funds arrive. You'll receive an email confirmation.
        </p>
      </div>

      <div className="mt-6">
        <a
          href="https://wa.me/8613980551004"
          target="_blank"
          className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg"
        >
          💬 Questions? Chat on WhatsApp
        </a>
      </div>
    </div>
  )
}
```

### 改动 4：Admin 确认页 — 在 `src/app/admin/orders/[id]/page.tsx`

```tsx
// 在订单详情页加一个 "Mark as Paid" 按钮
export default function AdminOrderDetail({ params }) {
  const order = await getOrder(params.id)

  const handleMarkPaid = async () => {
    await fetch(`/api/admin/orders/${order.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "PAID" }),
    })
    // 自动发送邮件
    await fetch("/api/email/send-confirmation", {
      method: "POST",
      body: JSON.stringify({ orderId: order.id }),
    })
    router.refresh()
  }

  return (
    <div>
      <h1>Order {order.orderNumber}</h1>
      <p>Status: {order.status}</p>
      <p>Total: ${order.total}</p>
      <p>Email: {order.email}</p>
      <p>Items: {order.items.map(i => i.name).join(", ")}</p>

      {order.status === "PENDING" && (
        <button
          onClick={handleMarkPaid}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
        >
          ✅ Confirm Payment Received
        </button>
      )}
    </div>
  )
}
```

---

## 三、你要手动做的事（开发之外）

| # | 操作 | 说明 |
|---|------|------|
| 1 | XTransfer 注册认证 | 营业执照 + 法人信息，3-5 天 |
| 2 | 创建收款链接模板 | 在 XTransfer 后台生成一个固定 Invoice 链接 |
| 3 | 告诉 XTransfer 客服你需要 API | 问他们要商户 API 密钥（如果有） |
| 4 | 把链接粘贴到代码 | `xtransferUrl` 配置到 `.env.local` |

---

## 四、给 Codex 的开发任务（共 3 个）

### Task 1：下单 API

```markdown
## TASK：创建订单接口

**文件**：src/app/api/orders/create/route.ts（新建）

**做什么**：
1. POST 接收：items, email, shippingAddress
2. 计算总价
3. 生成订单号 ES-YYYYMMDD-NNNN
4. 存入 orders 表（status: PENDING）
5. 返回：{ orderNumber, total, xtransferUrl }

**从 .env 读取 xtransferUrl**
NEXT_PUBLIC_XTRANSFER_URL=https://pay.xtransfer.com/invoice/xxx
```

### Task 2：Checkout 改造 + Thank You 页

```markdown
## TASK：下单跳转 + Thank You 页

**文件**：
- src/components/cart/CartSidebar.tsx（改 Checkout 按钮）
- src/app/order/thankyou/page.tsx（新建）

**CartSidebar 改动**：
- Checkout 按钮调 /api/orders/create
- 拿到 orderNumber 和 xtransferUrl
- localStorage.setItem("lastOrder", ...)
- window.location.href = xtransferUrl + "?order=" + orderNumber

**Thank You 页**：
- 从 localStorage 读订单信息
- 显示订单号、金额
- "Payment Pending" 提示
- WhatsApp 支持按钮
```

### Task 3：Admin 确认支付按钮

```markdown
## TASK：Admin 手动确认支付

**文件**：
- src/app/admin/orders/[id]/page.tsx（改）

**改动**：
- 在 order.status === "PENDING" 时显示 "Confirm Payment Received" 按钮
- 点击 → PATCH /api/admin/orders/[id]/status { status: "PAID" }
- 自动调用 sendConfirmationEmail(order)
- 成功后刷新页面，按钮消失

**邮件发送**：
- 在 /api/email/send-confirmation 里用 Resend
- 主题："Order ES-xxx Confirmed! ✅"
- 内容：订单号、金额、谢谢
```

---

## 五、最终效果

```
用户端感受：
下单 → 跳转到 XTransfer → 转账 → 跳回网站 Thank You 页

你这边：
收到银行到账 → 打开 Admin → 点"确认" → 自动发邮件

总共 3 个开发任务，半天搞定。
```

## 六、如果你以后想升级

```text
第 1 阶段（你现在）：手动确认（0.5 天）
第 2 阶段（1 个月后）：如果 XTransfer 有 API 回调，加上自动确认
第 3 阶段（3 个月后）：交易量大了再考虑 Stripe/PayPal
```
