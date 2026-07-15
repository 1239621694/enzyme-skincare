import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Enzyme Skincare",
  description: `How ${BUSINESS_INFO.website} uses cookies and similar technologies.`,
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Cookie Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <p>This Cookie Policy explains how {BUSINESS_INFO.legalNameEN} ("we", "us", "our") uses cookies and similar technologies on {BUSINESS_INFO.website}.</p>

        <h2>What Are Cookies</h2>
        <p>Cookies are small text files stored on your device by your web browser when you visit a website. They help websites function properly, improve your browsing experience and provide information to website owners.</p>

        <h2>Types of Cookies We Use</h2>

        <h3>Strictly Necessary Cookies</h3>
        <p>These cookies are essential for the Website to function correctly. They enable core functionality such as security, network management and shopping cart functionality. These cookies do not require your consent.</p>

        <h3>Functional Cookies</h3>
        <p>These cookies allow the Website to remember choices you make and provide enhanced, more personal features. They may be set by us or by third-party providers whose services we have added to our pages.</p>

        <h3>Analytics Cookies</h3>
        <p>We use analytics cookies (including Google Analytics) to understand how visitors interact with our Website, which pages are visited most often and whether users encounter errors. This information is collected in anonymised or aggregated form.</p>

        <h3>Marketing Cookies</h3>
        <p>Marketing cookies may be used to track visitors across websites to display relevant advertisements. These cookies may be set through our site by our advertising partners. We only use marketing cookies with your consent.</p>

        <h2>Managing Cookies</h2>
        <p>When you first visit our Website, a cookie consent banner allows you to choose your preferences. You can:</p>
        <ul>
          <li>Accept all cookies</li>
          <li>Reject non-essential cookies</li>
          <li>Manage your preferences</li>
        </ul>
        <p>You can also manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the Website.</p>

        <h2>Third-Party Cookies</h2>
        <p>We may use third-party services that set their own cookies. These include:</p>
        <ul>
          <li>Google Analytics (analytics)</li>
          <li>Stripe (payment processing, strictly necessary)</li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page.</p>

        <h2>Contact</h2>
        <p>If you have questions about our use of cookies, please contact us at <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a>.</p>
      </div>
    </div>
  );
}
