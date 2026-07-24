/**
 * Comprehensive tests for shipping countries configuration.
 * Run with: npx ts-node scripts/test-shipping-countries.ts
 */
import {
  SHIPPING_COUNTRIES,
  ENABLED_SHIPPING_COUNTRY_CODES,
  ENABLED_SHIPPING_COUNTRIES,
  isShippingCountrySupported,
  getCountryByCode,
  RESTRICTED_MIDDLE_EAST_CODES,
  AFRICA_COUNTRY_CODES,
} from "../src/config/shipping-countries.js";

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.error(`  ❌ ${label}`);
  }
}

// ==============================
// 1. Total count verification
// ==============================
console.log("\n📊 Total countries count");
const EXPECTED_TOTAL = 72;
assert(SHIPPING_COUNTRIES.length === EXPECTED_TOTAL, `Total countries in config: ${SHIPPING_COUNTRIES.length} (expected ${EXPECTED_TOTAL})`);
assert(ENABLED_SHIPPING_COUNTRIES.length === EXPECTED_TOTAL, `All ${EXPECTED_TOTAL} countries should be enabled`);

// ==============================
// 2. All 72 countries present
// ==============================
console.log("\n🌍 All 72 countries present");
const ALL_CODES = new Set(SHIPPING_COUNTRIES.map(c => c.code));
const expectedCodes = [
  // North America (3)
  "US", "CA", "MX",
  // South America (12)
  "AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE",
  // Europe (28)
  "GB", "DE", "FR", "IT", "ES", "AT", "BE", "BG", "HR", "CY", "CZ", "DK",
  "EE", "FI", "GR", "HU", "IE", "LV", "LT", "LU", "MT", "NL", "PL", "PT",
  "RO", "SK", "SI", "SE",
  // Oceania (2)
  "AU", "NZ",
  // East Asia (6)
  "CN", "HK", "MO", "TW", "JP", "KR",
  // Southeast Asia (11)
  "SG", "MY", "TH", "VN", "PH", "ID", "BN", "KH", "LA", "MM", "TL",
  // Middle East (10)
  "AE", "SA", "QA", "KW", "BH", "OM", "IL", "TR", "JO", "LB",
];
assert(expectedCodes.length === EXPECTED_TOTAL, `Expected codes list has ${expectedCodes.length} entries`);
for (const code of expectedCodes) {
  assert(ALL_CODES.has(code), `${code} is present in SHIPPING_COUNTRIES`);
}

// ==============================
// 3. All countries enabled
// ==============================
console.log("\n✅ All countries enabled");
for (const c of SHIPPING_COUNTRIES) {
  assert(c.enabled === true, `${c.code} is enabled`);
}
assert(ENABLED_SHIPPING_COUNTRY_CODES.size === EXPECTED_TOTAL, `ENABLED_SHIPPING_COUNTRY_CODES has ${EXPECTED_TOTAL} entries`);

// ==============================
// 4. Region assignments
// ==============================
console.log("\n🗺️ Region assignments");
const regions = [...new Set(SHIPPING_COUNTRIES.map(c => c.region))];
assert(regions.length === 7, `7 regions defined (got ${regions.length})`);
assert(regions.includes("north-america"), "Has north-america");
assert(regions.includes("south-america"), "Has south-america");
assert(regions.includes("europe"), "Has europe");
assert(regions.includes("oceania"), "Has oceania");
assert(regions.includes("east-asia"), "Has east-asia");
assert(regions.includes("southeast-asia"), "Has southeast-asia");
assert(regions.includes("middle-east"), "Has middle-east");

// ==============================
// 5. Country-specific postal code rules
// ==============================
console.log("\n📮 Postal code rules");
const hk = getCountryByCode("HK");
assert(hk !== undefined, "HK exists");
assert(hk!.requiresPostalCode === false, "HK does NOT require postal code");

const mo = getCountryByCode("MO");
assert(mo !== undefined, "MO exists");
assert(mo!.requiresPostalCode === false, "MO does NOT require postal code");

const ae = getCountryByCode("AE");
assert(ae !== undefined, "AE exists");
assert(ae!.requiresPostalCode === false, "AE does NOT require postal code");

const qa = getCountryByCode("QA");
assert(qa !== undefined, "QA exists");
assert(qa!.requiresPostalCode === false, "QA does NOT require postal code");

// US requires postal code
const us = getCountryByCode("US");
assert(us !== undefined, "US exists");
assert(us!.requiresPostalCode === true, "US requires postal code");
assert(us!.requiresRegion === true, "US requires state/region");

// Singapore: postal code required, region not required
const sg = getCountryByCode("SG");
assert(sg !== undefined, "SG exists");
assert(sg!.requiresPostalCode === true, "SG requires postal code");
assert(sg!.requiresRegion === false, "SG does NOT require state");

// ==============================
// 6. isShippingCountrySupported — allowed countries
// ==============================
console.log("\n✅ isShippingCountrySupported — allowed");
const allowedTests = ["US", "MX", "BR", "AR", "GB", "DE", "JP", "HK", "SG", "MY", "AE", "SA", "AU", "NZ"];
for (const code of allowedTests) {
  assert(isShippingCountrySupported(code), `${code} is supported`);
}

// ==============================
// 7. isShippingCountrySupported — rejected countries
// ==============================
console.log("\n❌ isShippingCountrySupported — rejected");
// African countries
const africanTests = ["ZA", "EG", "NG", "KE", "MA"];
for (const code of africanTests) {
  assert(!isShippingCountrySupported(code), `${code} (African) is NOT supported`);
}
// Restricted Middle East
const restrictedMideast = ["IR", "IQ", "SY", "YE", "PS"];
for (const code of restrictedMideast) {
  assert(!isShippingCountrySupported(code), `${code} (restricted ME) is NOT supported`);
  assert(RESTRICTED_MIDDLE_EAST_CODES.has(code), `${code} is in RESTRICTED_MIDDLE_EAST_CODES`);
}
// Other non-allowed
const otherRejected = ["RU", "BY", "AF", "PK", "KZ"];
for (const code of otherRejected) {
  assert(!isShippingCountrySupported(code), `${code} is NOT supported`);
}
// Edge cases
assert(!isShippingCountrySupported(""), "Empty string is NOT supported");
assert(!isShippingCountrySupported("  "), "Whitespace-only is NOT supported");
assert(!isShippingCountrySupported(null as any), "null is NOT supported");
assert(!isShippingCountrySupported(undefined as any), "undefined is NOT supported");
assert(!isShippingCountrySupported("USA"), "USA (3-letter) is NOT supported");
assert(!isShippingCountrySupported("United States"), "Full name is NOT supported");
assert(!isShippingCountrySupported("ZZ"), "ZZ (invalid) is NOT supported");

// ==============================
// 8. Normalization test
// ==============================
console.log("\n🔄 Normalization (trim + toUpperCase)");
assert(isShippingCountrySupported("us"), '"us" -> US is supported');
assert(isShippingCountrySupported(" br "), '" br " -> BR is supported');
// Note: "UK" is NOT ISO 3166-1 alpha-2 (GB is the correct code)
assert(!isShippingCountrySupported("Uk"), '"Uk" is NOT supported (ISO code is GB, not UK)');
assert(getCountryByCode("us")?.code === "US", 'getCountryByCode("us") returns US');
assert(getCountryByCode(" gb ")?.code === "GB", 'getCountryByCode(" gb ") returns GB');

// ==============================
// 9. Africa block check
// ==============================
console.log("\n🌍 Africa block");
const allAfrica = ["ZA", "EG", "NG", "KE", "MA", "GH", "ET", "TZ", "DZ", "TN", "UG", "LY", "SD"];
for (const code of allAfrica) {
  assert(AFRICA_COUNTRY_CODES.has(code), `${code} is in AFRICA_COUNTRY_CODES`);
  assert(!isShippingCountrySupported(code), `${code} is blocked by Africa exclusion`);
}

// ==============================
// 10. Unique codes
// ==============================
console.log("\n🔍 Uniqueness check");
const codes = SHIPPING_COUNTRIES.map(c => c.code);
const uniqueCodes = new Set(codes);
assert(codes.length === uniqueCodes.size, "All country codes are unique");

// ==============================
// Summary
// ==============================
console.log(`\n${"=".repeat(50)}`);
console.log(`📋 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
if (failed === 0) {
  console.log("✅ ALL TESTS PASSED\n");
} else {
  console.error(`❌ ${failed} TEST(S) FAILED\n`);
  process.exit(1);
}
