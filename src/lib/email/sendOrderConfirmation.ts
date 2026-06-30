import { sendEmail } from "./sendEmail";

export async function sendOrderConfirmation(to: string, order: {
  orderNumber: string | null;
  total: number;
  customerName: string | null;
  items: { productName: string | null; quantity: number; unitPrice: number | null }[];
  shippingAddress?: { name: string | null; address1: string | null; city: string | null } | null;
}) {
  const itemsHtml = order.items.map((i) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.productName || "Product"} x${i.quantity}</td><td style="padding:8px 0;text-align:right">$${Number(i.unitPrice || 0).toFixed(2)}</td></tr>`
  ).join("");

  const addressHtml = order.shippingAddress?.name
    ? `<p style="color:#666">${order.shippingAddress.name}<br/>${order.shippingAddress.address1 || ""}<br/>${order.shippingAddress.city || ""}</p>`
    : "";

  await sendEmail(to, "[Enzyme Skincare] Order " + (order.orderNumber || "") + " Confirmed", [
    '<div style="max-width:560px;margin:0 auto;font-family:sans-serif">',
    '<h1 style="color:#2E3A33;font-family:Playfair Display,serif">✨ Enzyme Skincare</h1>',
    "<p>Thank you for your order" + (order.customerName ? ", " + order.customerName : "") + "!</p>",
    "<p>Order <strong>" + (order.orderNumber || "") + "</strong></p>",
    "<p>Total: <strong>$" + Number(order.total).toFixed(2) + "</strong></p>",
    "<hr style='border:none;border-top:1px solid #eee'/>",
    '<table style="width:100%;border-collapse:collapse">',
    itemsHtml,
    "</table>",
    "<hr style='border:none;border-top:1px solid #eee'/>",
    addressHtml,
    '<p style="color:#999;font-size:12px">如有疑问请联系微信客服。</p>',
    "<p>Enzyme Skincare</p>",
    "</div>",
  ].join(""));
}

export async function sendShipmentNotification(to: string, orderNumber: string | null, trackingNumber?: string | null) {
  await sendEmail(to, "[Enzyme Skincare] Order " + (orderNumber || "") + " Has Shipped", [
    '<div style="max-width:560px;margin:0 auto;font-family:sans-serif">',
    '<h1 style="color:#2E3A33;font-family:Playfair Display,serif">✨ Enzyme Skincare</h1>',
    "<p>Your order <strong>" + (orderNumber || "") + "</strong> has been shipped!</p>",
    trackingNumber ? "<p>Tracking: <strong>" + trackingNumber + "</strong></p>" : "",
    '<p style="color:#999;font-size:12px">如有疑问请联系微信客服。</p>',
    "<p>Enzyme Skincare</p>",
    "</div>",
  ].join(""));
}