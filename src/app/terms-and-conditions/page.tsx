import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Enzyme Skincare",
  description: `Read the terms and conditions governing purchases and use of ${BUSINESS_INFO.website}, operated by ${BUSINESS_INFO.legalNameEN}.`,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Terms and Conditions</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <h2>1. Introduction</h2>
        <p>Welcome to {BUSINESS_INFO.website} (the "Website"). These Terms and Conditions ("Terms") govern your access to and use of the Website and your purchase of products from the Website. By accessing or using the Website, placing an order or creating an account, you agree to be bound by these Terms. If you do not agree, please do not use the Website.</p>

        <h2>2. Business Identity</h2>
        <p><strong>{BUSINESS_INFO.storeName}</strong> ({BUSINESS_INFO.website}) is operated by <strong>{BUSINESS_INFO.legalNameEN}</strong> ({BUSINESS_INFO.legalNameCN}), a company registered in the People's Republic of China.</p>
        <ul>
          <li><strong>Legal Name:</strong> {BUSINESS_INFO.legalNameEN}</li>
          <li><strong>Registration Number:</strong> {BUSINESS_INFO.registrationNumber}</li>
          <li><strong>Registered Address:</strong> {BUSINESS_INFO.registeredAddressEN}</li>
          <li><strong>Email:</strong> <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a></li>
          <li><strong>Website:</strong> {BUSINESS_INFO.website}</li>
        </ul>

        <h2>3. Eligibility</h2>
        <p>By using this Website and placing an order, you confirm that you are at least 18 years of age, or are accessing the Website under the supervision of a parent or guardian. You also confirm that all information you provide is accurate and complete.</p>

        <h2>4. Products and Information</h2>
        <p>We make reasonable efforts to display product details, ingredients, images and prices as accurately as possible. However, actual colours, textures and packaging may vary slightly from what is displayed on your screen. Product descriptions are for informational purposes only and are not medical claims. Our products are not intended to diagnose, treat, cure or prevent any disease or medical condition.</p>

        <h2>5. Pricing and Currency</h2>
        <p>All prices on the Website are listed in United States Dollars (USD). Prices are subject to change without prior notice. The price applicable to your order is the price displayed at checkout at the time of purchase. We reserve the right to correct any pricing errors.</p>

        <h2>6. Orders and Acceptance</h2>
        <p>Placing a product in your shopping cart does not reserve the item. Your order is confirmed when you receive an order confirmation email from us. We reserve the right to refuse, cancel or limit orders for any reason, including suspected fraud, inaccuracies in product or pricing information, or stock unavailability. If we cancel an order after payment has been processed, we will issue a full refund.</p>

        <h2>7. Payment</h2>
        <p>We accept the payment methods displayed at checkout. Full payment is required at the time of ordering. Payment is processed through authorised third-party payment service providers using industry-standard security controls. Your order will not be dispatched until payment has been confirmed.</p>

        <h2>8. Shipping and Delivery</h2>
        <p>Shipping times, fees, restrictions and policies are set out in our <a href="/shipping-policy">Shipping Policy</a>. Delivery estimates are not guaranteed and may be affected by factors outside our control, including carrier delays, customs processing, weather conditions and public holidays.</p>

        <h2>9. Returns, Refunds and Cancellations</h2>
        <p>Our return, refund and cancellation procedures are set out in our <a href="/refund-policy">Refund and Return Policy</a>. Please review this policy carefully before placing an order.</p>

        <h2>10. Customer Responsibilities</h2>
        <p>You agree to provide accurate, current and complete information when placing an order, including your name, email address, shipping address and payment details. You are responsible for maintaining the confidentiality of your account information, if applicable. You agree not to use the Website for any unlawful or prohibited purpose.</p>

        <h2>11. Intellectual Property</h2>
        <p>All content on the Website, including but not limited to text, graphics, logos, images, product names, design and software, is the property of {BUSINESS_INFO.legalNameEN} or its licensors and is protected by applicable intellectual property and copyright laws. You may not reproduce, distribute, modify, create derivative works from, or exploit any content without our prior written permission.</p>

        <h2>12. Prohibited Uses</h2>
        <p>You agree not to: (a) use the Website for any unlawful purpose; (b) attempt to interfere with the Website's operation or security; (c) transmit any viruses, malware or harmful code; (d) attempt to access restricted areas without authorisation; or (e) use any automated means to access or scrape the Website without our consent.</p>

        <h2>13. Website Availability</h2>
        <p>We strive to keep the Website operational and accessible. However, we do not guarantee uninterrupted access. We may suspend, withdraw or restrict access to the Website for maintenance, updates, security or reasons beyond our reasonable control, without prior notice.</p>

        <h2>14. Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law, {BUSINESS_INFO.legalNameEN} and its officers, employees and agents shall not be liable for any indirect, incidental, special, consequential or punitive damages, including but not limited to loss of profits, data or goodwill, arising out of or in connection with your use of the Website or purchase of products.</p>

        <h2>15. Indemnification</h2>
        <p>You agree to indemnify, defend and hold harmless {BUSINESS_INFO.legalNameEN}, its officers, employees and agents, from and against any and all claims, damages, liabilities, costs and expenses arising out of or related to your breach of these Terms, your misuse of the Website, or your violation of any applicable law or third-party rights.</p>

        <h2>16. Privacy</h2>
        <p>Your personal information is collected, used and protected in accordance with our <a href="/privacy-policy">Privacy Policy</a>. By using the Website, you consent to the practices described in the Privacy Policy.</p>

        <h2>17. Governing Law</h2>
        <p>These Terms and Conditions and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of the <strong>{BUSINESS_INFO.governingCountry}</strong>.</p>
        <p>Nothing in these Terms limits any mandatory consumer rights that apply under the laws of your country of residence. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>

        <h2>18. Dispute Resolution</h2>
        <p>If a dispute arises, we strongly encourage you to contact our customer service team first to seek an informal resolution. If the dispute cannot be resolved informally, it shall be submitted to the competent courts of the {BUSINESS_INFO.governingCountry}. Nothing in this section prevents you from exercising your rights under applicable consumer protection laws in your country of residence.</p>

        <h2>19. Changes to These Terms</h2>
        <p>We reserve the right to update or modify these Terms at any time. Changes will be posted on this page with an updated effective date. Your continued use of the Website after changes are posted constitutes your acceptance of the revised Terms. We encourage you to review this page periodically.</p>

        <h2>20. Contact Information</h2>
        <p>If you have any questions about these Terms and Conditions, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a></li>
          <li><strong>Phone:</strong> {BUSINESS_INFO.phone}</li>
          <li><strong>Address:</strong> {BUSINESS_INFO.registeredAddressEN}</li>
        </ul>
      </div>
    </div>
  );
}
