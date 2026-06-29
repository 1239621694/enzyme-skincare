# Codex 执行总纲 — 支付系统全流程实现

> 本文档是 Codex 执行的**唯一主计划**。
> 所有任务按 Sprint 和 Task 顺序执行，每个 Task 独立可验证。
> 总耗时预估：6-8 小时（4 个 Sprint）

---

## Sprint 1：数据库层 — Order + Payment 模型

### Task 1.1：创建 Order + Payment 数据模型

**优先级**：P0（必须先做）  
**估时**：40 分钟  
**影响范围**：`prisma/schema.prisma`

**要求**：

在 `prisma/schema.prisma` 中新增以下 4 个模型：

**1. Order 模型**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String @id @default(uuid()) | 主键 |
| orderNumber | String @unique | 格式：ORD-20260629-NNNN |
| customerEmail | String | 客户邮箱 |
| customerName | String | 客户姓名 |
| customerPhone | String? | 客户电话 |
| subtotal | Decimal | 小计 |
| shippingFee | Decimal | 运费 |
| tax | Decimal | 税费 |
| total | Decimal | 总计 |
| currency | String @default("USD") | 币种 |
| status | OrderStatus @default(PENDING_PAYMENT) | 订单状态 |
| shippingName | String | 收货人姓名 |
| shippingPhone | String | 收货人电话 |
| shippingAddress1 | String | 收货地址 1 |
| shippingAddress2 | String? | 收货地址 2 |
| shippingCity | String | 城市 |
| shippingProvince | String | 省份 |
| shippingPostal | String | 邮编 |
| shippingCountry | String | 国家 |
| customerNote | String? | 客户备注 |
| adminNote | String? | 管理员备注 |
| paidAt | DateTime? | 付款时间 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |
| items | OrderItem[] | 关联订单项 |
| payments | Payment[] | 关联支付 |
| auditLogs | OrderAuditLog[] | 关联操作日志 |

**2. OrderItem 模型（订单快照）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String @id | 主键 |
| orderId | String | 关联 Order |
| productId | String | 产品 ID |
| productName | String | 产品名（快照） |
| productSlug | String | 产品 slug（快照） |
| productImage | String | 产品图片（快照） |
| variantId | String? | 变体 ID |
| variantName | String? | 变体名 |
| quantity | Int | 数量 |
| unitPrice | Decimal | 单价 |
| subtotal | Decimal | 小计 |

**3. Payment 模型（支付记录）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String @id | 主键 |
| orderId | String | 关联 Order |
| provider | PaymentProvider | 支付提供商 |
| providerMetadata | Json? | 提供商元数据 |
| amount | Decimal | 金额 |
| currency | String | 币种 |
| status | PaymentStatus @default(PENDING) | 支付状态 |
| confirmedBy | String? | 确认人 |
| confirmedNote | String? | 确认备注 |
| completedAt | DateTime? | 完成时间 |
| createdAt | DateTime | 创建时间 |

**4. OrderAuditLog 模型（操作日志）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String @id | 主键 |
| orderId | String | 关联 Order |
| action | String | 操作类型 |
| performedBy | String? | 操作人 |
| previousStatus | String? | 前状态 |
| newStatus | String? | 新状态 |
| metadata | Json? | 元数据 |
| createdAt | DateTime | 创建时间 |

**5. OrderCounter 模型（订单号计数器）**

| 字段 | 类型 | 说明 |
|------|------|------|
| date | String @id | 日期 YYYYMMDD |
| sequence | Int | 当日序号 |

**6. AdminUser 模型（管理员）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String @id | 主键 |
| email | String @unique | 邮箱 |
| password | String | 密码哈希 |
| name | String | 姓名 |
| role | AdminRole @default(OPERATOR) | 角色 |
| createdAt | DateTime | 创建时间 |

**7. 枚举定义**

```prisma
enum OrderStatus {
  PENDING_PAYMENT
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentProvider {
  XTRANSFER
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
  REFUNDED
}

enum AdminRole {
  ADMIN
  OPERATOR
  VIEWER
}
```

**8. 索引要求**

- Order：`@@index([status, createdAt])`
- Order：`@@index([customerEmail])`
- Payment：`@@index([orderId])`
- Payment：`@@index([status])`
- OrderAuditLog：`@@index([orderId, createdAt])`

**验证标准**：
- [ ] `npx prisma generate` 成功
- [ ] 新模型在 Prisma Studio 可见
- [ ] 旧数据不受影响

---

### Task 1.2：创建 Prisma Migration

**优先级**：P0  
**估时**：20 分钟  
**影响范围**：`prisma/migrations/`

**要求**：

```bash
# 创建迁移
npx prisma migrate dev --name add_order_payment_models

# 应用到数据库
npx prisma db push
```

**验证标准**：
- [ ] `npx prisma migrate dev` 成功
- [ ] 数据库中可见 orders, order_items, payments, order_audit_logs, admin_users 表
- [ ] 表结构与 schema 一致

---

## Sprint 2：API + 业务逻辑层

### Task 2.1：创建 Checkout API

**优先级**：P0  
**估时**：60 分钟  
**影响范围**：`src/app/api/checkout/route.ts`（新建）

**要求**：

**1. POST /api/checkout**

接收客户端购物车数据，创建 Order。

**输入**：
```json
{
  "items": [{ "productId": "protease-renewal-kit", "variantId": null, "quantity": 1 }],
  "customerEmail": "customer@example.com",
  "customerName": "张三",
  "customerPhone": "+86 138 0000 0000",
  "shippingAddress": {
    "name": "张三", "phone": "+86 138 0000 0000",
    "address1": "北京市朝阳区某某路 123 号",
    "city": "北京市", "province": "北京",
    "postal": "100000", "country": "CN"
  }
}
```

**处理逻辑**：
1. 验证所有必填字段
2. 查询产品是否存在、库存是否足够
3. 计算金额（从数据库取价格，不接受客户端价格）
4. 生成订单号（ORD-YYYYMMDD-NNNN）
5. 创建 Order + OrderItem 记录
6. 创建 OrderAuditLog（ORDER_CREATED）
7. 生成 accessToken 用于客户访问
8. 返回订单 ID、订单号、总金额

**输出**：
```json
{
  "success": true,
  "orderId": "uuid",
  "orderNumber": "ORD-20260629-0001",
  "total": 100.00,
  "redirectUrl": "/orders/uuid"
}
```

**验证标准**：
- [ ] `curl -X POST /api/checkout` 返回 200
- [ ] 数据库中 Order 记录创建成功
- [ ] OrderItem 记录正确
- [ ] OrderAuditLog 记录创建
- [ ] 缺少必填字段返回 400

---

### Task 2.2：创建 Customer 订单查询 API

**优先级**：P1  
**估时**：30 分钟  
**影响范围**：`src/app/api/orders/[orderId]/route.ts`（新建）

**要求**：

**GET /api/orders/{orderId}?token={accessToken}**

**处理逻辑**：
1. 验证 accessToken
2. 查询订单信息（关联 items, payments）
3. 只返回当前客户的数据

**输出**：
```json
{
  "id": "uuid",
  "orderNumber": "ORD-20260629-0001",
  "status": "PENDING_PAYMENT",
  "total": 100.00,
  "currency": "CNY",
  "items": [{ "productName": "活性蛋白酶抗皱焕肤套盒", "quantity": 1, "unitPrice": 100.00 }],
  "shippingAddress": { "name": "张三", "address1": "..." },
  "payment": { "provider": "XTRANSFER", "status": "PENDING", "invoiceUrl": "https://..." },
  "createdAt": "2026-06-29T10:00:00Z"
}
```

**验证标准**：
- [ ] 正确 token 返回订单数据
- [ ] 错误 token 返回 401
- [ ] 订单数据包含 items 和 payment

---

### Task 2.3：创建 Customer Order 页面

**优先级**：P1  
**估时**：30 分钟  
**影响范围**：`src/app/orders/[orderId]/page.tsx`（新建目录和文件）

**要求**：

新建客户订单详情页面，路径为 `/orders/{orderId}?token={token}`。

**页面内容**：
1. 订单号
2. 订单状态（带颜色标签）
3. 产品列表（名称、数量、单价、小计）
4. 总计
5. 收货地址
6. 如果有支付链接 → 显示 [通过 XTransfer 付款] 按钮（链接到 Invoice URL）
7. 付款说明文案

**支付按钮行为**：
- 如果 `payment.status === "PENDING"` 且 `payment.providerMetadata.invoiceUrl` 存在
  - 显示绿色 [通过 XTransfer 付款] 按钮
  - 点击后在新标签页打开 invoiceUrl
- 如果 `payment.status === "COMPLETED"`
  - 显示"已付款"状态
- 如果无 payment
  - 显示"等待管理员添加支付方式"

**付款说明文案**（当 PENDING 且有链接时）：
```
1. 点击上方按钮跳转到 XTransfer 付款页面
2. 根据页面提示完成银行转账
3. 转账时请备注订单号：ORD-20260629-0001
4. 转账完成后请等待管理员确认（通常 1-3 个工作日）
5. 如有疑问，请联系客服
```

**验证标准**：
- [ ] 访问 `/orders/{orderId}?token=xxx` 显示订单详情
- [ ] 订单状态正确显示
- [ ] 有支付链接时按钮可点击
- [ ] 无支付链接时显示等待提示
- [ ] 移动端响应式正常

---

### Task 2.4：创建 Admin 订单列表 API

**优先级**：P1  
**估时**：30 分钟  
**影响范围**：`src/app/api/admin/orders/route.ts`（新建）

**要求**：

**GET /api/admin/orders**

**查询参数**：
- `status`：按状态筛选
- `page`：页码（默认 1）
- `limit`：每页条数（默认 20）
- `sortBy`：排序字段（createdAt / total）
- `sortOrder`：排序方向（asc / desc）

**输出**：
```json
{
  "orders": [{
    "id": "uuid",
    "orderNumber": "ORD-20260629-0001",
    "customerName": "张三",
    "customerEmail": "customer@example.com",
    "total": 100.00,
    "status": "PENDING_PAYMENT",
    "createdAt": "2026-06-29T10:00:00Z"
  }],
  "pagination": {
    "total": 100, "page": 1, "limit": 20, "totalPages": 5
  }
}
```

**验证标准**：
- [ ] 返回分页订单列表
- [ ] 筛选功能正常
- [ ] 排序功能正常

---

### Task 2.5：创建 Admin 订单详情 API

**优先级**：P1  
**估时**：20 分钟  
**影响范围**：`src/app/api/admin/orders/[orderId]/route.ts`（新建）

**要求**：

**GET /api/admin/orders/{orderId}**

返回完整的订单详情，包括：
- 客户信息
- 收货地址
- 订单项
- 支付历史
- 操作日志

**验证标准**：
- [ ] 返回所有关联数据
- [ ] 错误的 orderId 返回 404

---

### Task 2.6：创建 Admin 附加支付链接 API

**优先级**：P1  
**估时**：30 分钟  
**影响范围**：`src/app/api/admin/orders/[orderId]/payments/route.ts`（新建目录和文件）

**要求**：

**POST /api/admin/orders/{orderId}/payments**

**输入**：
```json
{
  "provider": "XTRANSFER",
  "invoiceUrl": "https://xtransfer.com/invoice/xyz",
  "amount": 100.00,
  "currency": "CNY"
}
```

**处理逻辑**：
1. 验证订单状态为 PENDING_PAYMENT
2. 验证金额与订单 total 一致
3. 创建 Payment 记录（status: PENDING）
4. 创建 OrderAuditLog（PAYMENT_ATTACHED）
5. 返回 paymentId

**验证标准**：
- [ ] 正常情况返回 200 + paymentId
- [ ] 订单非 PENDING_PAYMENT 返回 400
- [ ] 金额不一致返回 400

---

### Task 2.7：创建 Admin 确认付款 API

**优先级**：P1  
**估时**：20 分钟  
**影响范围**：`src/app/api/admin/payments/[paymentId]/confirm/route.ts`（新建目录和文件）

**要求**：

**POST /api/admin/payments/{paymentId}/confirm**

**输入**：
```json
{
  "note": "已确认到账，交易号 TX123456"
}
```

**处理逻辑**：
1. 验证 Payment 状态为 PENDING
2. 更新 Payment 状态为 COMPLETED
3. 更新 Order 状态为 PAID
4. 设置 Order.paidAt
5. 创建 OrderAuditLog（PAYMENT_CONFIRMED）
6. 触发确认邮件发送（Task 4.1）

**验证标准**：
- [ ] 正常情况返回 200
- [ ] Payment 状态变为 COMPLETED
- [ ] Order 状态变为 PAID
- [ ] 非 PENDING 状态的 Payment 返回 400

---

### Task 2.8：创建 Admin 取消订单 API

**优先级**：P2  
**估时**：15 分钟  
**影响范围**：`src/app/api/admin/orders/[orderId]/cancel/route.ts`（新建）

**要求**：

**POST /api/admin/orders/{orderId}/cancel**

**输入**：
```json
{ "reason": "客户要求取消" }
```

**处理逻辑**：
1. 验证 Order 状态允许取消
2. 更新 Order 状态为 CANCELLED
3. 更新关联 Payment 状态为 CANCELLED（如果有）
4. 创建 OrderAuditLog

**可取消状态**：PENDING_PAYMENT, PAID

**验证标准**：
- [ ] 正常取消成功
- [ ] 已发货订单不可取消

---

### Task 2.9：创建 Admin 标记发货 API

**优先级**：P2  
**估时**：15 分钟  
**影响范围**：`src/app/api/admin/orders/[orderId]/ship/route.ts`（新建目录和文件）

**要求**：

**POST /api/admin/orders/{orderId}/ship**

**输入**：
```json
{
  "trackingNumber": "SF1234567890",
  "shippingCompany": "顺丰速运"
}
```

**处理逻辑**：
1. 验证 Order 状态为 PAID 或 PROCESSING
2. 更新 Order 状态为 SHIPPED
3. 创建 OrderAuditLog

**验证标准**：
- [ ] 正常发货成功
- [ ] 非 PAID 状态的订单不可发货

---

## Sprint 3：管理后台前端

### Task 3.1：Admin 登录页面

**优先级**：P1  
**估时**：30 分钟  
**影响范围**：
- `src/app/admin/login/page.tsx`（新建）
- `src/app/api/admin/auth/login/route.ts`（新建）

**要求**：

**登录页面**：
- 邮箱 + 密码表单
- 提交后 POST `/api/admin/auth/login`
- 成功后跳转到 `/admin/dashboard`

**API**：
- POST `/api/admin/auth/login`
- 验证邮箱密码
- 设置 session cookie（HTTP-only, Secure, SameSite=Lax）
- 24 小时有效期

**验证标准**：
- [ ] 登录页面正常显示
- [ ] 正确凭据登录成功
- [ ] 错误凭据返回 401
- [ ] Session 持久化

---

### Task 3.2：Admin Dashboard 布局

**优先级**：P1  
**估时**：30 分钟  
**影响范围**：
- `src/app/admin/layout.tsx`（新建）
- `src/app/admin/dashboard/page.tsx`（新建）

**要求**：

**布局**：
- 左侧边栏导航
- 顶部 header（管理员信息 + 退出按钮）
- 右侧内容区

**侧边栏菜单**：
- 📊 总览
- 📋 订单管理
- 💳 支付记录
- ⚙️ 设置

**Dashboard 总览页**：
- 今日订单数
- 待处理订单数（PENDING_PAYMENT）
- 今日销售额
- 本月销售额
- 最近 7 天订单趋势（简单柱状图，可用纯 CSS）
- 待确认付款订单列表（最近的 5 条，每条有快捷操作）

**验证标准**：
- [ ] 布局正常显示
- [ ] 未登录跳转到 /admin/login
- [ ] 统计数据正确显示

---

### Task 3.3：Admin 订单列表页

**优先级**：P1  
**估时**：45 分钟  
**影响范围**：`src/app/admin/orders/page.tsx`（新建）

**要求**：

**订单列表**（Table 组件）：
| 列 | 说明 |
|------|------|
| 订单号 | 可点击，跳转详情 |
| 客户 | 姓名 + 邮箱 |
| 金额 | ¥ 100.00 |
| 状态 | 彩色 Badge |
| 创建时间 | |
| 操作 | [查看详情] |

**状态颜色**：
- PENDING_PAYMENT：🔵 蓝色
- PAID：🟢 绿色
- PROCESSING：🟡 黄色
- SHIPPED：🟣 紫色
- DELIVERED：⚪ 灰色
- CANCELLED：🔴 红色
- REFUNDED：⭕ 空心红

**筛选器**：
- 状态下拉
- 日期范围（未来）

**分页**：
- 每页 20 条
- 页码导航

**验证标准**：
- [ ] 订单列表正确显示
- [ ] 状态筛选正常
- [ ] 分页正常
- [ ] 移动端响应式

---

### Task 3.4：Admin 订单详情页

**优先级**：P1  
**估时**：60 分钟  
**影响范围**：`src/app/admin/orders/[orderId]/page.tsx`（新建）

**要求**：

**页面分为以下卡片区域**：

**卡片 1：基本信息**
- 订单号 （大字）
- 状态 Badge
- 创建时间

**卡片 2：客户信息**
- 姓名 ｜ 邮箱 ｜ 电话

**卡片 3：收货地址**
- 完整地址格式化显示

**卡片 4：商品信息**
- Table：产品名 | 变体 | 数量 | 单价 | 小计
- 底部：小计 + 运费 + 总计

**卡片 5：支付信息**
- 当前支付方式
- 支付状态
- Invoice URL（可点击）
- 确认人（如果有）
- 确认备注（如果有）

**卡片 6：操作按钮**

根据当前状态显示不同的操作按钮：

| 当前状态 | 可用操作 |
|---------|---------|
| PENDING_PAYMENT | [附加支付链接] [取消订单] |
| PAID | [标记处理中] [标记发货] [退款] |
| PROCESSING | [标记发货] |
| SHIPPED | [标记已送达] |

**按钮详情**：

**1. [附加支付链接]**
- 弹出 Modal
- 选择支付提供商（目前仅 XTransfer）
- 输入 Invoice URL
- 确认后调用 Task 2.6 的 API

**2. [确认付款]**
- 与附加支付链接整合在 Modal 中
- 或者单独步骤

**3. [标记发货]**
- 弹出 Modal
- 输入物流公司 + 物流单号
- 确认后调用 Task 2.9 的 API

**4. [取消订单]**
- 弹出确认对话框
- 输入取消原因
- 确认后调用 Task 2.8 的 API

**卡片 7：操作历史**
- 按时间倒序排列
- 每条显示：操作类型 | 操作人 | 时间 | 备注

**验证标准**：
- [ ] 所有卡片正常显示
- [ ] 操作按钮按状态正确显示/隐藏
- [ ] [附加支付链接] Modal 正常
- [ ] [确认付款] 操作正常
- [ ] 操作历史列表显示
- [ ] 不支持的状态转换不显示按钮

---

### Task 3.5：Admin Middleware 权限控制

**优先级**：P1  
**估时**：20 分钟  
**影响范围**：
- `src/middleware.ts`（新建）

**要求**：

**中间件处理逻辑**：
1. `/admin/*` 路径 → 检查 session cookie
2. 无 session → 重定向到 `/admin/login`
3. `/admin/login` → 放行
4. 其他路径 → 放行

**session cookie**：
- name: `admin_session`
- HTTP-only
- Secure（生产环境）
- SameSite: Lax

**验证标准**：
- [ ] 未登录访问 `/admin/` → 跳转 `/admin/login`
- [ ] 已登录访问 `/admin/` → 正常显示
- [ ] `/admin/login` 不受限制

---

## Sprint 4：邮件 + 基础设施

### Task 4.1：创建确认邮件发送函数

**优先级**：P2  
**估时**：30 分钟  
**影响范围**：`src/lib/email/sendOrderConfirmation.ts`（新建）

**要求**：

**发送时机**：
- 管理员确认付款后（Task 2.7）
- 管理员标记发货后（Task 2.9）

**邮件内容**：
- 收件人：customerEmail
- 主题前缀：[酶护肤] 订单 XXX 已确认

**HTML 邮件模板**：
```
┌─────────────────────────────────┐
│  ✨ Enzyme Skincare             │
│                                 │
│  感谢您的购买！                   │
│                                 │
│  订单号：ORD-20260629-0001      │
│  订单金额：¥100.00              │
│                                 │
│  ─── 商品列表 ───               │
│  活性蛋白酶抗皱焕肤套盒  x1      │
│  ...                            │
│  ─────────────────────          │
│                                 │
│  收货地址：                      │
│  张三 ｜ 电话                    │
│  地址                         │
│                                 │
│  如有疑问请联系微信客服           │
│                                 │
│  祝您使用愉快！                  │
└─────────────────────────────────┘
```

**技术要求**：
- 使用 Resend SDK（已在项目依赖中）
- 包裹在 try/catch 中
- 邮件发送失败不阻塞主流程
- 发送失败记录日志

**验证标准**：
- [ ] 发送函数可调用
- [ ] 邮件内容正确
- [ ] 失败不影响主流程

---

### Task 4.2：在确认付款 API 中集成邮件

**优先级**：P2  
**估时**：15 分钟  
**影响范围**：`src/app/api/admin/payments/[paymentId]/confirm/route.ts`

**要求**：

在 Task 2.7 的确认付款 API 中，在更新订单状态后调用 Task 4.1 的邮件函数。

**注意**：邮件发送失败不要影响订单状态更新。

**验证标准**：
- [ ] 确认付款后自动触发邮件发送
- [ ] 邮件发送失败订单状态不受影响

---

### Task 4.3：在标记发货 API 中集成邮件

**优先级**：P2  
**估时**：15 分钟  
**影响范围**：`src/app/api/admin/orders/[orderId]/ship/route.ts`

**要求**：

在 Task 2.9 的标记发货 API 中，添加邮件发送。邮件内容包含物流单号。

**验证标准**：
- [ ] 标记发货后自动发送物流通知

---

### Task 4.4：集成 Resend SDK

**优先级**：P2  
**估时**：15 分钟  
**影响范围**：
- `src/lib/email/sendEmail.ts`（新建）

**要求**：

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: 'Enzyme Skincare <orders@enzymeskincare.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}
```

**验证标准**：
- [ ] SDK 初始化正常
- [ ] 发送失败不抛异常

---

### Task 4.5：创建 Seed 数据脚本

**优先级**：P2  
**估时**：15 分钟  
**影响范围**：`prisma/seed.ts`

**要求**：

添加以下种子数据：

1. **Admin 管理员账号**
   - 邮箱：admin@enzymeskincare.com
   - 密码：admin123（请尽快修改）
   - 角色：ADMIN
   - 姓名：管理员

2. **示例订单**（可选，方便测试）
   - 1 条 PENDING_PAYMENT 订单
   - 关联的 OrderItem
   - 关联的 OrderAuditLog

**验证标准**：
- [ ] `npx prisma db seed` 成功
- [ ] 管理员可登录

---

### Task 4.6：构建验证 + Git 提交

**优先级**：P0  
**估时**：10 分钟  
**影响范围**：全项目

**要求**：

```bash
# 1. Prisma 生成
npx prisma generate

# 2. 构建
npm run build

# 3. 修复所有错误
# 4. 直到构建通过
```

**验证标准**：
- [ ] `npm run build` 成功（0 错误）

---

## 执行顺序汇总

```
Sprint 1: 数据库层
  1.1 → 创建 Order + Payment 模型
  1.2 → 创建 Prisma Migration

Sprint 2: API + 业务逻辑
  2.1 → 创建 Checkout API
  2.2 → 创建 Customer Order 查询 API
  2.3 → 创建 Customer Order 页面
  2.4 → 创建 Admin 订单列表 API
  2.5 → 创建 Admin 订单详情 API
  2.6 → 创建 Admin 附加支付链接 API
  2.7 → 创建 Admin 确认付款 API
  2.8 → 创建 Admin 取消订单 API
  2.9 → 创建 Admin 标记发货 API

Sprint 3: 管理后台
  3.1 → Admin 登录页面
  3.2 → Admin Dashboard 布局
  3.3 → Admin 订单列表页
  3.4 → Admin 订单详情页
  3.5 → Admin Middleware 权限控制

Sprint 4: 邮件 + 收尾
  4.1 → 创建确认邮件发送函数
  4.2 → 确认付款 API 中集成邮件
  4.3 → 标记发货 API 中集成邮件
  4.4 → 集成 Resend SDK
  4.5 → 创建 Seed 数据脚本
  4.6 → 构建验证 + Git 提交
```

---

## 使用说明（给人类老板）

**每次发给 Codex 的格式**：

```
请按项目根目录下的 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前需要执行：

Sprint [编号]，Task [编号]：[任务名]

引用文件路径：
- [文件1]
- [文件2]

具体要求和验证标准见文档。
```

**每次只发一个 Task**，等 Codex 完成后验证通过，再发下一个。
