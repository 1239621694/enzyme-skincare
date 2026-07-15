import { BUSINESS_INFO, getEffectiveDate } from "@/lib/business-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Enzyme Skincare",
  description: `Review processing times, delivery estimates, shipping charges and customs information for orders from ${BUSINESS_INFO.website}.`,
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto prose prose-neutral">
        <h1>Shipping Policy</h1>
        <p className="text-sm text-neutral-500">Effective Date: {getEffectiveDate()}</p>

        <h2>Order Processing Time</h2>
        <p>Orders are typically processed and dispatched within <strong>{BUSINESS_INFO.processingTime}</strong> of payment confirmation. Processing time may be longer during promotional periods or public holidays.</p>

        <h2>Estimated Dispatch</h2>
        <p>{BUSINESS_INFO.estimatedDispatch}.</p>

        <h2>Shipping Countries</h2>
        <p>We currently ship to the following countries: {BUSINESS_INFO.shippingCountries.join(", ")}.</p>

        <h2>Shipping Fees</h2>
        <p>Shipping fees are calculated at checkout based on the destination and selected shipping method. The applicable fee will be displayed before you complete your purchase.</p>

        <h2>Free Shipping</h2>
        <p>Free shipping may be offered on orders over a certain amount, when applicable. The current threshold and terms are displayed during checkout.</p>

        <h2>Tracking</h2>
        <p>Once your order is dispatched, we will provide a tracking number where available. Please allow up to 48 hours for tracking information to update after dispatch.</p>

        <h2>Customs and Import Duties</h2>
        <p>International orders may be subject to customs duties, import taxes, VAT and brokerage fees imposed by the destination country. These charges are the <strong>responsibility of the customer</strong> and are not included in the product or shipping price. We recommend contacting your local customs office for more information before placing an order.</p>

        <h2>Address Accuracy</h2>
        <p>Customers are responsible for providing a complete and accurate shipping address. We are not responsible for delays or losses caused by incorrect address information.</p>

        <h2>Delivery Delays</h2>
        <p>Estimated delivery times are not guaranteed. Delays may occur due to carrier issues, customs processing, weather conditions or other factors outside our control.</p>

        <h2>Lost or Damaged Parcels</h2>
        <p>If your parcel is lost or arrives damaged, please contact our customer support team at <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a> with your order number and supporting information. We will assist you in resolving the issue.</p>

        <h2>Restrictions</h2>
        <p>We currently do not ship to PO boxes, APO/FPO addresses or certain remote areas. If you are unsure whether we can deliver to your location, please contact us before placing your order.</p>

        <h2>Contact</h2>
        <p>For shipping-related questions, please email <a href={`mailto:${BUSINESS_INFO.supportEmail}`}>{BUSINESS_INFO.supportEmail}</a>.</p>
      </div>
    </div>
  );
}
