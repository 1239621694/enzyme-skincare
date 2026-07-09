# 优惠券系统精简指令

## 任务
修改后台优惠券系统，仅保留必要字段。

---

## 需要修改的文件

### 1. 创建优惠券页面
**文件**: `src/app/admin/coupons/create/page.tsx`

**修改内容**:
- 表单字段只保留以下 5 个：

| 字段 | 类型 | 说明 |
|------|------|------|
| Coupon Code | 文本输入框 | 必填，自动转大写 |
| Discount Type | 下拉选择 | PERCENTAGE / FIXED |
| Discount Value | 数字输入框 | 必填 |
| Usage Per User | 数字输入框 | 默认 1 |
| Expiry Date | 日期选择 | 非必填 |

- 去掉所有其他字段：Min Order、Max Discount、Start Date、Usage Limit、Applicable Products、First Time Only
- 提交时使用 `try/catch`包裹数据库写入，报错时提示"创建失败，请重试"
- 成功后跳转回优惠券列表

### 2. 优惠券列表页面
**文件**: `src/app/admin/coupons/page.tsx`

**修改内容**:
- 显示字段只需：Code、Type、Value、Uses、Status、Expires
- 去掉复杂的统计和筛选
- 空数据显示 "暂无优惠券"

### 3. 数据库写入（如果 Prisma 连不上）
**文件**: `src/app/admin/coupons/create/page.tsx`

- 先用 `try/catch` 尝试写入 `prisma.coupon.create`
- 如果写入失败（数据库连不上），把数据临时存到 `localStorage` 或返回友好提示
- 不要让页面崩溃

---

## 不需要修改的文件
- 其他所有后台页面不动
- 前端购物车/结账页面不动（优惠券使用功能后续再开发）
- 数据库 Schema 不动

---

## 验证方法
```bash
npm run build
```
确认无编译错误即可。功能效果在浏览器中打开 `/admin/coupons/create` 查看。
