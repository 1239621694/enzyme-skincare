import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Policy | Enzyme Skincare",
  description: `Information about accepted payment methods, security, processing and billing for orders from ${BUSINESS_INFO.website}.`,
};

export default function PaymentPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Payment Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <p>This Payment Policy outlines the payment methods, security practices and billing procedures for purchases made on <strong>{BUSINESS_INFO.website}</strong>, operated by {BUSINESS_INFO.legalNameEN}.</p>

        <h2>Accepted Payment Methods</h2>
        <p>We accept <strong>XTransfer (Bank Transfer)</strong> as the payment method on {BUSINESS_INFO.website}. Payment is processed through authorised third-party payment service providers using industry-standard security controls.</p>
        <p>When you proceed to checkout, you will be redirected to the XTransfer payment page to complete your bank transfer. Your order will be confirmed once payment is received and verified.</p>

        <h2>Payment Recipient</h2>
        <p>Payments for orders placed on {BUSINESS_INFO.website} are collected by <strong>{BUSINESS_INFO.paymentRecipient}</strong>, the legal operator of Enzyme Skincare.</p>

        <h2>Currency</h2>
        <p>All prices on our Website are listed in <strong>United States Dollars (USD)</strong>. If your payment method or bank account is denominated in a different currency, your bank or payment provider may apply a currency conversion fee. We are not responsible for any such fees.</p>

        <h2>Payment Authorisation</h2>
        <p>When you place an order, your payment method will be charged at the time the order is submitted. All orders are subject to fraud screening and authorisation by the payment provider. If the payment is declined or cannot be authorised, the order will not be processed and you will be notified.</p>

        <h2>Payment Security</h2>
        <p>We take the security of your payment information seriously. All payment transactions on our Website are processed using <strong>SSL/TLS encryption</strong> to protect your data during transmission. We do not directly store full credit card or debit card numbers on our servers. Payment data is handled securely by our authorised payment-service providers in accordance with their privacy and security policies.</p>

        <h2>Failed or Declined Payments</h2>
        <p>If a payment is declined or fails, the order will not be processed. You will receive a notification and may attempt to complete the purchase again with a different payment method, if available.</p>

        <h2>Duplicate Charges</h2>
        <p>If you believe you have been charged more than once for the same order, please contact our customer service team at <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a> with your order number. We will investigate and resolve any duplicate charges promptly.</p>

        <h2>Refund Method</h2>
        <p>Refunds, when issued in accordance with our <a href="/refund-policy">Refund and Return Policy</a>, will be returned to the original payment method used at checkout. Please allow the applicable processing time for the refund to appear in your account.</p>

        <h2>Taxes and Duties</h2>
        <p>Applicable taxes, if any, will be displayed at checkout. International orders may be subject to customs duties, import taxes and VAT imposed by the destination country. These charges are the responsibility of the customer. Please see our <a href="/shipping-policy">Shipping Policy</a> for more information.</p>

        <h2>Contact Information</h2>
        <p>For payment-related questions, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a></li>
          <li><strong>Phone:</strong> {BUSINESS_INFO.phone}</li>
          <li><strong>Address:</strong> {BUSINESS_INFO.registeredAddressEN}</li>
        </ul>
      </div>
    </div>
  );
}
