import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Return Policy | Enzyme Skincare",
  description: `Review return eligibility, damaged-item procedures and refund processing for orders from ${BUSINESS_INFO.website}.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Refund and Return Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <h2>Return Request Window</h2>
        <p>You may request a return within <strong>{BUSINESS_INFO.returnRequestWindow}</strong> of receiving your order.</p>

        <h2>Return Eligibility</h2>
        <p>To be eligible for a return, items must be:</p>
        <ul>
          <li>Unopened and unused</li>
          <li>In their original packaging</li>
          <li>Accompanied by proof of purchase (order number)</li>
        </ul>

        <h2>Non-Returnable Items</h2>
        <p>For hygiene and safety reasons, opened or used skincare products may not be returnable unless defective or damaged, subject to applicable consumer law.</p>

        <h2>Damaged or Incorrect Items</h2>
        <p>If you receive a damaged or incorrect item, please contact us within <strong>{BUSINESS_INFO.damageNotificationWindow}</strong> of delivery. Please include your order number, photos of the issue and a brief description.</p>

        <h2>Return Authorisation</h2>
        <p>Please contact our customer support team before sending any item back. Returns sent without prior authorisation may not be accepted.</p>

        <h2>Return Address</h2>
        <p>Our return address is located in Chengdu, China. We will provide the specific shipping address upon issuing a return authorisation.</p>

        <h2>Return Shipping Cost</h2>
        <ul>
          <li><strong>Change-of-mind returns:</strong> Return shipping costs are the responsibility of the customer.</li>
          <li><strong>Defective or incorrect items:</strong> We will cover reasonable return shipping costs.</li>
        </ul>

        <h2>Refund Processing Time</h2>
        <p>Refunds are processed within <strong>{BUSINESS_INFO.refundProcessingTime}</strong> after we receive and inspect the returned item.</p>

        <h2>Original Payment Method</h2>
        <p>Refunds will be returned to the original payment method used at checkout, unless otherwise agreed.</p>

        <h2>Cancelled Orders</h2>
        <p>Orders may be cancelled before they are dispatched. Please contact us as soon as possible if you wish to cancel your order. Once an order has been dispatched, cancellation is no longer possible and the return procedure applies.</p>

        <h2>International Duties</h2>
        <p>Customs duties and import taxes paid at the time of purchase may not be refundable. Please check with your local customs office for more information.</p>

        <h2>Contact</h2>
        <p>For return-related questions, please email <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a>.</p>
      </div>
    </div>
  );
}
