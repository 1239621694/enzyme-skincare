import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Enzyme Skincare",
  description: `Learn how ${BUSINESS_INFO.legalNameEN} collects, uses and protects your information when you use ${BUSINESS_INFO.website}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <p>This Privacy Policy explains how {BUSINESS_INFO.legalNameEN} ("we", "us", "our") collects, uses and protects your personal information when you visit {BUSINESS_INFO.website} and purchase our products.</p>
        <p><strong>Data Controller:</strong> {BUSINESS_INFO.legalNameEN}, {BUSINESS_INFO.registeredAddress}. Email: {BUSINESS_INFO.legalEmail}</p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Contact and Account Information:</strong> name, email address, phone number, billing and shipping address.</li>
          <li><strong>Order Information:</strong> products purchased, order history, payment confirmation details.</li>
          <li><strong>Device and Browser Information:</strong> IP address, browser type, operating system, referring URLs.</li>
          <li><strong>Cookies and Analytics Data:</strong> browsing behaviour on our Website, pages visited, time spent.</li>
          <li><strong>Customer Support Communications:</strong> messages, emails and inquiries you send us.</li>
        </ul>

        <h2>2. How We Use Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>Process and fulfil orders.</li>
          <li>Communicate with you about your orders and account.</li>
          <li>Provide customer service and respond to inquiries.</li>
          <li>Prevent fraud and ensure the security of our Website.</li>
          <li>Improve our Website and product offerings.</li>
          <li>Send marketing communications only with your consent.</li>
          <li>Comply with applicable legal obligations.</li>
        </ul>

        <h2>3. Payment Information</h2>
        <p>Payment transactions are processed through authorised payment-service providers. We do not directly store full credit or debit card numbers on our servers. Payment data is handled securely by our payment partners in accordance with their privacy and security policies.</p>

        <h2>4. Cookies and Analytics</h2>
        <p>Our Website uses cookies and similar technologies to improve functionality and analyse traffic. You can manage your cookie preferences through our cookie consent banner. For more details, see our <a href="/cookie-policy">Cookie Policy</a>.</p>
        <p>We may use analytics services (such as Google Analytics) to understand how visitors interact with our Website. These services may collect anonymised data about your browsing behaviour.</p>

        <h2>5. Service Providers</h2>
        <p>We may share your personal information with trusted third-party service providers who assist us in operating our Website, processing payments, fulfilling orders, sending emails and analysing traffic. These providers are contractually obligated to protect your information.</p>

        <h2>6. International Data Transfers</h2>
        <p>Your information may be transferred to and stored on servers located outside your country of residence. We take reasonable steps to ensure that appropriate safeguards are in place for such transfers.</p>

        <h2>7. Data Retention</h2>
        <p>We retain your personal information for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law. Order records are typically retained for the period required by tax and commercial regulations.</p>

        <h2>8. Data Security</h2>
        <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss or alteration. However, no method of transmission over the internet is completely secure.</p>

        <h2>9. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have rights regarding your personal data, including the right to access, correct or delete your information. To exercise these rights, please contact us at {BUSINESS_INFO.legalEmail}. We will respond to your request in accordance with applicable law.</p>

        <h2>10. Marketing Preferences</h2>
        <p>If you have consented to receive marketing communications, you can unsubscribe at any time by clicking the unsubscribe link in our emails or by contacting us.</p>

        <h2>11. Children's Privacy</h2>
        <p>Our Website is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors.</p>

        <h2>12. Policy Updates</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>

        <h2>13. Contact Information</h2>
        <p>If you have questions about this Privacy Policy, please contact us at <a href={`mailto:${BUSINESS_INFO.legalEmail}`}>{BUSINESS_INFO.legalEmail}</a>.</p>
      </div>
    </div>
  );
}
