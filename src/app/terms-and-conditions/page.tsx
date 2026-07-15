import { BUSINESS_INFO, getEffectiveDate, getOperatorDisclosure } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Enzyme Skincare",
  description: `Read the terms governing purchases and use of ${BUSINESS_INFO.website}, operated by ${BUSINESS_INFO.legalNameEN}.`,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Terms and Conditions</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <h2>1. Introduction</h2>
        <p>These Terms and Conditions govern your use of {BUSINESS_INFO.website} (the "Website") and your purchase of products from the Website. By accessing or using the Website, you agree to be bound by these Terms. If you do not agree, please do not use the Website.</p>

        <h2>2. Business Identity</h2>
        <p>{getOperatorDisclosure()}</p>
        <ul>
          <li><strong>Legal Name:</strong> {BUSINESS_INFO.legalNameEN} ({BUSINESS_INFO.legalNameCN})</li>
          <li><strong>Registration Number:</strong> {BUSINESS_INFO.registrationNumber}</li>
          <li><strong>Registered Address:</strong> {BUSINESS_INFO.registeredAddress}</li>
          <li><strong>Email:</strong> {BUSINESS_INFO.supportEmail}</li>
        </ul>

        <h2>3. Eligibility</h2>
        <p>By placing an order, you confirm that you are at least 18 years of age, or are accessing the Website under the supervision of a parent or guardian.</p>

        <h2>4. Product Information</h2>
        <p>We make reasonable efforts to display product details, ingredients and images accurately. However, actual colours, textures and packaging may vary. Product descriptions are for informational purposes and are not medical claims. Our products are not intended to diagnose, treat, cure or prevent any medical condition.</p>

        <h2>5. Prices and Currency</h2>
        <p>All prices are listed in United States Dollars (USD). Prices are subject to change without notice. The price applicable to your order is the price displayed at the time of checkout.</p>

        <h2>6. Orders and Acceptance</h2>
        <p>Placing a product in your cart does not reserve the item. Your order is confirmed when you receive an order confirmation email. We reserve the right to refuse or cancel an order for reasons including suspected fraud, inaccurate pricing or stock unavailability.</p>

        <h2>7. Payment</h2>
        <p>We accept the payment methods displayed at checkout. Payment is processed through authorised payment-service providers. Your order will not be dispatched until payment is confirmed.</p>

        <h2>8. Shipping and Delivery</h2>
        <p>Shipping times, fees and policies are set out in our <a href="/shipping-policy">Shipping Policy</a>. Delivery estimates are not guaranteed and delays may occur due to factors outside our control.</p>

        <h2>9. Returns, Refunds and Cancellations</h2>
        <p>Our return and refund procedures are set out in our <a href="/refund-policy">Refund and Return Policy</a>.</p>

        <h2>10. Customer Responsibilities</h2>
        <p>You agree to provide accurate and complete information when placing an order. You are responsible for maintaining the confidentiality of your account information.</p>

        <h2>11. Intellectual Property</h2>
        <p>All content on the Website, including text, images, logos and product names, is the property of {BUSINESS_INFO.legalNameEN} or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute or create derivative works without prior written permission.</p>

        <h2>12. Prohibited Use</h2>
        <p>You may not use the Website for any unlawful purpose, to transmit harmful code, to interfere with the Website's operation, or to attempt to access restricted areas without authorisation.</p>

        <h2>13. Website Availability</h2>
        <p>We strive to keep the Website operational but do not guarantee uninterrupted access. We may suspend access for maintenance, updates or circumstances beyond our reasonable control.</p>

        <h2>14. Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law, {BUSINESS_INFO.legalNameEN} shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the Website or purchase of products.</p>

        <h2>15. Indemnification</h2>
        <p>You agree to indemnify and hold harmless {BUSINESS_INFO.legalNameEN}, its officers and employees, from any claims arising out of your breach of these Terms or your misuse of the Website.</p>

        <h2>16. Privacy</h2>
        <p>Your personal information is handled in accordance with our <a href="/privacy-policy">Privacy Policy</a>.</p>

        <h2>17. Governing Law</h2>
        <p>These Terms and Conditions and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of the {BUSINESS_INFO.governingCountry}.</p>
        <p>Nothing in these Terms limits any mandatory consumer rights that apply under the laws of the customer's place of residence.</p>

        <h2>18. Dispute Resolution</h2>
        <p>If a dispute arises, we encourage you to contact our customer support team first. If the dispute cannot be resolved informally, it shall be submitted to the competent courts of the {BUSINESS_INFO.governingCountry}.</p>

        <h2>19. Changes to These Terms</h2>
        <p>We may update these Terms from time to time. Changes will be posted on this page with an updated effective date. Continued use of the Website after changes constitutes acceptance of the revised Terms.</p>

        <h2>20. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a>.</p>
      </div>
    </div>
  );
}
