/**
 * Business information and compliance configuration.
 * Central source of truth for all legal, contact and policy data.
 * Import this file wherever company info is displayed.
 */

export const BUSINESS_INFO = {
  // Legal identity
  legalNameCN: "四川时代艺能文化传媒有限公司",
  legalNameEN: "Sichuan Shidai Yineng Culture Media Co., Ltd.",
  registrationNumber: "91510106MA6CTPMD1K",

  // Addresses
  registeredAddress: "成都市金牛区韦家碾一路118号2幢1103号附69号",
  operatingAddress: "成都市金牛区韦家碾一路118号2幢1103号",
  returnAddress: "成都市成华区汇融名城C区",

  // Contact
  supportEmail: "support@enzymeskincare.com",
  legalEmail: "legal@enzymeskincare.com",
  phone: "+86 13980551004",
  businessHours: "Monday to Friday, 10:00–20:00, China Standard Time (UTC+8)",

  // Online presence
  storeName: "Enzyme Skincare",
  brandName: "BELOYAN",
  website: "https://www.enzymeskincare.com",

  // Shipping & delivery
  processingTime: "1–3 business days after payment confirmation",
  internationalTransitTime: "14–30 business days",
  totalDeliveryEstimate: "Approximately 15–33 business days",
  shippingCountries: ["United Kingdom", "Germany", "France", "Italy", "Spain", "Mexico"],
  estimatedDispatch: "Orders dispatched within 3 working days",

  // Returns
  returnRequestWindow: "3 working days after delivery",
  damageNotificationWindow: "1 working day after delivery",
  refundProcessingTime: "3 working days after returned goods received",

  // Payment
  paymentMethods: ["Secure Payment"],
  currency: "USD",

  // Legal
  governingCountry: "People's Republic of China",
  governingLaw: "the laws of the People's Republic of China",
} as const;

/** Helper: full operator disclosure sentence */
export function getOperatorDisclosure(): string {
  return `EnzymeSkincare.com is operated by ${BUSINESS_INFO.legalNameEN} and offers ${BUSINESS_INFO.brandName} skincare products through its official online store.`;
}

/** Helper: effective date for policies */
export function getEffectiveDate(): string {
  return "July 15, 2026";
}
