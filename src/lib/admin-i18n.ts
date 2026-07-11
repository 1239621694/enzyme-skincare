/**
 * Admin Dashboard Chinese Translation Dictionary
 *
 * Usage:
 *   import { t } from "@/lib/admin-i18n";
 *   <h1>{t("Dashboard")}</h1>
 *
 * If a key is not found, it returns the key itself (English fallback).
 */

const dict: Record<string, string> = {
  // ── Navigation ──
  "Enzyme Admin": "酶护肤 管理后台",
  Dashboard: "仪表盘",
  Orders: "订单管理",
  Customers: "客户管理",
  "Sales Reps": "销售代表",
  Referrals: "推广链接",
  Reviews: "评价管理",
  Reports: "数据报告",
  Products: "产品管理",
  Analytics: "数据分析",

  // ── Dashboard KPIs ──
  "Today Orders": "今日订单",
  "Today Revenue": "今日收入",
  "Pending Payment": "待付款",
  "Pending Shipment": "待发货",
  Completed: "已完成",
  "New Customers": "新客户",
  Returning: "回头客",
  "Coupon Uses": "优惠券使用",
  "Top Products": "热销产品",
  "Top Sales Reps": "最佳销售",
  "Recent Orders": "最近订单",
  "View All": "查看全部",
  "Revenue (7 Days)": "近7天收入",
  Summary: "摘要",
  "Total Orders": "总订单数",
  "Total Revenue": "总收入",
  "No data yet": "暂无数据",
  "No orders yet": "暂无订单",
  "Loading Dashboard...": "加载中...",
  "Failed to load dashboard": "加载失败",

  // ── Buttons & Actions ──
  "Create": "创建",
  Edit: "编辑",
  Save: "保存",
  Cancel: "取消",
  Delete: "删除",
  "Duplicate": "复制",
  Disable: "禁用",
  Enable: "启用",
  Apply: "应用",
  Clear: "清空",
  "Search": "搜索",
  "Export CSV": "导出CSV",
  "Copy Link": "复制链接",
  "← Prev": "← 上一页",
  "Next →": "下一页 →",
  Loading: "加载中...",

  // ── Order Status ──
  "PENDING_PAYMENT": "待付款",
  PAID: "已付款",
  PROCESSING: "处理中",
  SHIPPED: "已发货",
  DELIVERED: "已送达",
  CANCELLED: "已取消",
  REFUNDED: "已退款",

  // ── Order List ──
  "Order": "订单号",
  "Customer": "客户",
  "Status": "状态",
  "Items": "商品数",
  "Total": "金额",
  "Delivery": "物流",
  "Date": "日期",
  "No orders found": "未找到订单",

  // ── Order Filters ──
  "All Statuses": "全部状态",
  "Search order number, name, email...": "搜索订单号、客户姓名、邮箱...",
  "Note (optional)": "备注（选填）",
  "Change status...": "更改状态...",

  // ── Order Detail ──
  "OrderCustomer": "客户信息",
  "Shipping Address": "收货地址",
  "Payment": "付款信息",
  "Actions": "操作",
  "Activity Log": "操作日志",
  "Admin Notes": "管理员备注",
  "OrderSummary": "订单摘要",
  "Shipping & Tracking": "物流追踪",
  "Tracking Timeline": "物流时间线",
  "Order not found": "未找到订单",
  "No address collected": "未填写地址",
  "Shipping Company": "物流公司",
  "Tracking Number": "物流单号",
  "Created": "创建时间",
  "Paid": "付款时间",
  "Shipped": "发货时间",
  "Delivered": "送达时间",
  "Delivery Status": "配送状态",
  "Product": "商品",
  "Qty": "数量",
  "Price": "单价",
  "Subtotal": "小计",
  "Shipping": "运费",
  "Discount": "折扣",
  "Coupon": "优惠券",
  "Confirm Payment": "确认收款",
  "Cancel Order": "取消订单",
  "✏️ Edit": "✏️ 编辑",
  "← Orders": "← 返回订单",
  "📦 Update Tracking": "📦 更新物流",
  "✅ Confirm Payment": "✅ 确认收款",
  "✕ Cancel Order": "✕ 取消订单",

  // ── Customers ──
  "Email": "邮箱",
  "Phone": "电话",
  "Tags": "标签",
  "Last Order": "最近订单",
  "AOV": "客单价",
  "No customers found": "未找到客户",
  "Search by name, email, phone...": "搜索姓名、邮箱、电话...",
  "Page": "第",

  // ── Customer Detail ──
  "Profile": "资料",
  "Order History": "订单历史",
  "Stats": "数据统计",
  "Total Spent": "总消费",
  "Average Order": "平均订单",
  "First Order": "首次下单",
  "LastOrderDetail": "最近下单",
  "Customer Since": "注册时间",
  "Referral Source": "来源渠道",
  "Add tag...": "添加标签...",
  "Notes": "备注",

  // ── Coupons ──
  "CouponLabel": "优惠券",
  "Coupons": "优惠券",
  "Name / Code": "名称 / 代码",
  "Type": "类型",
  "Value": "值",
  "Uses": "使用次数",
  "Expires": "到期时间",
  "CouponActions": "操作",
  "No coupons yet": "暂无优惠券",
  "Create Coupon": "创建优惠券",
  "Coupon Code": "优惠券代码",
  "Coupon Name": "优惠券名称",
  "Discount Type": "折扣类型",
  "Discount Value": "折扣值",
  "Percentage (%)": "百分比 (%)",
  "Fixed Amount ($)": "固定金额 ($)",
  "Usage Limit": "使用上限",
  "Usage Per User": "每人限用",
  "Min Order Amount": "最低订单金额",
  "Expiry Date": "到期日期",
  "Draft": "草稿",
  "CouponActive": "启用",
  "Disabled": "禁用",
  "Expired": "已过期",
  "ActiveCoupon": "有效优惠券",

  // ── Coupon Edit ──
  "Edit Coupon": "编辑优惠券",
  "Save Changes": "保存修改",
  "Select status...": "选择状态...",

  // ── Sales Reps ──
  "No sales reps yet": "暂无销售代表",
  "Sales Code": "销售代码",
  "CommissionRate": "佣金率",
  "Visitors": "访问数",
  "CommissionAmount": "佣金",
  "Revenue": "收入",
  "Referral Link": "推广链接",
  "Name *": "姓名 *",
  "Email *": "邮箱 *",
  "Sales Code *": "销售代码 *",
  "Code": "代码",

  // ── Referrals ──
  "Referrer": "推荐人",
  "CommissionReferral": "佣金",

  // ── Products ──
  "No products yet": "暂无产品",
  "In Stock": "有货",
  "ActiveProduct": "上架",
  "Inactive": "下架",

  // ── Reviews ──
  "Review Moderation": "评价审核",
  "Approved": "已审核",
  "No reviews yet": "暂无评价",

  // ── Login ──
  "Admin Login": "管理员登录",
  "Password": "密码",
  "Sign In": "登录",
  "Logging in...": "登录中...",
  "Invalid credentials": "账号或密码错误",
};

export function t(key: string): string {
  return dict[key] ?? key;
}

export default dict;
