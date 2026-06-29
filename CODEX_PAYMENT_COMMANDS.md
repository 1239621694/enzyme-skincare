# Codex 逐条执行指令 — 直接复制粘贴版

> 按顺序执行，**做完一个再发下一个**。

---

## Sprint 1：数据库层

---

### Task 1.1：创建 Order + Payment 数据模型

**发给 Codex 的指令**：

```
请按项目根目录下的 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 1，Task 1.1：创建 Order + Payment 数据模型

需要在 prisma/schema.prisma 中新增以下模型：
1. Order
2. OrderItem
3. Payment
4. OrderAuditLog
5. OrderCounter
6. AdminUser

以及枚举：
1. OrderStatus
2. PaymentProvider
3. PaymentStatus
4. AdminRole

具体字段定义、枚举值、索引都在文档的 Task 1.1 部分，严格按照文档要求写。

完成后运行：
npx prisma generate
npx prisma db push

告诉我是否成功。
```

---

### Task 1.2：创建 Prisma Migration

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 1，Task 1.2：创建 Prisma Migration

请执行：
npx prisma migrate dev --name add_order_payment_models

如果成功，告诉我 Migration 名称。
```

---

## Sprint 2：API + 业务逻辑层

---

### Task 2.1：创建 Checkout API

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.1：创建 Checkout API

在 src/app/api/checkout/route.ts 中实现 POST /api/checkout。

功能要求：
1. 接收 items、customerEmail、customerName、customerPhone、shippingAddress
2. 验证必填字段
3. 计算金额（从数据库取价格）
4. 生成订单号 ORD-YYYYMMDD-NNNN
5. 创建 Order + OrderItem
6. 创建 OrderAuditLog（ORDER_CREATED）
7. 返回 { success, orderId, orderNumber, total, redirectUrl }

输入输出格式见文档中的「要求」部分。

完成后告诉我 API 路径。
```

---

### Task 2.2：创建 Customer 订单查询 API

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.2：创建 Customer 订单查询 API

在 src/app/api/orders/[orderId]/route.ts 中实现 GET /api/orders/{orderId}。

功能要求：
1. 查询参数：token（accessToken）
2. 验证 token 有效性
3. 返回订单信息，包含 items 和 payments
4. 错误 token 返回 401

输出格式见文档。

完成后告诉我 API 路径。
```

---

### Task 2.3：创建 Customer Order 页面

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.3：创建 Customer Order 页面

在 src/app/orders/[orderId]/page.tsx 中创建客户订单详情页面。

页面要求：
1. 路径：/orders/{orderId}?token={token}
2. 显示订单号、状态、商品列表、总计、收货地址
3. 如果 payment.status === "PENDING" 且有 invoiceUrl，显示 [通过 XTransfer 付款] 按钮
4. 点击按钮在新标签页打开 invoiceUrl
5. 如果已付款显示"已付款"
6. 如果无支付链接显示"等待管理员添加支付方式"
7. 显示付款说明文案（见文档）

页面样式：保持与网站现有设计一致。

完成后告诉我页面路径。
```

---

### Task 2.4：创建 Admin 订单列表 API

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.4：创建 Admin 订单列表 API

在 src/app/api/admin/orders/route.ts 中实现 GET /api/admin/orders。

功能要求：
1. 查询参数：status, page, limit, sortBy, sortOrder
2. 返回分页订单列表
3. 返回 pagination 信息

输出格式见文档。

完成后告诉我 API 路径。
```

---

### Task 2.5：创建 Admin 订单详情 API

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.5：创建 Admin 订单详情 API

在 src/app/api/admin/orders/[orderId]/route.ts 中实现 GET /api/admin/orders/{orderId}。

功能要求：
1. 返回完整订单详情
2. 包含 items、payments、auditLogs
3. 错误的 orderId 返回 404

完成后告诉我 API 路径。
```

---

### Task 2.6：创建 Admin 附加支付链接 API

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.6：创建 Admin 附加支付链接 API

在 src/app/api/admin/orders/[orderId]/payments/route.ts 中实现 POST。

功能要求：
1. 接收 provider, invoiceUrl, amount, currency
2. 验证订单状态为 PENDING_PAYMENT
3. 验证金额与 total 一致
4. 创建 Payment 记录（status: PENDING）
5. 创建 OrderAuditLog（PAYMENT_ATTACHED）
6. 返回 paymentId

输入输出格式见文档。

完成后告诉我 API 路径。
```

---

### Task 2.7：创建 Admin 确认付款 API

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.7：创建 Admin 确认付款 API

在 src/app/api/admin/payments/[paymentId]/confirm/route.ts 中实现 POST /api/admin/payments/{paymentId}/confirm。

功能要求：
1. 验证 Payment 状态为 PENDING
2. 更新 Payment → COMPLETED
3. 更新 Order → PAID，设置 paidAt
4. 创建 OrderAuditLog（PAYMENT_CONFIRMED）
5. 返回 200

完成后告诉我 API 路径。
```

---

### Task 2.8：创建 Admin 取消订单 API

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.8：创建 Admin 取消订单 API

在 src/app/api/admin/orders/[orderId]/cancel/route.ts 中实现 POST。

功能要求：
1. 接收 reason
2. 验证 Order 状态为 PENDING_PAYMENT 或 PAID
3. 更新 Order → CANCELLED
4. 更新关联 Payment → CANCELLED
5. 创建 OrderAuditLog
6. 返回 200

完成后告诉我 API 路径。
```

---

### Task 2.9：创建 Admin 标记发货 API

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 2，Task 2.9：创建 Admin 标记发货 API

在 src/app/api/admin/orders/[orderId]/ship/route.ts 中实现 POST。

功能要求：
1. 接收 trackingNumber, shippingCompany
2. 验证 Order 状态为 PAID 或 PROCESSING
3. 更新 Order → SHIPPED
4. 创建 OrderAuditLog
5. 返回 200

完成后告诉我 API 路径。
```

---

## Sprint 3：管理后台前端

---

### Task 3.1：Admin 登录页面

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 3，Task 3.1：Admin 登录页面

创建两个文件：
1. src/app/admin/login/page.tsx — 登录表单
2. src/app/api/admin/auth/login/route.ts — 登录 API

登录表单要求：
- 邮箱 + 密码输入
- 提交后 POST /api/admin/auth/login
- 成功后跳转到 /admin/dashboard

登录 API 要求：
- 验证邮箱密码
- 正确 → 设置 session cookie，返回 200
- 错误 → 返回 401

完成后告诉我两个文件的路径。
```

---

### Task 3.2：Admin Dashboard 布局

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 3，Task 3.2：Admin Dashboard 布局

创建两个文件：
1. src/app/admin/layout.tsx — 侧边栏导航布局
2. src/app/admin/dashboard/page.tsx — 总览页面

布局要求：
- 左侧菜单：总览、订单管理、支付记录、设置
- 顶部 header：管理员信息 + 退出
- 右侧内容区

总览页面要求：
- 今日订单数
- 待处理订单数（PENDING_PAYMENT）
- 今日销售额
- 本月销售额
- 最近 5 条待确认付款订单（快捷入口）

保持 Admin 布局与网站现有设计风格一致。

完成后告诉我页面路径。
```

---

### Task 3.3：Admin 订单列表页

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 3，Task 3.3：Admin 订单列表页

在 src/app/admin/orders/page.tsx 中创建订单列表页。

功能要求：
1. 表格列：订单号、客户、金额、状态（彩色 Badge）、创建时间、操作
2. 状态筛选下拉框
3. 分页
4. 点击订单号跳转到详情页
5. 状态颜色见文档中的色值表

页面样式与网站现有设计一致。

完成后告诉我页面路径。
```

---

### Task 3.4：Admin 订单详情页

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 3，Task 3.4：Admin 订单详情页

在 src/app/admin/orders/[orderId]/page.tsx 中创建订单详情页。

页面结构：
1. 基本信息卡片（订单号、状态、时间）
2. 客户信息卡片
3. 收货地址卡片
4. 商品信息表格
5. 支付信息卡片
6. 操作按钮区域（根据状态显示不同按钮）
7. 操作历史列表

操作按钮的显示逻辑见文档。

[附加支付链接] 按钮 → 弹出 Modal → 输入 Invoice URL → 确认
[确认付款] 按钮 → 确认后调 API
[标记发货] 按钮 → 弹出 Modal → 输入物流信息 → 确认

页面样式与网站现有设计一致。

完成后告诉我页面路径。
```

---

### Task 3.5：Admin Middleware 权限控制

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 3，Task 3.5：Admin Middleware 权限控制

在 src/middleware.ts 中实现中间件。

功能要求：
1. /admin/* 路径 → 检查 admin_session cookie
2. 无 session → 重定向到 /admin/login
3. /admin/login 放行
4. 其他路径放行
5. session cookie 配置：HTTP-only, Secure, SameSite: Lax

完成后告诉我 middleware 路径。
```

---

## Sprint 4：邮件 + 基础设施

---

### Task 4.1：创建确认邮件发送函数

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 4，Task 4.1：创建确认邮件发送函数

在 src/lib/email/sendOrderConfirmation.ts 中实现邮件发送函数。

功能要求：
1. 使用 Resend SDK
2. 邮件内容：订单号、商品列表、总金额、收货地址
3. 包裹在 try/catch 中
4. 失败记录日志但不抛异常

邮件模板参考文档中的格式。

完成后告诉我文件路径。
```

---

### Task 4.2：在确认付款 API 中集成邮件

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 4，Task 4.2：在确认付款 API 中集成邮件

修改 src/app/api/admin/payments/[paymentId]/confirm/route.ts。

在更新订单状态后，调用 sendOrderConfirmation 发送确认邮件。

注意：邮件发送失败不要影响订单状态。

完成后告诉我修改完成。
```

---

### Task 4.3：在标记发货 API 中集成邮件

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 4，Task 4.3：在标记发货 API 中集成邮件

修改 src/app/api/admin/orders/[orderId]/ship/route.ts。

在更新订单状态后，发送发货通知邮件（包含物流信息）。

注意：邮件发送失败不要影响订单状态。

完成后告诉我修改完成。
```

---

### Task 4.4：集成 Resend SDK

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 4，Task 4.4：集成 Resend SDK

在 src/lib/email/sendEmail.ts 中创建基础的邮件发送函数。

功能要求：
1. 初始化 Resend 客户端
2. 导出 sendEmail(to, subject, html) 函数
3. 发送失败不抛异常

代码见文档中的「要求」部分。

完成后告诉我文件路径。
```

---

### Task 4.5：创建 Seed 数据脚本

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 4，Task 4.5：创建 Seed 数据脚本

在 prisma/seed.ts 中添加：
1. Admin 管理员账号：admin@enzymeskincare.com / admin123 / ADMIN
2. 一条示例 PENDING_PAYMENT 订单（可选）

完成后运行 npx prisma db seed，告诉我是否成功。
```

---

### Task 4.6：构建验证 + Git 提交

**发给 Codex 的指令**：

```
请按 CODEX_PAYMENT_MASTER_PLAN.md 执行。

当前执行 Sprint 4，Task 4.6：构建验证

请依次执行：
1. npx prisma generate
2. npm run build

如果有错误，逐个修复直到构建通过。

告诉我校验结果。
```
