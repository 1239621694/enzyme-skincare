import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Return Policy | Enzyme Skincare",
  description: `Review return eligibility, damaged-item procedures, refund processing and cancellation policies for orders from ${BUSINESS_INFO.website}.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Refund and Return Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <p>At <strong>{BUSINESS_INFO.storeName}</strong>, we want you to be satisfied with your purchase. Please read this policy carefully before placing an order. This policy applies to all products purchased directly from {BUSINESS_INFO.website}.</p>

        <h2>Return Request Window</h2>
        <p>You may request a return within <strong>{BUSINESS_INFO.returnRequestWindow}</strong> of receiving your order. Requests made after this period may not be accepted.</p>

        <h2>Return Eligibility</h2>
        <p>To be eligible for a return, items must meet the following conditions:</p>
        <ul>
          <li>Unopened and unused</li>
          <li>In their original packaging, including any seals, labels and inserts</li>
          <li>Accompanied by proof of purchase (order number or email confirmation)</li>
        </ul>

        <h2>Non-Returnable Items</h2>
        <p>For hygiene and safety reasons, <strong>opened or used skincare products</strong> are not eligible for return or exchange unless they are defective, damaged or incorrect as delivered. This policy is consistent with standard practices in the beauty and cosmetics industry and is subject to applicable consumer protection laws in your country of residence.</p>

        <h2>Damaged, Defective or Incorrect Items</h2>
        <p>If you receive an item that is damaged, defective or incorrect (wrong product or wrong variant), please contact us within <strong>{BUSINESS_INFO.damageNotificationWindow}</strong> of delivery. To process your request, please provide:</p>
        <ul>
          <li>Your order number</li>
          <li>Photographs of the damaged or defective item, including the packaging</li>
          <li>A brief description of the issue</li>
        </ul>
        <p>We will review your request and provide instructions for returning the item (if applicable). For verified issues, we will offer a replacement or full refund, including any applicable return shipping costs.</p>

        <h2>Return Authorisation</h2>
        <p>All returns require prior authorisation from our customer service team. Please <strong>do not</strong> send any item back to us without first contacting us and receiving a return authorisation. Unauthorised returns may not be accepted or refunded.</p>

        <h2>Return Address</h2>
        <p>Our return address is located in Chengdu, China. The specific return address will be provided when we issue a return authorisation.</p>

        <h2>Return Shipping Costs</h2>
        <ul>
          <li><strong>Change-of-mind returns:</strong> Return shipping costs are the responsibility of the customer. Original shipping fees are non-refundable.</li>
          <li><strong>Defective, damaged or incorrect items:</strong> We will cover reasonable return shipping costs and issue a full refund including original shipping fees.</li>
        </ul>

        <h2>Refund Processing Time</h2>
        <p>Refunds are processed within <strong>{BUSINESS_INFO.refundProcessingTime}</strong> after we receive and inspect the returned item. The refund will be issued to the original payment method used at checkout.</p>

        <h2>Refund Amount</h2>
        <ul>
          <li>For eligible returns: the full product price, minus any original or return shipping charges unless the return is due to our error.</li>
          <li>For damaged, defective or incorrect items: full refund including shipping costs.</li>
        </ul>

        <h2>Cancellations</h2>
        <p>Orders may be cancelled free of charge before they have been dispatched. Please contact us as soon as possible if you wish to cancel your order. Once an order has been dispatched, cancellation is no longer possible and the return procedure applies.</p>

        <h2>International Duties and Taxes</h2>
        <p>Customs duties, import taxes and VAT paid at the time of purchase may not be refundable, as these charges are collected by the destination country's customs authority. Please check with your local customs office for more information before placing an order.</p>

        <h2>Shipping Delays</h2>
        <p>Delivery delays caused by carrier issues, customs processing, weather conditions or other factors outside our control are not grounds for return or refund, unless the item is significantly delayed beyond the estimated delivery window. Please contact us if you have concerns about a delayed order.</p>

        <h2>Contact Us</h2>
        <p>For return-related questions, please contact our customer service team:</p>
        <ul>
          <li><strong>Email:</strong> <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a></li>
          <li><strong>Phone:</strong> {BUSINESS_INFO.phone}</li>
          <li><strong>Business Hours:</strong> {BUSINESS_INFO.businessHours}</li>
        </ul>
      </div>
    </div>
  );
}
