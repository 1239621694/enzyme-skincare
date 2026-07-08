# Admin 后台页面修复指令

## 问题

所有后台页面（orders, products, referrals, reviews, reports, analytics）在访问时抛出 500 错误，因为它们的代码直接调用了 `prisma.xxx()` 数据库查询，而当前数据库连接不稳定，导致页面崩溃。

唯一正常的是 `/admin/coupons`（优惠券），因为我已经把它改成了不依赖数据库的静态数据。

## 修复要求

对以下所有页面做同样操作：在 `page.tsx` 中用 `try/catch` 包裹数据库查询，查询失败时不抛出错误，而是显示空数据 + 友好提示。

---

### 文件 1：`src/app/admin/orders/page.tsx`

在开头加 `export const dynamic = "force-dynamic"`（如果还没有的话）。

修改数据获取部分：

```typescript
let orders: any[] = [];
try {
  orders = await prisma.order.findMany({ 
    include: { items: true }, 
    orderBy: { createdAt: "desc" } 
  });
} catch (e) {
  console.error("Failed to load orders:", e);
}
```

表格下方，如果 orders 长度为 0，显示 "No orders yet"。

不要用任何未定义的数据（如 o.items.length 要判断 items 是否存在）。

---

### 文件 2：`src/app/admin/products/page.tsx`

相同的 try/catch 模式：

```typescript
let products: any[] = [];
try {
  products = await prisma.product.findMany({ 
    where: { isActive: true }, 
    orderBy: { updatedAt: "desc" } 
  });
} catch (e) {
  console.error("Failed to load products:", e);
}
```

---

### 文件 3：`src/app/admin/referrals/page.tsx`

```typescript
let referrals: any[] = [];
try {
  referrals = await prisma.referral.findMany({ 
    orderBy: { createdAt: "desc" } 
  });
} catch (e) {
  console.error("Failed to load referrals:", e);
}
```

---

### 文件 4：`src/app/admin/reviews/page.tsx`

```typescript
let reviews: any[] = [];
try {
  reviews = await prisma.review.findMany({ 
    orderBy: { createdAt: "desc" } 
  });
} catch (e) {
  console.error("Failed to load reviews:", e);
}
```

---

### 文件 5：`src/app/admin/reports/page.tsx`

这个页面有多个数据库查询，全部用 try/catch 包裹：

```typescript
let reportData: any = { revenue: 0, coupon: [], marketing: [] };
try {
  const [revenue, couponData, marketingData] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.coupon.findMany({ include: { usages: true } }),
    prisma.marketingEvent.groupBy({ by: ["utmSource"], _count: true }),
  ]);
  reportData = { revenue: revenue._sum.total ?? 0, coupon: couponData, marketing: marketingData };
} catch (e) {
  console.error("Failed to load reports:", e);
}
```

---

### 文件 6：`src/app/admin/analytics/page.tsx`

```typescript
let stats: any = { orders: 0, products: 0, revenue: 0 };
try {
  const [orders, products, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);
  stats = { orders, products, revenue: revenue._sum.total ?? 0 };
} catch (e) {
  console.error("Failed to load analytics:", e);
}
```

---

## 每个页面的共同要求

1. 所有 Prisma 查询包裹在 `try/catch` 中
2. 数据库错误时显示空数据，不抛 500 错误
3. 数据为空时显示 "No items yet" 或 "暂无数据" 的提示
4. `export const dynamic = "force-dynamic"` 在文件顶部

## 验证

```bash
npm run build
# 确保无编译错误
```
