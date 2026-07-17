import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Enzyme Skincare",
  description: `How ${BUSINESS_INFO.website} uses cookies, pixels and similar technologies. Learn how to manage your preferences.`,
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Cookie Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <p>This Cookie Policy explains how <strong>{BUSINESS_INFO.legalNameEN}</strong> ("we", "us", "our") uses cookies, pixels and similar tracking technologies on {BUSINESS_INFO.website} (the "Website"). By using the Website, you consent to the use of cookies in accordance with this policy.</p>

        <h2>What Are Cookies</h2>
        <p>Cookies are small text files that are stored on your device (computer, tablet or mobile) when you visit a website. They are widely used to make websites work more efficiently, enhance your browsing experience and provide information to the website owners. Cookies may be set by the website you visit ("first-party cookies") or by third-party services ("third-party cookies").</p>

        <h2>How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul>
          <li><strong>Strictly Necessary:</strong> These cookies are essential for the Website to function correctly. They enable core functionality such as security, network management and shopping cart functionality. These cookies do not require your consent.</li>
          <li><strong>Functional:</strong> These cookies allow the Website to remember choices you make (such as language or region) and provide enhanced, more personalised features.</li>
          <li><strong>Analytics:</strong> These cookies help us understand how visitors interact with the Website by collecting and reporting anonymised information. We use Google Analytics and Microsoft Clarity for this purpose.</li>
          <li><strong>Marketing:</strong> These cookies are used to track visitors across websites to display relevant advertisements. We may use Meta Pixel and TikTok Pixel for this purpose. These cookies are only set with your consent.</li>
        </ul>

        <h2>Cookies We Use</h2>
        <table>
          <thead><tr><th>Category</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr></thead>
          <tbody>
            <tr><td>Essential</td><td>Next.js</td><td>Session management, shopping cart</td><td>Session</td></tr>
            <tr><td>Analytics</td><td>Google Analytics</td><td>Page views, user behaviour</td><td>Up to 2 years</td></tr>
            <tr><td>Analytics</td><td>Microsoft Clarity</td><td>Session recordings, heatmaps</td><td>Up to 1 year</td></tr>
            <tr><td>Marketing</td><td>Meta Pixel</td><td>Ad targeting, conversion tracking</td><td>Up to 180 days</td></tr>
            <tr><td>Marketing</td><td>TikTok Pixel</td><td>Ad targeting, conversion tracking</td><td>Up to 180 days</td></tr>
          </tbody>
        </table>

        <h2>Managing Your Cookie Preferences</h2>
        <p>When you first visit our Website, a cookie consent banner allows you to choose your preferences. You can:</p>
        <ul>
          <li><strong>Accept All:</strong> consent to all categories of cookies</li>
          <li><strong>Essential Only:</strong> accept only strictly necessary cookies</li>
          <li><strong>Manage Preferences:</strong> choose which categories to allow</li>
        </ul>
        <p>You can also manage or delete cookies through your browser settings. Most browsers allow you to block or delete cookies, but please note that disabling certain cookies may affect the functionality and performance of the Website.</p>

        <h2>Third-Party Cookies</h2>
        <p>We use the following third-party services that may set cookies on your device:</p>
        <ul>
          <li><strong>Google Analytics:</strong> for Website traffic analysis</li>
          <li><strong>Microsoft Clarity:</strong> for user behaviour analysis</li>
          <li><strong>Meta Pixel:</strong> for advertising and conversion tracking</li>
          <li><strong>TikTok Pixel:</strong> for advertising and conversion tracking</li>
          <li><strong>Stripe:</strong> for payment processing (essential)</li>
        </ul>
        <p>Each of these services has its own privacy and cookie policies. We encourage you to review them for more information.</p>

        <h2>Your Choices</h2>
        <p>You have the right to accept or reject non-essential cookies. You can change your cookie preferences at any time by adjusting your browser settings or by clearing your cookies and revisiting our Website, which will prompt the cookie consent banner again.</p>

        <h2>Updates to This Policy</h2>
        <p>We may update this Cookie Policy from time to time to reflect changes in the cookies we use or applicable regulations. Changes will be posted on this page with an updated effective date.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about our use of cookies, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a></li>
          <li><strong>Address:</strong> {BUSINESS_INFO.registeredAddressEN}</li>
        </ul>
      </div>
    </div>
  );
}
