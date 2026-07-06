# Code Review — Feature Gap Analysis

**Reviewer**: Principal Software Architect  
**Date**: 2026-06-30  
**Scope**: Coupon System, Referral System, Sales Attribution, Marketing Attribution, XTransfer Integration, Admin Reports  
**Methodology**: Static code review — 112 source files examined  

---

## Finding Summary

| Feature Area | Status | Change Requests |
|-------------|--------|----------------|
| Coupon System | ❌ Not Implemented | 5 change requests |
| Referral System | ❌ Not Implemented | 5 change requests |
| Sales Attribution | ❌ Not Implemented | 3 change requests |
| Marketing Attribution | ❌ Not Implemented | 3 change requests |
| XTransfer Integration | ⚠️ Partially Implemented | 2 change requests |
| Admin Reports | ❌ Not Implemented | 3 change requests |

---

## Feature 1: Coupon System

### Issue C1-1

**Priority**: Critical

**Problem**: No `Coupon` or `CouponUsage` models exist in `prisma/schema/prisma`.

**Root Cause**: This feature was never added to any sprint or task.

**Why it matters**: Without the database schema, no coupon feature can function. No discounts can be applied, tracked, or reported.

**Files that need modification**:
- `prisma/schema.prisma`

**Functions/components that need modification**:
- Add `model Coupon` block with fields: id, code (unique), type (PERCENTAGE/FIXED/FREE_SHIPPING), value, minOrderAmount, maxDiscount, usageLimit, usagePerUser, currentUses, startsAt, expiresAt, isActive, applicableProducts, minQuantity, firstTimeOnly, description, createdAt, updatedAt. Include `@@index([code])` and `@@index([isActive, expiresAt])`.
- Add `enum CouponType` with values: `PERCENTAGE`, `FIXED`, `FREE_SHIPPING`.
- Add `model CouponUsage` with fields: id, couponId (FK to Coupon), orderId (FK to Order), customerEmail, discountAmount, usedAt. Include `@@index([couponId])` and `@@index([customerEmail])`.
- Add to existing `model Order`: `couponId String?`, `couponCode String?`, `discountAmount Decimal?`

**Database changes**: Yes — 2 new tables (coupon, coupon_usage), 3 new fields on orders table

**API changes**: Not yet — schema change only

**UI changes**: None

**Acceptance criteria**:
- [ ] `npx prisma generate` succeeds
- [ ] `npx prisma db push` succeeds
- [ ] Coupon table visible in Prisma Studio with all fields
- [ ] CouponUsage table visible with FK to both Coupon and Order
- [ ] Order model has new coupon fields

**Verification steps**:
1. Run `npx prisma generate` — no errors
2. Run `npx prisma db push` — no errors
3. Open `npx prisma studio` — verify coupons and coupon_usages tables exist
4. Verify Order table shows couponId, couponCode, discountAmount columns

---

### Issue C1-2

**Priority**: Critical

**Problem**: No API endpoint exists for coupon validation (`POST /api/coupons/validate`).

**Root Cause**: Coupon system was never implemented.

**Why it matters**: Customers cannot apply discount codes in the cart. No ecommerce platform can operate without coupon support.

**Files that need modification**:
- NEW: `src/app/api/coupons/validate/route.ts`

**Functions/components that need modification**:
- New POST handler implementing coupon validation:
  1. Receive: `{ code, cartTotal, items[], customerEmail }`
  2. Lookup coupon by code (case-insensitive)
  3. Check isActive = true
  4. Check startsAt ≤ now ≤ expiresAt
  5. Check currentUses < usageLimit
  6. Count customer's past usages, compare to usagePerUser
  7. If firstTimeOnly, check customer has 0 past orders
  8. Check cartTotal ≥ minOrderAmount
  9. If applicableProducts is not empty, check all items are in the list
  10. Calculate discount: PERCENTAGE → min(value% × cartTotal, maxDiscount), FIXED → value, FREE_SHIPPING → shipping cost
  11. Return: `{ valid: true, type, value, discountAmount, finalTotal, description }`
  12. On failure: return `{ valid: false, reason: "COUPON_EXPIRED", message: "..." }`

**Error codes to support**: `COUPON_NOT_FOUND`, `COUPON_EXPIRED`, `COUPON_USAGE_LIMIT`, `MIN_ORDER_NOT_MET`, `PRODUCT_NOT_ELIGIBLE`, `FIRST_TIME_ONLY`, `ALREADY_USED`

**Database changes**: No

**API changes**: Yes — new POST endpoint

**UI changes**: None (API only)

**Acceptance criteria**:
- [ ] Valid coupon returns `{ valid: true, discountAmount }`
- [ ] Expired coupon returns `{ valid: false, reason: "COUPON_EXPIRED" }`
- [ ] Usage-limit-exceeded coupon returns appropriate error
- [ ] First-time-only coupon fails for returning customers
- [ ] Min-order-not-met coupon returns appropriate error
- [ ] Percentage coupon respects maxDiscount cap

**Verification steps**:
1. Create a test coupon via direct DB insert
2. `curl POST /api/coupons/validate` with valid code — returns 200 with discount
3. `curl` with expired code — returns 400 with error reason
4. `curl` with overused code — returns 400 with error reason

---

### Issue C1-3

**Priority**: Critical

**Problem**: No API endpoints for Admin Coupon CRUD operations.

**Root Cause**: Coupon system was never implemented.

**Why it matters**: Admin needs to create, list, update, and deactivate coupons from the dashboard.

**Files that need modification**:
- NEW: `src/app/api/admin/coupons/route.ts`
- NEW: `src/app/api/admin/coupons/[id]/route.ts`
- NEW: `src/app/api/admin/coupons/[id]/usages/route.ts`

**Functions/components that need modification**:
- `POST /api/admin/coupons` — Create coupon with all fields
- `GET /api/admin/coupons` — List coupons (paginated, filterable by isActive)
- `GET /api/admin/coupons/[id]` — Single coupon detail
- `PATCH /api/admin/coupons/[id]` — Update coupon fields
- `DELETE /api/admin/coupons/[id]` — Soft delete (isActive = false)
- `GET /api/admin/coupons/[id]/usages` — Usage history for a coupon

**Database changes**: No

**API changes**: Yes — 6 new endpoints

**UI changes**: None (API only)

**Acceptance criteria**:
- [ ] Create coupon with all fields — returns 201
- [ ] List coupons — returns paginated list
- [ ] Get single coupon — returns all fields
- [ ] Update coupon — changes persist
- [ ] Deactivate coupon — isActive becomes false
- [ ] Get usages — returns usage history

**Verification steps**: Test each endpoint with curl

---

### Issue C1-4

**Priority**: High

**Problem**: Cart sidebar has no coupon input UI.

**Root Cause**: Coupon system was never implemented.

**Why it matters**: Customers need a visible place to enter promo codes in the cart flow.

**Files that need modification**:
- `src/components/cart/CartSidebar.tsx`

**Functions/components that need modification**:
- Add coupon input section between subtotal display and checkout button:
  - Text input for coupon code
  - [Apply] button
  - States: idle / loading (validating) / success (show discount) / error (show message)
  - Remove coupon link when one is applied
- Add to local state: `couponCode`, `couponDiscount`, `couponError`, `isValidating`
- Add `handleApplyCoupon()` function:
  1. POST to `/api/coupons/validate` with code, cart items, email
  2. On success: update total, show discount breakdown
  3. On error: show error message below input
- Add `handleRemoveCoupon()` function: clear applied coupon, revert total

**Database changes**: No

**API changes**: No (consumes existing API from C1-2)

**UI changes**: Yes — coupon input, apply button, discount display, error messages

**Acceptance criteria**:
- [ ] Coupon input visible in cart sidebar
- [ ] Valid coupon shows discount line, updates total
- [ ] Invalid coupon shows error message
- [ ] Remove coupon reverts total
- [ ] Only one coupon can be applied at a time

**Verification steps**:
1. Open cart sidebar — see coupon input
2. Enter valid code — see discount
3. Enter invalid code — see error
4. Remove coupon — total reverts

---

### Issue C1-5

**Priority**: High

**Problem**: No admin page for coupon management.
.

**Root Cause**: Coupon system was never implemented.

**Why it matters**: Admin cannot create or manage coupons without a UI.

**Files that need modification**:
- NEW: `src/app/admin/coupons/page.tsx`
- NEW: `src/app/admin/coupons/create/page.tsx`
- NEW: `src/app/admin/coupons/[id]/page.tsx`

**Functions/components that need modification**:
- Coupons list page (table): code, type, value, usage, status, created date, actions
- Create coupon form: type selector (percentage/fixed/free shipping), value input, date pickers, usage limits, product restrictions, first-time-only toggle
- Coupon detail/edit page: pre-filled form, usage history table, deactivate button
- All pages need loading and error states, success toasts on mutations

**Database changes**: No

**API changes**: No (consumes existing API from C1-3)

**UI changes**: Yes — 3 new admin pages

**Acceptance criteria**:
- [ ] Coupon list shows all coupons with status
- [ ] Create coupon form validates all fields
- [ ] Created coupon appears in list
- [ ] Coupon detail shows usage history
- [ ] Deactivate button works
- [ ] Admin menu shows Coupons link

**Verification steps**:
1. Navigate to /admin/coupons — see list
2. Click Create — fill form — submit — see new coupon in list
3. Click coupon — see details — deactivate — status updates

---

## Feature 2: Referral System

### Issue C2-1

**Priority**: Critical

**Problem**: No `Referral` model exists in `prisma/schema.prisma`.

**Root Cause**: Referral system was never implemented.

**Why it matters**: Without the DB schema, no referral tracking can work.

**Files that need modification**:
- `prisma/schema.prisma`

**Functions/components that need modification**:
- Add `enum ReferralStatus` with values: `CLICKED`, `ORDERED`, `PAID`, `COMMISSIONED`
- Add `model Referral` with fields: id, referrerEmail, referrerCode (unique), visitorId, clickedAt, refereeEmail, orderId (FK to Order), commissionAmount, commissionPaid, paidAt, utmSource, utmMedium, utmCampaign, status (ReferralStatus), createdAt
- Add indexes: `@@index([referrerEmail])`, `@@index([referrerCode])`, `@@index([status])`
- Add to existing `model Order`: `referralId String?`, `referralCode String?`

**Database changes**: Yes — 1 new table (referral), 2 new fields on orders

**API changes**: Not yet

**UI changes**: None

**Acceptance criteria**:
- [ ] Schema generates without errors
- [ ] Referral table visible in Prisma Studio
- [ ] Order model has referralId and referralCode fields

**Verification steps**:
1. `npx prisma generate` — success
2. `npx prisma db push` — success

---

### Issue C2-2

**Priority**: High

**Problem**: No API for tracking referral link clicks.

**Root Cause**: Referral system was never implemented.

**Why it matters**: Referral links must be tracked at click time for attribution to work.

**Files that need modification**:
- NEW: `src/app/api/referrals/route.ts`

**Functions/components that need modification**:
- `POST /api/referrals/track`:
  1. Receive: `{ referrerCode, visitorId, utmSource?, utmMedium?, utmCampaign? }`
  2. Look up referrer by code
  3. Create Referral record (status: CLICKED)
  4. Set cookie `ref={referrerCode}` with 30-day expiry
  5. Return referral ID

**Database changes**: No

**API changes**: Yes — 1 new endpoint

**UI changes**: None

**Acceptance criteria**:
- [ ] Tracking a click creates a Referral record with CLICKED status
- [ ] Cookie is set with 30-day expiry

**Verification steps**:
1. `curl POST /api/referrals/track { referrerCode: "TEST123" }` — returns 200
2. Check DB: Referral record created

---

### Issue C2-3

**Priority**: High

**Problem**: No referral claim mechanism on order placement.

**Root Cause**: Referral system was never implemented.

**Why it matters**: The referral cookie must be read at checkout to attribute the sale.

**Files that need modification**:
- `src/app/api/checkout/route.ts`

**Functions/components that need modification**:
- Read `ref` cookie from request
- If present: look up Referral by code, update status to ORDERED, link orderId, store refereeEmail
- Store referralId on the Order being created

**Database changes**: No

**API changes**: Yes — modify existing checkout endpoint

**UI changes**: None

**Acceptance criteria**:
- [ ] Order placed with referral cookie updates Referral status to ORDERED
- [ ] Order stores referralId
- [ ] Order without referral cookie works normally

**Verification steps**:
1. Set cookie `ref=TEST123` on browser
2. Place order
3. Check DB: Referral record now has ORDERED status and orderId

---

### Issue C2-4

**Priority**: Medium

**Problem**: No customer-facing referral dashboard.

**Root Cause**: Referral system was never implemented.

**Why it matters**: Referrers need to see their clicks, conversions, and commissions.

**Files that need modification**:
- NEW: `src/app/account/referrals/page.tsx`
- NEW: `src/app/api/referrals/dashboard/route.ts`

**Functions/components that need modification**:
- API: `GET /api/referrals/dashboard?email={email}` returns:
  - Total clicks, conversions, conversion rate
  - Pending commission, paid commission
  - Recent referral activity (table)
  - Referral link to share
- Page: Display stats, activity table, copyable referral link, share buttons (WhatsApp, email, copy)

**Database changes**: No

**API changes**: Yes — 1 new endpoint

**UI changes**: Yes — 1 new page

**Acceptance criteria**:
- [ ] Customer can see their referral stats
- [ ] Referral link is copyable
- [ ] Activity table shows recent referrals

**Verification steps**:
1. Navigate to /account/referrals — see stats
2. Copy referral link — check it contains ref code

---

### Issue C2-5

**Priority**: Medium

**Problem**: No admin referral management pages.

**Root Cause**: Referral system was never implemented.

**Why it matters**: Admin needs to monitor referral performance.

**Files that need modification**:
- NEW: `src/app/admin/referrals/page.tsx`
- NEW: `src/app/api/admin/referrals/route.ts`
- NEW: `src/app/api/admin/referrals/stats/route.ts`

**Functions/components that need modification**:
- API: `GET /api/admin/referrals` — list all referrals (paginated, filterable by status)
- API: `GET /api/admin/referrals/stats` — total referrals, conversion rate, commission due/paid
- Page: Referral list table, stats cards

**Database changes**: No

**API changes**: Yes — 2 new endpoints

**UI changes**: Yes — 1 new page, 1 new nav link

**Acceptance criteria**:
- [ ] Admin can view all referrals
- [ ] Stats show correct conversion data

**Verification steps**:
1. Navigate to /admin/referrals — see list
2. Check stats match DB data

---

## Feature 3: Sales Attribution

### Issue C3-1

**Priority**: Critical

**Problem**: No `SalesRep` model exists in `prisma/schema.prisma`.

**Root Cause**: Sales attribution was never implemented.

**Why it matters**: Without the schema, sales reps cannot be tracked or commissioned.

**Files that need modification**:
- `prisma/schema.prisma`

**Functions/components that need modification**:
- Add `model SalesRep` with fields: id, name, email (unique), phone, salesCode (unique), commissionRate, passwordHash, isActive, notes, createdAt, updatedAt. Include `@@index([salesCode])`.
- Add to existing `model Order`: `salesRepId String?`, `salesCode String?`

**Database changes**: Yes — 1 new table, 2 new fields on orders

**API changes**: Not yet

**UI changes**: None

**Acceptance criteria**:
- [ ] Schema generates without errors
- [ ] SalesRep table visible

**Verification steps**:
1. `npx prisma generate` — success

---

### Issue C3-2

**Priority**: High

**Problem**: No SalesRep CRUD API or login.

**Root Cause**: Sales attribution was never implemented.

**Why it matters**: Admin cannot create sales reps or view their performance.

**Files that need modification**:
- NEW: `src/app/api/admin/sales-reps/route.ts`
- NEW: `src/app/api/admin/sales-reps/[id]/route.ts`
- NEW: `src/app/api/admin/sales-reps/stats/route.ts`
- NEW: `src/app/api/sales/login/route.ts`

**Functions/components that need modification**:
- CRUD for sales reps
- Stats: orders per rep, total commission, commission paid/unpaid
- Sales rep login (separate from admin auth)

**Database changes**: No

**API changes**: Yes — 4 new endpoints

**UI changes**: None

**Acceptance criteria**:
- [ ] Create sales rep with unique salesCode
- [ ] List sales reps with stats
- [ ] Sales rep can login

**Verification steps**: Test each endpoint with curl

---

### Issue C3-3

**Priority**: Medium

**Problem**: Checkout does not accept or store sales code.

**Root Cause**: Sales attribution was never implemented.

**Why it matters**: Sales reps cannot be attributed to orders.

**Files that need modification**:
- `src/app/api/checkout/route.ts`

**Functions/components that need modification**:
- Accept optional `salesCode` parameter in request body
- When present: look up SalesRep by code, store salesRepId + salesCode on Order

**Database changes**: No

**API changes**: Yes — modify existing checkout endpoint

**UI changes**: None

**Acceptance criteria**:
- [ ] Checkout with salesCode stores it on Order
- [ ] Checkout without salesCode works normally

**Verification steps**:
1. `curl POST /api/checkout { salesCode: "SALES-ALICE-001" }` — order has salesCode
2. `curl POST /api/checkout {}` — order has null salesCode

---

## Feature 4: Marketing Attribution

### Issue C4-1

**Priority**: Medium

**Problem**: No `MarketingEvent` model exists in `prisma/schema.prisma`.

**Root Cause**: Marketing attribution was never implemented.

**Why it matters**: Without the schema, UTM and campaign data cannot be stored.

**Files that need modification**:
- `prisma/schema.prisma`

**Functions/components that need modification**:
- Add `model MarketingEvent` with fields: id, sessionId, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, landingPage, referrerUrl, userAgent, ipAddress, orderId (FK to Order), firstVisit, convertedAt
- Add indexes: `@@index([sessionId])`, `@@index([utmSource, utmCampaign])`, `@@index([orderId])`
- Add to existing `model Order`: `utmSource String?`, `utmMedium String?`, `utmCampaign String?`

**Database changes**: Yes — 1 new table, 3 new fields on orders

**API changes**: Not yet

**UI changes**: None

**Acceptance criteria**:
- [ ] Schema generates without errors
- [ ] MarketingEvent table visible

**Verification steps**:
1. `npx prisma generate` — success

---

### Issue C4-2

**Priority**: Medium

**Problem**: No API for tracking UTM parameters on landing. No client-side UTM capture.

**Root Cause**: Marketing attribution was never implemented.

**Why it matters**: Without UTM capture, marketing campaign ROI cannot be measured.

**Files that need modification**:
- NEW: `src/app/api/marketing/track/route.ts`
- NEW: `src/app/api/marketing/associate/route.ts`

**Functions/components that need modification**:
- `POST /api/marketing/track`:
  1. Receive: `{ sessionId, utmSource?, utmMedium?, utmCampaign?, landingPage?, referrerUrl?, userAgent?, ipAddress? }`
  2. Create or update MarketingEvent with sessionId (upsert on sessionId)
  3. Return event ID
- `POST /api/marketing/associate`:
  1. Receive: `{ sessionId, orderId }`
  2. Find MarketingEvent by sessionId
  3. Update orderId, set convertedAt
  4. Copy utm fields to Order

**Database changes**: No

**API changes**: Yes — 2 new endpoints

**UI changes**: None

**Acceptance criteria**:
- [ ] Tracking endpoint creates MarketingEvent
- [ ] Association endpoint links event to order

**Verification steps**:
1. POST /api/marketing/track — creates record
2. POST /api/marketing/associate — links to order

---

### Issue C4-3

**Priority**: Medium

**Problem**: No client-side component to capture UTM from URL and call track API.

**Root Cause**: Marketing attribution was never implemented.

**Why it matters**: UTM parameters come from URL query strings on landing — they must be captured at page load.

**Files that need modification**:
- NEW: `src/components/tracking/UTMTracker.tsx`

**Functions/components that need modification**:
- Client component that:
  1. On mount: read `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` from URL
  2. If any UTM param present: generate or read sessionId cookie
  3. POST to `/api/marketing/track` with UTM data
  4. Set cookie `session_id` (30 days)
- Add to `src/app/layout.tsx` — render `<UTMTracker />` after body

**Database changes**: No

**API changes**: No (consumes API from C4-2)

**UI changes**: No visible UI — tracking only

**Acceptance criteria**:
- [ ] Visiting a page with `?utm_source=tiktok` creates a MarketingEvent
- [ ] UTM data persists via session cookie across pages
- [ ] No cookies set, no API call if no UTM params present

**Verification steps**:
1. Visit `/?utm_source=tiktok&utm_campaign=summer_sale`
2. Check DB: MarketingEvent created with utmSource=tiktok
3. Place order — check MarketingEvent linked to order

---

## Feature 5: XTransfer Integration

### Issue C5-1

**Priority**: Medium

**Problem**: Payment model has `invoiceUrl` but lacks `invoiceNumber` and `paymentNote` fields.

**Root Cause**: Initial XTransfer integration only stored the invoice URL.

**Why it matters**: Admin needs to track invoice number and add payment notes for reconciliation.

**Files that need modification**:
- `prisma/schema.prisma`

**Functions/components that need modification**:
- Add to `model Payment`: `invoiceNumber String?` (new), `paymentNote String?` (new)

**Database changes**: Yes — 2 new fields on payments table

**API changes**: Not yet

**UI changes**: None

**Acceptance criteria**:
- [ ] Schema generates without errors
- [ ] Payment table has new fields

**Verification steps**:
1. `npx prisma generate` — success

---

### Issue C5-2

**Priority**: Medium

**Problem**: Admin order detail page has XTransfer fields but no invoice number or payment note inputs.

**Root Cause**: The admin UI was built before these fields were needed.

**Why it matters**: Admin needs to input invoice number and notes when managing XTransfer payments.

**Files that need modification**:
- `src/app/admin/orders/[id]/page.tsx`

**Functions/components that need modification**:
- Extend the "Attach XTransfer Payment Link" section to include:
  - Invoice URL input (existing)
  - Invoice Number input (new)
  - Payment Note textarea (new)
- Extend the "Mark as Paid" section to include:
  - Note input (existing)
  - Display invoice number when set
  - Display payment note when set
- All new fields must be stored on the Payment record via the existing API

**Database changes**: No

**API changes**: Yes — modify existing POST /api/admin/orders/[id]/payments to accept `invoiceNumber` and `paymentNote`

**UI changes**: Yes — new form fields on admin order detail page

**Acceptance criteria**:
- [ ] Admin can input invoice number and payment note when attaching payment
- [ ] Fields are saved to Payment record
- [ ] Existing functionality unchanged
- [ ] Fields display when viewing payment detail

**Verification steps**:
1. Open admin order detail for a PENDING_PAYMENT order
2. Attach XTransfer payment with invoice URL, invoice number, and note
3. Verify all three stored in Payment record
4. View order — fields displayed

---

## Feature 6: Admin Reports

### Issue C6-1

**Priority**: Medium

**Problem**: No report API endpoints exist.

**Root Cause**: Reporting was never implemented.

**Why it matters**: Admin needs data to make business decisions.

**Files that need modification**:
- NEW: `src/app/api/admin/reports/revenue/route.ts`
- NEW: `src/app/api/admin/reports/coupons/route.ts`
- NEW: `src/app/api/admin/reports/marketing/route.ts`

**Functions/components that need modification**:
- `GET /api/admin/reports/revenue?period=day|week|month`:
  - Aggregate revenue by period
  - Return: `{ periods: [{ date, revenue, orders }], totals: { revenue, orders } }`
- `GET /api/admin/reports/coupons?period=month`:
  - Aggregate coupon usage by coupon code
  - Return: `{ coupons: [{ code, uses, totalDiscount }] }`
- `GET /api/admin/reports/marketing?period=month`:
  - Aggregate traffic/conversions by utmSource
  - Return: `{ sources: [{ source, visits, conversions, revenue }] }`

**Database changes**: No

**API changes**: Yes — 3 new endpoints

**UI changes**: None

**Acceptance criteria**:
- [ ] Revenue report returns periodized data
- [ ] Coupon report shows usage by coupon
- [ ] Marketing report shows traffic by source

**Verification steps**: Test each endpoint with curl

---

### Issue C6-2

**Priority**: Low

**Problem**: Admin dashboard doesn't show report data.

**Root Cause**: Reporting was never implemented.

**Why it matters**: Admin needs visibility into key metrics.

**Files that need modification**:
- `src/app/admin/page.tsx`

**Functions/components that need modification**:
- Add report sections below existing dashboard:
  - "Revenue (This Week)" card
  - "Active Coupons" count
  - "Top Traffic Sources" mini-table
  - "Recent Referrals" mini-table
- Data sourced from reports API (C6-1)

**Database changes**: No

**API changes**: No (consumes reports API)

**UI changes**: Yes — new dashboard sections

**Acceptance criteria**:
- [ ] Dashboard shows revenue KPI
- [ ] Dashboard shows coupon KPI
- [ ] Dashboard shows traffic sources (once data exists)

**Verification steps**:
1. Navigate to /admin — see new KPIs

---

### Issue C6-3

**Priority**: Low

**Problem**: No dedicated reports page.

**Root Cause**: Reporting was never implemented.

**Why it matters**: Admin needs a full-page report view with filters.

**Files that need modification**:
- NEW: `src/app/admin/reports/page.tsx`
- `src/app/admin/layout.tsx` (add nav link)

**Functions/components that need modification**:
- Reports page with:
  - Period selector (7d / 30d / 90d)
  - Revenue chart (simple bar chart, CSS-only)
  - Coupon performance table
  - Traffic source breakdown
  - Referral performance metrics
- All data from reports API

**Database changes**: No

**API changes**: No (consumes reports API)

**UI changes**: Yes — 1 new page, 1 new nav link

**Acceptance criteria**:
- [ ] Reports page renders with data
- [ ] Period selector changes data

**Verification steps**:
1. Navigate to /admin/reports — see reports

---

## Master Task List — Summary

| ID | Feature | Task | Priority | Est. Time | Depends On |
|----|---------|------|----------|-----------|------------|
| C1-1 | Coupon | Schema + Models | Critical | 30 min | None |
| C1-2 | Coupon | Validate API | Critical | 45 min | C1-1 |
| C1-3 | Coupon | Admin CRUD API | Critical | 45 min | C1-1 |
| C1-4 | Coupon | Cart UI | High | 30 min | C1-2 |
| C1-5 | Coupon | Admin Pages | High | 45 min | C1-3 |
| C2-1 | Referral | Schema | Critical | 20 min | None |
| C2-2 | Referral | Track API | High | 30 min | C2-1 |
| C2-3 | Referral | Checkout Claim | High | 20 min | C2-1 |
| C2-4 | Referral | Customer Dashboard | Medium | 30 min | C2-3 |
| C2-5 | Referral | Admin Pages | Medium | 30 min | C2-1 |
| C3-1 | Sales | SalesRep Schema | Critical | 20 min | None |
| C3-2 | Sales | SalesRep API | High | 45 min | C3-1 |
| C3-3 | Sales | Checkout Integration | Medium | 20 min | C3-1 |
| C4-1 | Marketing | MarketingEvent Schema | Medium | 20 min | None |
| C4-2 | Marketing | Track + Associate API | Medium | 30 min | C4-1 |
| C4-3 | Marketing | Client UTM Tracker | Medium | 30 min | C4-2 |
| C5-1 | XTransfer | Schema Update | Medium | 15 min | None |
| C5-2 | XTransfer | Admin UI Update | Medium | 30 min | C5-1 |
| C6-1 | Reports | Report API | Medium | 45 min | C1-1, C2-1, C4-1 |
| C6-2 | Reports | Dashboard KPIs | Low | 20 min | C6-1 |
| C6-3 | Reports | Reports Page | Low | 30 min | C6-1 |

### Recommended Execution Order

```
Sprint 1 (Foundation — Schema Changes — can run in parallel):
  C1-1, C2-1, C3-1, C4-1, C5-1   ← All schema changes, non-conflicting

Sprint 2 (Core APIs):
  C1-2, C1-3, C2-2, C3-2, C4-2  ← Can run in parallel

Sprint 3 (Integration + UI):
  C1-4, C1-5, C2-3, C3-3, C4-3, C5-2

Sprint 4 (Reports):
  C6-1, C6-2, C2-4, C2-5, C6-3
```

**Total estimated engineering time**: ~11-12 hours (21 tasks)
