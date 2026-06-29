import { sendEmail } from "@/lib/resend";

interface OrderInfo {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: { productName: string; quantity: number; unitPrice: number }[];
  shippingName: string;
  shippingAddress1: string;
  shippingCity: string;
  shippingProvince: string;
}

export async function sendOrderConfirmationEmail(order: OrderInfo) {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${item.productName} × ${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">¥${item.unitPrice.toFixed(2)}</td></tr>`
    )
    .join("");

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:sans-serif">
      <div style="text-align:center;padding:30px 0;background:#0D9488;color:white;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:24px">✅ 订单已确认</h1>
      </div>
      <div style="padding:30px;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px">
        <p>尊敬的 ${order.customerName}，您好！</p>
        <p>您的订单 <strong>${order.orderNumber}</strong> 已确认付款，我们将尽快为您安排发货。</p>

        <h2 style="font-size:16px;margin-top:24px">订单详情</h2>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">商品</th><th style="padding:8px;text-align:right">金额</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:right;font-size:18px;font-weight:bold;padding-top:12px">合计：¥${order.total.toFixed(2)}</div>

        <h2 style="font-size:16px;margin-top:24px">收货信息</h2>
        <p style="color:#666">${order.shippingName}</p>
        <p style="color:#666">${order.shippingAddress1}</p>
        <p style="color:#666">${order.shippingCity} ${order.shippingProvince}</p>

        <div style="margin-top:30px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#666">
          如有疑问，请联系客服<br>
          Enzyme Skincare
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: order.customerEmail,
    subject: `订单 ${order.orderNumber} 已付款确认`,
    html,
  });
}

export async function sendShippingNotification(order: OrderInfo, trackingNumber: string) {
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:sans-serif">
      <div style="text-align:center;padding:30px 0;background:#0D9488;color:white;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:24px">📦 订单已发货</h1>
      </div>
      <div style="padding:30px;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px">
        <p>尊敬的 ${order.customerName}，您好！</p>
        <p>您的订单 <strong>${order.orderNumber}</strong> 已发货！</p>
        <p>物流单号：<strong>${trackingNumber}</strong></p>

        <div style="margin-top:30px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#666">
          如有疑问，请联系客服
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: order.customerEmail,
    subject: `订单 ${order.orderNumber} 已发货`,
    html,
  });
}
