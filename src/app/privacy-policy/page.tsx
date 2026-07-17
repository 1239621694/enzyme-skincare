import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Enzyme Skincare",
  description: `Learn how ${BUSINESS_INFO.legalNameEN} collects, uses and protects your personal information when you use ${BUSINESS_INFO.website}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <p>This Privacy Policy explains how <strong>{BUSINESS_INFO.legalNameEN}</strong> ({BUSINESS_INFO.legalNameCN}) ("we", "us", "our") collects, uses, shares and protects your personal information when you visit {BUSINESS_INFO.website} (the "Website") and purchase our products.</p>
        <p><strong>Data Controller:</strong> {BUSINESS_INFO.legalNameEN}, {BUSINESS_INFO.registeredAddressEN}. Email: <a href={`mailto:${BUSINESS_INFO.legalEmail}`}>{BUSINESS_INFO.legalEmail}</a></p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following categories of personal information when you use our Website or place an order:</p>
        <ul>
          <li><strong>Identity Information:</strong> your full name.</li>
          <li><strong>Contact Information:</strong> email address, phone number, billing address and shipping address.</li>
          <li><strong>Order Information:</strong> products purchased, order history, order number and payment confirmation details.</li>
          <li><strong>Device and Technical Information:</strong> IP address, browser type and version, operating system, referring URLs and pages visited.</li>
          <li><strong>Cookies and Analytics Data:</strong> browsing behaviour on our Website, pages viewed, time spent and interactions. Please see our <a href="/cookie-policy">Cookie Policy</a> for more details.</li>
          <li><strong>Communications:</strong> messages, emails and inquiries you send to our customer service team.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your personal information for the following purposes:</p>
        <ul>
          <li>To process, fulfil and manage your orders, including payment processing and shipping.</li>
          <li>To communicate with you about your orders, account or inquiries.</li>
          <li>To provide customer service and technical support.</li>
          <li>To detect, prevent and investigate fraudulent or unauthorised transactions.</li>
          <li>To improve our Website, product offerings and customer experience.</li>
          <li>To send marketing communications, only where we have your consent.</li>
          <li>To comply with applicable legal obligations, such as tax and record-keeping requirements.</li>
        </ul>

        <h2>3. Payment Information</h2>
        <p>Payment transactions on our Website are processed through authorised third-party payment service providers. We do not directly collect, store or process full credit card or debit card numbers. Payment data is transmitted securely to our payment partners and handled in accordance with their privacy and security policies.</p>

        <h2>4. Cookies and Tracking Technologies</h2>
        <p>Our Website uses cookies, pixels and similar tracking technologies to enhance functionality, analyse traffic and support marketing efforts. You can manage your cookie preferences through our cookie consent banner, which appears when you first visit the Website. For full details, please refer to our <a href="/cookie-policy">Cookie Policy</a>.</p>
        <p>We currently use the following analytics and tracking services: Google Analytics, TikTok Pixel, Meta Pixel and Microsoft Clarity. These services may collect anonymised or aggregated data about your browsing behaviour. You may opt out of non-essential cookies through your cookie preferences.</p>

        <h2>5. How We Share Your Information</h2>
        <p>We may share your personal information with the following categories of third parties:</p>
        <ul>
          <li><strong>Payment Processors:</strong> to process transactions securely.</li>
          <li><strong>Shipping Carriers:</strong> to deliver your orders.</li>
          <li><strong>Analytics and Marketing Providers:</strong> to understand Website traffic and, with your consent, deliver relevant advertising.</li>
          <li><strong>Email Service Providers:</strong> to send order confirmations, shipping updates and, with your consent, marketing communications.</li>
          <li><strong>Legal Authorities:</strong> if required by applicable law, regulation or legal process.</li>
        </ul>
        <p>All third-party service providers are contractually obligated to protect your information and may only use it for the specific services they provide.</p>

        <h2>6. International Data Transfers</h2>
        <p>Your personal information may be transferred to and processed in countries outside your country of residence, including China, where our business is registered, and the United States, where some of our service providers operate. We take reasonable steps to ensure that appropriate safeguards are in place for such transfers in accordance with applicable data protection laws.</p>

        <h2>7. Data Retention</h2>
        <p>We retain your personal information for as long as necessary to fulfil the purposes described in this Privacy Policy, or as required by applicable law. Order records are typically retained for the period required by tax and commercial regulations. Marketing data is retained until you withdraw your consent or request deletion.</p>

        <h2>8. Data Security</h2>
        <p>We implement appropriate technical and organisational security measures to protect your personal information against unauthorised access, alteration, disclosure or destruction. This includes SSL/TLS encryption for data transmitted through our Website. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>

        <h2>9. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
        <ul>
          <li>The right to access the personal data we hold about you.</li>
          <li>The right to request correction of inaccurate or incomplete data.</li>
          <li>The right to request deletion of your data, subject to legal retention obligations.</li>
          <li>The right to withdraw consent to marketing communications at any time.</li>
          <li>The right to lodge a complaint with your local data protection authority, where applicable.</li>
        </ul>
        <p>To exercise your rights, please contact us at <a href={`mailto:${BUSINESS_INFO.legalEmail}`}>{BUSINESS_INFO.legalEmail}</a>. We will respond to your request in accordance with applicable law.</p>

        <h2>10. Marketing Communications</h2>
        <p>If you have consented to receive marketing emails, you can unsubscribe at any time by clicking the "unsubscribe" link at the bottom of our emails or by contacting us directly. We will process your request promptly.</p>

        <h2>11. Children's Privacy</h2>
        <p>Our Website is not intended for individuals under the age of 18. We do not knowingly collect, use or store personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately and we will take steps to delete it.</p>

        <h2>12. Third-Party Links</h2>
        <p>Our Website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.</p>

        <h2>13. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements or operational needs. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.</p>

        <h2>14. Contact Information</h2>
        <p>If you have any questions, concerns or requests regarding this Privacy Policy or our data practices, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href={`mailto:${BUSINESS_INFO.legalEmail}`}>{BUSINESS_INFO.legalEmail}</a></li>
          <li><strong>Customer Service:</strong> <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a></li>
          <li><strong>Address:</strong> {BUSINESS_INFO.registeredAddressEN}</li>
        </ul>
      </div>
    </div>
  );
}
