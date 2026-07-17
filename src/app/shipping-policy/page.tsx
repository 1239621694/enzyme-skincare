import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Enzyme Skincare",
  description: `Review order processing times, international shipping estimates, delivery charges, customs information and tracking for orders from ${BUSINESS_INFO.website}.`,
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Shipping Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <p>This Shipping Policy applies to all orders placed on <strong>{BUSINESS_INFO.website}</strong>, operated by {BUSINESS_INFO.legalNameEN}. Please read this policy carefully before placing your order.</p>

        <h2>Order Processing Time</h2>
        <p>Orders are processed and dispatched within <strong>{BUSINESS_INFO.processingTime}</strong>. Processing time may be longer during promotional periods, public holidays or unexpected circumstances. You will receive an order confirmation email once your payment is confirmed.</p>

        <h2>Estimated International Shipping Time</h2>
        <p>Once dispatched, international orders typically arrive within <strong>{BUSINESS_INFO.internationalTransitTime}</strong>, depending on the destination country, carrier route and customs processing.</p>

        <h2>Estimated Total Delivery Time</h2>
        <p><strong>{BUSINESS_INFO.totalDeliveryEstimate}</strong>, depending on destination, customs clearance, carrier operations, weather, holidays and other circumstances beyond our control.</p>

        <h2>Shipping Countries</h2>
        <p>We currently ship to the following countries: {BUSINESS_INFO.shippingCountries.join(", ")}.</p>

        <h2>Shipping Fees</h2>
        <p>Shipping fees are calculated at checkout based on the destination country and selected shipping method. The applicable fee will be clearly displayed before you complete your purchase.</p>

        <h2>Free Shipping</h2>
        <p>Free shipping may be offered on orders that meet a minimum purchase threshold. When applicable, the current threshold and terms will be displayed at checkout.</p>

        <h2>Order Tracking</h2>
        <p>Once your order is dispatched, we will provide a tracking number via email where available. Please allow up to 48 hours for tracking information to update after dispatch. If you do not receive tracking information within the expected timeframe, please contact our customer service team.</p>

        <h2>Customs, Duties and Taxes</h2>
        <p>International orders may be subject to customs duties, import taxes, VAT and brokerage fees imposed by the destination country. <strong>These charges are the sole responsibility of the customer</strong> and are not included in the product price or shipping fee displayed at checkout. We recommend contacting your local customs office for more information before placing an order, as customs policies vary significantly by country.</p>

        <h2>Address Accuracy</h2>
        <p>Customers are responsible for providing a complete and accurate shipping address. We are not responsible for delays, losses or additional shipping charges resulting from incorrect or incomplete address information. Please verify your shipping address carefully before completing your purchase.</p>

        <h2>Delivery Delays</h2>
        <p>Estimated delivery times are not guaranteed. Delays may occur due to carrier issues, customs processing, weather conditions, public holidays or other factors outside our control. We are not able to refund or cancel orders solely due to delivery delays within the estimated delivery window.</p>

        <h2>Lost or Damaged Parcels</h2>
        <p>If your parcel is lost in transit or arrives damaged, please contact us at <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a> with your order number and supporting information (photos of damage, if applicable). We will assist you in resolving the issue, including filing a claim with the carrier if necessary.</p>

        <h2>Shipping Restrictions</h2>
        <p>We currently do not ship to PO boxes, APO/FPO addresses or certain remote areas. If you are unsure whether we can deliver to your location, please contact us before placing your order.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Shipping Policy, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a></li>
          <li><strong>Phone:</strong> {BUSINESS_INFO.phone}</li>
        </ul>
      </div>
    </div>
  );
}
