/**
 * Unified shipping countries configuration.
 * Single source of truth for all shipping-related country data.
 * ISO 3166-1 alpha-2 codes are used internally throughout the system.
 */

export type ShippingCountry = {
  code: string;
  name: string;
  region:
    | "north-america"
    | "south-america"
    | "europe"
    | "oceania"
    | "east-asia"
    | "southeast-asia"
    | "middle-east";
  enabled: boolean;
  requiresRegion: boolean;
  requiresPostalCode: boolean;
};

export const SHIPPING_COUNTRIES: ShippingCountry[] = [
  // ── North America (3) ──
  { code: "US", name: "United States", region: "north-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "CA", name: "Canada", region: "north-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "MX", name: "Mexico", region: "north-america", enabled: true, requiresRegion: true, requiresPostalCode: true },

  // ── South America (12) ──
  { code: "AR", name: "Argentina", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "BO", name: "Bolivia", region: "south-america", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "BR", name: "Brazil", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "CL", name: "Chile", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "CO", name: "Colombia", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "EC", name: "Ecuador", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "GY", name: "Guyana", region: "south-america", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "PY", name: "Paraguay", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "PE", name: "Peru", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "SR", name: "Suriname", region: "south-america", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "UY", name: "Uruguay", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "VE", name: "Venezuela", region: "south-america", enabled: true, requiresRegion: true, requiresPostalCode: true },

  // ── Europe (28) ──
  { code: "GB", name: "United Kingdom", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "DE", name: "Germany", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "FR", name: "France", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "IT", name: "Italy", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "ES", name: "Spain", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "AT", name: "Austria", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "BE", name: "Belgium", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "BG", name: "Bulgaria", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "HR", name: "Croatia", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "CY", name: "Cyprus", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "CZ", name: "Czechia", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "DK", name: "Denmark", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "EE", name: "Estonia", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "FI", name: "Finland", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "GR", name: "Greece", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "HU", name: "Hungary", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "IE", name: "Ireland", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "LV", name: "Latvia", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "LT", name: "Lithuania", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "LU", name: "Luxembourg", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "MT", name: "Malta", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "NL", name: "Netherlands", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "PL", name: "Poland", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "PT", name: "Portugal", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "RO", name: "Romania", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "SK", name: "Slovakia", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "SI", name: "Slovenia", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "SE", name: "Sweden", region: "europe", enabled: true, requiresRegion: false, requiresPostalCode: true },

  // ── Oceania (2) ──
  { code: "AU", name: "Australia", region: "oceania", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "NZ", name: "New Zealand", region: "oceania", enabled: true, requiresRegion: false, requiresPostalCode: true },

  // ── East Asia (6) ──
  { code: "CN", name: "China", region: "east-asia", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "HK", name: "Hong Kong", region: "east-asia", enabled: true, requiresRegion: false, requiresPostalCode: false },
  { code: "MO", name: "Macao", region: "east-asia", enabled: true, requiresRegion: false, requiresPostalCode: false },
  { code: "TW", name: "Taiwan", region: "east-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "JP", name: "Japan", region: "east-asia", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "KR", name: "South Korea", region: "east-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },

  // ── Southeast Asia (11) ──
  { code: "SG", name: "Singapore", region: "southeast-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "MY", name: "Malaysia", region: "southeast-asia", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "TH", name: "Thailand", region: "southeast-asia", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "VN", name: "Vietnam", region: "southeast-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "PH", name: "Philippines", region: "southeast-asia", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "ID", name: "Indonesia", region: "southeast-asia", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "BN", name: "Brunei", region: "southeast-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "KH", name: "Cambodia", region: "southeast-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "LA", name: "Laos", region: "southeast-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "MM", name: "Myanmar", region: "southeast-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "TL", name: "Timor-Leste", region: "southeast-asia", enabled: true, requiresRegion: false, requiresPostalCode: true },

  // ── Middle East (10) ──
  { code: "AE", name: "United Arab Emirates", region: "middle-east", enabled: true, requiresRegion: true, requiresPostalCode: false },
  { code: "SA", name: "Saudi Arabia", region: "middle-east", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "QA", name: "Qatar", region: "middle-east", enabled: true, requiresRegion: true, requiresPostalCode: false },
  { code: "KW", name: "Kuwait", region: "middle-east", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "BH", name: "Bahrain", region: "middle-east", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "OM", name: "Oman", region: "middle-east", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "IL", name: "Israel", region: "middle-east", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "TR", name: "Türkiye", region: "middle-east", enabled: true, requiresRegion: true, requiresPostalCode: true },
  { code: "JO", name: "Jordan", region: "middle-east", enabled: true, requiresRegion: false, requiresPostalCode: true },
  { code: "LB", name: "Lebanon", region: "middle-east", enabled: true, requiresRegion: false, requiresPostalCode: true },
];

export const ENABLED_SHIPPING_COUNTRY_CODES = new Set(
  SHIPPING_COUNTRIES.filter((c) => c.enabled).map((c) => c.code)
);

export const ENABLED_SHIPPING_COUNTRIES = SHIPPING_COUNTRIES.filter((c) => c.enabled);

export function isShippingCountrySupported(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  return ENABLED_SHIPPING_COUNTRY_CODES.has(code.trim().toUpperCase());
}

export function getCountryByCode(code: string): ShippingCountry | undefined {
  if (!code || typeof code !== "string") return undefined;
  return SHIPPING_COUNTRIES.find((c) => c.code === code.trim().toUpperCase());
}

export const RESTRICTED_MIDDLE_EAST_CODES = new Set([
  "IR", "IQ", "SY", "YE", "PS",
]);

export const AFRICA_COUNTRY_CODES = new Set([
  "ZA", "EG", "NG", "KE", "MA", "GH", "ET", "TZ", "DZ", "TN", "UG", "LY", "SD",
  "ZM", "ZW", "MZ", "AO", "CM", "CI", "SN", "ML", "BF", "MW", "NE", "TD", "SO",
  "CD", "RW", "DJ", "BI", "SL", "TG", "LR", "CF", "ER", "GM", "CV", "ST", "GQ",
  "GA", "BW", "LS", "SZ", "KM", "MU", "SC", "MR",
]);
