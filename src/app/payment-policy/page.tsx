import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Policy | Enzyme Skincare",
  description: `Information about accepted payment methods, security and processing for orders from ${BUSINESS_INFO.website}.`,
};

export default function PaymentPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Payment Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <h2>Accepted Payment Methods</h2>
        <p>We accept the following payment methods on {BUSINESS_INFO.website}:</p>
        <ul>
          <li>XTransfer (Bank Transfer)</li>
        </ul>
        <p>Additional payment methods may be added and displayed at checkout.</p>

        <h2>Currency</h2>
        <p>All prices on our Website are listed in United States Dollars (USD). Your bank or payment provider may apply currency conversion fees, which are your responsibility.</p>

        <h2>Payment Authorisation</h2>
        <p>When you place an order, your payment method will be authorised or charged at the time the order is submitted. All orders are subject to fraud screening and authorisation by the payment provider.</p>

        <h2>Payment Security</h2>
        <p>Payments are processed through authorised payment-service providers using industry-standard security controls. We do not directly store full credit or debit card numbers on our servers.</p>

        <h2>Failed or Declined Payments</h2>
        <p>If a payment is declined or fails, the order will not be processed. You will be notified and may attempt to complete the purchase again or use a different payment method if available.</p>

        <h2>Duplicate Charges</h2>
        <p>If you believe you have been charged twice for the same order, please contact our customer support team at <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a>.</p>

        <h2>Refund Method</h2>
        <p>Refunds, when applicable, will be returned to the original payment method used at checkout in accordance with our <a href="/refund-policy">Refund and Return Policy</a>.</p>

        <h2>Taxes and Duties</h2>
        <p>Applicable taxes, if any, will be displayed at checkout. International orders may be subject to customs duties and import taxes (see our <a href="/shipping-policy">Shipping Policy</a>).</p>

        <h2>Contact</h2>
        <p>For payment-related questions, please email <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a>.</p>
      </div>
    </div>
  );
}
