# Enzyme Skincare — Production Ecommerce Architecture

**Chief Product Architect** | **Date**: 2026-06-30  
**System**: DTC + XTransfer B2B Payment | **Scale**: 10,000+ visitors/day

---

## Table of Contents

1. [Database Schema](#1-database-schema)
2. [API Design](#2-api-design)
3. [UI Flow](#3-ui-flow)
4. [Security](#4-security)
5. [Acceptance Criteria](#5-acceptance-criteria)
6. [Codex Implementation Roadmap](#6-codex-implementation-roadmap)

---

## 1. Database Schema

### 1.1 Entity Relationship Overview

```
┌───────────┐     ┌──────────────┐     ┌──────────────┐
│  Orders   │─────│  Payments    │     │  Coupons     │
└───────────┘     └──────────────┘     └──────┬───────┘
       │                                      │
       │                                      │
┌──────┴──────┐     ┌──────────────┐     ┌──────┴───────┐
│ OrderItems  │     │ Referrals    │     │ CouponUsage  │
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
                           │
                    ┌──────┴───────┐     ┌──────────────┐
                    │ SalesReps    │─────│ Commissions  │
                    └──────────────┘     └──────────────┘

┌──────────────────┐
│ MarketingEvents  │
│ (UTM tracking)   │
└──────────────────┘
```

### 1.2 Coupon Model

```prisma
model Coupon {
  id              String     @id @default(uuid())
  code            String     @unique         // PROMO20, FREESHIP, etc.
  
  // Type
  type            CouponType                   // PERCENTAGE | FIXED | FREE_SHIPPING
  
  // Value
  value           Decimal    @db.Decimal(10, 2) // 20.00 = 20% or $20 off
  minOrderAmount  Decimal?   @db.Decimal(10, 2) // Minimum order total to apply
  maxDiscount     Decimal?   @db.Decimal(10, 2) // Max discount (for % coupons)
  
  // Usage
  usageLimit      Int?       @default(0)       // Total uses allowed (null = unlimited)
  usagePerUser    Int?       @default(1)       // Times per customer
  currentUses     Int        @default(0)
  
  // Time
  startsAt        DateTime?
  expiresAt       DateTime?
  isActive        Boolean    @default(true)
  
  // Restrictions
  applicableProducts String[] // Product IDs, empty = all products
  minQuantity      Int?       @default(1)
  firstTimeOnly    Boolean    @default(false)
  
  // Metadata
  description     String?
  createdBy       String?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  
  usages CouponUsage[]
  
  @@index([code])
  @@index([isActive, expiresAt])
  @@map("coupons")
}

enum CouponType {
  PERCENTAGE
  FIXED
  FREE_SHIPPING
}

model CouponUsage {
  id        String   @id @default(uuid())
  couponId  String
  coupon    Coupon   @relation(fields: [couponId], references: [id])
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  
  customerEmail String
  discountAmount Decimal @db.Decimal(10, 2)
  
  usedAt    DateTime @default(now())
  
  @@index([couponId])
  @@index([customerEmail])
  @@map("coupon_usages")
}
```

### 1.3 Referral Model

```prisma
model Referral {
  id              String     @id @default(uuid())
  referrerEmail   String               // Person who shares
  referrerCode    String     @unique    // "SARAH123" — auto-generated
  
  // Cookie tracking
  visitorId       String?              // Anonymous visitor ID
  clickedAt       DateTime?
  
  // Conversion
  refereeEmail    String?              // Person who purchases
  orderId         String?
  order           Order?     @relation(fields: [orderId], references: [id])
  
  // Commission
  commissionAmount Decimal?  @db.Decimal(10, 2)
  commissionPaid  Boolean    @default(false)
  paidAt          DateTime?
  
  // UTM
  utmSource       String?
  utmMedium       String?
  utmCampaign     String?
  
  status          ReferralStatus @default(CLICKED)  // CLICKED → ORDERED → PAID
  createdAt       DateTime   @default(now())
  
  @@index([referrerEmail])
  @@index([referrerCode])
  @@index([status])
  @@map("referrals")
}

enum ReferralStatus {
  CLICKED       // Link was clicked
  ORDERED       // Referred person placed order
  PAID          // Order was paid
  COMMISSIONED  // Commission was paid out
}
```

### 1.4 Sales Representative Model

```prisma
model SalesRep {
  id              String     @id @default(uuid())
  name            String
  email           String     @unique
  phone           String?
  
  // Sales code
  salesCode       String     @unique      // "SALES-ALICE-001"
  commissionRate  Decimal    @db.Decimal(5, 2) // 10.00 = 10%
  
  // Account
  passwordHash    String?
  isActive        Boolean    @default(true)
  notes           String?
  
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  
  orders Order[]
  
  @@index([salesCode])
  @@map("sales_reps")
}

// Add to Order model:
// salesRepId    String?   // Link to SalesRep
// salesCode     String?   // Snapshot at order time
```

### 1.5 Marketing Attribution Model

```prisma
model MarketingEvent {
  id              String     @id @default(uuid())
  sessionId       String               // Browser session ID (cookie)
  
  // UTM Parameters
  utmSource       String?              // google, facebook, tiktok
  utmMedium       String?              // cpc, social, email
  utmCampaign     String?              // summer_sale, brand_awareness
  utmTerm         String?              // keywords
  utmContent      String?              // ad_variant
  
  // Landing Page
  landingPage     String?              // /products, /promo/summer
  referrerUrl     String?              // Where they came from
  
  // Device
  userAgent       String?
  ipAddress       String?
  
  // Order
  orderId         String?
  order           Order?    @relation(fields: [orderId], references: [id])
  
  firstVisit      DateTime   @default(now())
  convertedAt     DateTime?
  
  @@index([sessionId])
  @@index([utmSource, utmCampaign])
  @@index([orderId])
  @@map("marketing_events")
}
```

### 1.6 Order Model Updates

Add to existing `Order` model:

```prisma
model Order {
  // ... existing fields ...
  
  // Coupon
  couponId        String?
  couponCode      String?              // Snapshot
  discountAmount  Decimal?   @db.Decimal(10, 2)
  
  // Referral
  referralId      String?
  
  // Sales Attribution
  salesRepId      String?
  salesRep        SalesRep?  @relation(fields: [salesRepId], references: [id])
  salesCode       String?              // Snapshot
  
  // Marketing Attribution
  utmSource       String?
  utmMedium       String?
  utmCampaign     String?
  
  // XTransfer
  xtransferInvoiceUrl    String?
  xtransferInvoiceNumber String?
  xtransferPaymentNote   String?
  xtransferStatus        String?       // pending, paid, confirmed
}
```

---

## 2. API Design

### 2.1 Coupon APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/coupons/validate` | Validate coupon code + calculate discount | Public |
| `POST` | `/api/admin/coupons` | Create coupon | Admin |
| `GET` | `/api/admin/coupons` | List coupons | Admin |
| `GET` | `/api/admin/coupons/{id}` | Coupon details | Admin |
| `PATCH` | `/api/admin/coupons/{id}` | Update coupon | Admin |
| `DELETE` | `/api/admin/coupons/{id}` | Deactivate coupon | Admin |
| `GET` | `/api/admin/coupons/{id}/usages` | Coupon usage history | Admin |

#### POST /api/coupons/validate

**Request**:
```json
{
  "code": "WELCOME20",
  "cartTotal": 100.00,
  "items": [{ "productId": "protease-renewal-kit", "quantity": 1 }],
  "customerEmail": "customer@example.com"
}
```

**Response** (valid):
```json
{
  "valid": true,
  "type": "PERCENTAGE",
  "value": 20.00,
  "discountAmount": 20.00,
  "finalTotal": 80.00,
  "description": "20% off your first order"
}
```

**Response** (invalid):
```json
{
  "valid": false,
  "reason": "COUPON_EXPIRED",
  "message": "This coupon has expired"
}
```

**Error Codes**: `COUPON_NOT_FOUND`, `COUPON_EXPIRED`, `COUPON_USAGE_LIMIT`, `MIN_ORDER_NOT_MET`, `PRODUCT_NOT_ELIGIBLE`, `FIRST_TIME_ONLY`, `ALREADY_USED`

### 2.2 Referral APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/referrals/{code}` | Get referral info + track click | Public |
| `POST` | `/api/referrals/claim` | Claim referral (on order) | Public |
| `GET` | `/api/referrals/dashboard` | Referral stats (for referrer) | Auth |
| `GET` | `/api/admin/referrals` | All referrals | Admin |
| `GET` | `/api/admin/referrals/stats` | Referral dashboard stats | Admin |

### 2.3 Sales Representative APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/sales/login` | Sales rep login | Public |
| `GET` | `/api/sales/dashboard` | Sales rep stats | Sales |
| `GET` | `/api/admin/sales-reps` | List sales reps | Admin |
| `POST` | `/api/admin/sales-reps` | Create sales rep | Admin |
| `PATCH` | `/api/admin/sales-reps/{id}` | Update sales rep | Admin |
| `GET` | `/api/admin/sales-reps/stats` | Sales performance | Admin |

### 2.4 Marketing Attribution APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/marketing/track` | Track UTM + session | Public |
| `POST` | `/api/marketing/associate` | Associate session with order | Public |
| `GET` | `/api/admin/marketing/report` | Marketing performance report | Admin |

### 2.5 XTransfer Payment APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/orders/{id}/payment` | Get payment info (Invoice URL) | Public |
| `POST` | `/api/admin/payments/xtransfer` | Create XTransfer payment record | Admin |
| `PATCH` | `/api/admin/payments/{id}/confirm` | Confirm XTransfer payment | Admin |
| `GET` | `/api/admin/payments` | List payments | Admin |

---

## 3. UI Flow

### 3.1 Customer: Coupon Application

```
Cart Sidebar
  │
  ├── [Enter coupon code] [Apply]
  │       │
  │       ├── Valid   → Show discount, update total
  │       ├── Invalid → Show error message
  │       └── Removed → Revert total
  │
  └── Checkout → Coupon applied to order
```

**Cart Sidebar Coupon Section**:
```
┌──────────────────────────────┐
│  Subtotal           $100.00  │
│  Discount (20%)     -$20.00  │
│  Shipping            $5.95   │
│  Total               $85.95  │
│                              │
│  ┌──────────────────────┐    │
│  │ Enter coupon code  [Apply]│
│  └──────────────────────┘    │
│  ✓ WELCOME20 applied         │
│                              │
│  [Proceed to XTransfer]      │
└──────────────────────────────┘
```

### 3.2 Customer: Referral Flow

```
Share Link
  │
  ├── Customer shares: https://enzymeskincare.com?ref=SARAH123
  │
  ├── Friend clicks link
  │     │
  │     ├── Cookie saved (30 days)
  │     ├── Referral record created (status: CLICKED)
  │     └── Friend browses normally
  │
  ├── Friend places order
  │     │
  │     ├── Referral found by cookie/URL param
  │     ├── Referral status: ORDERED
  │     └── Commission calculated
  │
  └── Admin confirms payment
        │
        ├── Referral status: PAID
        └── Referrer notified via email
```

### 3.3 Admin Dashboard Layout

```
/admin
├── /dashboard              # Main KPIs (revenue, orders, conversion)
├── /orders                 # Order management
├── /payments               # Payment management
│     └── /xtransfer        # XTransfer invoice management
├── /coupons                # Coupon CRUD
│     ├── /create
│     └── /{id}
├── /referrals              # Referral tracking
│     └── /stats            # Referral performance
├── /sales-reps             # Sales representative management
│     └── /stats
└── /marketing              # Marketing reports
      └── /reports          # Traffic source, campaign, UTM
```

### 3.4 Admin: Coupon Management Page

```
Create Coupon:
┌──────────────────────────────────────────┐
│  Coupon Code: [PROMO20      ] (Generate) │
│                                          │
│  Type: ○ Percentage  ○ Fixed  ○ Free Ship│
│  Value: [20] % / $                       │
│                                          │
│  Min Order: [0.00]                       │
│  Max Discount: [50.00]                   │
│                                          │
│  Starts: [2026-07-01] [00:00]            │
│  Expires: [2026-07-31] [23:59]           │
│                                          │
│  Usage Limit: [1000] (total)             │
│  Per Customer: [1]                       │
│  First Time Only: [✓]                    │
│                                          │
│  Products: All / Selected                │
│                                          │
│  [Create Coupon]                         │
└──────────────────────────────────────────┘
```

### 3.5 Admin: Orders Detail Page (Updated)

Add new cards to existing order detail:

```
Order #{orderNumber}
  │
  ├── [Existing: Customer, Address, Items, Status]
  │
  ├── [NEW: Coupon Applied]  (if applicable)
  │     Code: WELCOME20
  │     Discount: -$20.00
  │
  ├── [NEW: Referral Info]  (if applicable)
  │     Referred by: sarah@example.com
  │     Commission: $10.00 (pending)
  │
  ├── [NEW: Sales Attribution]  (if applicable)
  │     Sales Rep: Alice (SALES-ALICE-001)
  │     Commission Rate: 10%
  │
  ├── [NEW: Marketing Attribution]
  │     Source: tiktok
  │     Campaign: summer_sale
  │
  ├── [NEW: XTransfer Payment]
  │     Invoice URL: [link]
  │     Invoice Number: XT-20260701-001
  │     Payment Note: Order from TikTok campaign
  │     Status: PENDING
  │     [Mark as Paid] [Update Invoice]
```

---

## 4. Security

### 4.1 Coupon Security

| Risk | Mitigation |
|------|-----------|
| Coupon brute-force | Rate limit: 10 attempts/min per IP |
| Coupon stacking | Only one coupon per order enforced server-side |
| Coupon modification | Coupon value stored on coupon, read from DB at validation |
| Coupon reuse | Usage tracking + db-level constraint on coupon_usages |
| Customer restriction | Server-side check of customer purchase history |

### 4.2 Referral Security

| Risk | Mitigation |
|------|-----------|
| Self-referral | IP check + device fingerprint |
| Referral fraud | Require unique email for referee + minimum order amount |
| Cookie manipulation | Server-side referral code validation |
| Commission double-pay | Referral status state machine (can't go back) |

### 4.3 Sales Code Security

| Risk | Mitigation |
|------|-----------|
| Sales code guessing | Auto-generated: `SALES-{NAME}-{3 DIGITS}` |
| Commission tampering | Rate stored on SalesRep, read from DB |
| Unauthorized access | Sales rep login with password hash |

### 4.4 UTM Tracking Security

| Risk | Mitigation |
|------|-----------|
| Fake UTM data | Sanitize all input, limit string length |
| Cookie poisoning | Server-side session tracking as fallback |
| Data pollution | Regular cleanup of incomplete sessions |

### 4.5 XTransfer Security

| Risk | Mitigation |
|------|-----------|
| Invoice URL tampering | URL stored on server, validated on confirm |
| Double confirmation | Payment status check before confirmation |
| Amount mismatch | Confirm amount matches order total |

---

## 5. Acceptance Criteria

### 5.1 Coupon System

```
[ ] Admin can create coupon with type (percentage/fixed/free shipping)
[ ] Admin can set usage limits, expiration, and product restrictions
[ ] Customer can apply coupon in cart
[ ] Invalid coupon shows clear error message
[ ] Coupon usage counted correctly (not decremented on failed attempts)
[ ] Expired coupon returns COUPON_EXPIRED
[ ] Usage limit exceeded returns error
[ ] First-time-only coupon fails for returning customers
[ ] Max discount cap enforced for percentage coupons
[ ] Min order amount checked before applying
[ ] Only one coupon per order enforced
```

### 5.2 Referral System

```
[ ] Referral link generates unique code: enzymeskincare.com?ref=CODE123
[ ] Clicking referral link saves cookie (30 days)
[ ] Referral tracked in database (status: CLICKED)
[ ] When referred user orders, referral updates to ORDERED
[ ] When payment confirmed, referral updates to PAID
[ ] Referrer can view their stats (clicks, conversions, commissions)
[ ] Admin can view all referrals
[ ] Referral fraud prevention: unique email required
```

### 5.3 Sales Attribution

```
[ ] Admin can create sales rep with unique code
[ ] Sales code can be applied to order at checkout
[ ] Order stores salesRepId and salesCode as snapshot
[ ] Admin dashboard shows sales rep performance
[ ] Commission amount calculated and stored
[ ] Commission paid/unpaid status tracked
```

### 5.4 Marketing Attribution

```
[ ] Landing page tracks UTM parameters from URL
[ ] UTM data stored in marketing_events table
[ ] UTM data linked to order when conversion happens
[ ] Admin report shows: traffic by source, campaign, medium
[ ] UTM data persisted across pages (cookie/session)
```

### 5.5 XTransfer Integration

```
[ ] Admin can store Invoice URL per order
[ ] Admin can store Invoice Number per order
[ ] Admin can add payment notes
[ ] Customer can view Invoice URL on order page
[ ] Admin can mark payment as confirmed
[ ] Payment status tracked separately from order status
```

### 5.6 Admin Reports

```
[ ] Revenue report: daily/weekly/monthly totals
[ ] Revenue report: by product, source, campaign
[ ] Coupon report: usage by coupon, total discount given
[ ] Referral report: clicks, conversions, commission due/paid
[ ] Sales report: orders by rep, total commission
[ ] Marketing report: traffic by source, conversions by campaign
```

---

## 6. Codex Implementation Roadmap

### Sprint 1: Foundation — Coupon System

#### Task 1.1: Add Coupon Models to Prisma Schema

**Priority**: P0  
**Complexity**: ⭐  
**Files**: `prisma/schema.prisma`  
**DB Changes**: Yes — `coupon`, `coupon_usage` tables  
**API Changes**: None yet

**Changes**:
1. Add `Coupon` model with all fields (type, value, limits, dates, restrictions)
2. Add `CouponUsage` model linking coupon to order
3. Add discount fields to `Order` model

**Acceptance**: `npx prisma generate` + `npx prisma db push` succeeds

---

#### Task 1.2: Create Coupon CRUD Admin API

**Priority**: P0  
**Complexity**: ⭐⭐  
**Files**: `src/app/api/admin/coupons/route.ts`, `src/app/api/admin/coupons/[id]/route.ts`  
**DB Changes**: No  
**API Changes**: Yes

**Endpoints**:
- `POST /api/admin/coupons` — create
- `GET /api/admin/coupons` — list (with pagination)
- `GET /api/admin/coupons/{id}` — detail
- `PATCH /api/admin/coupons/{id}` — update
- `DELETE /api/admin/coupons/{id}` — deactivate (set isActive = false)

**Acceptance**: CRUD operations work correctly via curl/Postman

---

#### Task 1.3: Create Coupon Validation API

**Priority**: P0  
**Complexity**: ⭐⭐  
**Files**: `src/app/api/coupons/validate/route.ts`  
**DB Changes**: No  
**API Changes**: Yes

**Logic**:
1. Find coupon by code (case-insensitive)
2. Check isActive
3. Check dates (startsAt, expiresAt)
4. Check usage limit
5. Check per-user limit
6. Check first-time-only
7. Check min order amount
8. Check product eligibility
9. Calculate discount
10. Return result

**Acceptance**: All validation rules return correct responses

---

#### Task 1.4: Add Coupon UI to Cart Sidebar

**Priority**: P1  
**Complexity**: ⭐⭐  
**Files**: `src/components/cart/CartSidebar.tsx`  
**DB Changes**: No  
**API Changes**: No (consumes existing API)

**UI**:
1. Coupon code input + Apply button
2. Loading state while validating
3. Success: show discount, update total
4. Error: show error message
5. Remove button to remove coupon

**Acceptance**: Coupon can be applied and removed in cart

---

#### Task 1.5: Create Admin Coupon Pages

**Priority**: P1  
**Complexity**: ⭐⭐⭐  
**Files**: `src/app/admin/coupons/page.tsx`, `src/app/admin/coupons/create/page.tsx`, `src/app/admin/coupons/[id]/page.tsx`  
**DB Changes**: No  
**API Changes**: No

**Pages**:
1. Coupon list: table with code, type, value, usage, status
2. Create coupon: form with all fields
3. Edit coupon: pre-filled form
4. Coupon detail: show usage history

**Acceptance**: Admin can manage coupons in UI

---

### Sprint 2: Referral System

#### Task 2.1: Add Referral Models

**Priority**: P1  
**Complexity**: ⭐  
**Files**: `prisma/schema.prisma`  
**DB Changes**: Yes — `referral` table  
**API Changes**: None yet

**Acceptance**: Schema generates successfully

---

#### Task 2.2: Implement Referral Link Tracking

**Priority**: P1  
**Complexity**: ⭐⭐  
**Files**: `src/app/api/referrals/[code]/route.ts`, `src/middleware.ts`  
**DB Changes**: No  
**API Changes**: Yes

**Logic**:
1. GET `/api/referrals/{code}` → track click, set cookie, redirect to home
2. Cookie: `ref_code={code}`, expiry: 30 days
3. Create referral record (status: CLICKED)

**Acceptance**: Visiting referral link creates CLICKED record and sets cookie

---

#### Task 2.3: Implement Referral Claim (on Order)

**Priority**: P1  
**Complexity**: ⭐⭐  
**Files**: `src/app/api/checkout/route.ts` (modify)  
**DB Changes**: No  
**API Changes**: Yes (modify existing)

**Logic**:
1. Read `ref_code` from cookie at checkout
2. Look up referral by code
3. Update referral with orderId, refereeEmail → status: ORDERED
4. Store referralId on order

**Acceptance**: Order placed via referral link updates referral status

---

#### Task 2.4: Create Referral Dashboard (Customer)

**Priority**: P2  
**Complexity**: ⭐⭐  
**Files**: `src/app/account/referrals/page.tsx`  
**DB Changes**: No  
**API Changes**: `GET /api/referrals/dashboard`

**Page**:
1. Referral link (copyable)
2. Stats: clicks, conversions, commissions earned
3. Recent referral activity (table)
4. Share via WhatsApp, email, copy link

**Acceptance**: Customer can see their referral stats

---

#### Task 2.5: Create Admin Referral Pages

**Priority**: P2  
**Complexity**: ⭐⭐  
**Files**: `src/app/admin/referrals/page.tsx`, `src/app/admin/referrals/stats/page.tsx`  
**DB Changes**: No  
**API Changes**: `GET /api/admin/referrals`, `GET /api/admin/referrals/stats`

**Acceptance**: Admin can view all referrals and stats

---

### Sprint 3: Sales & Marketing Attribution

#### Task 3.1: Add SalesRep Model

**Priority**: P1  
**Complexity**: ⭐  
**Files**: `prisma/schema.prisma`  
**DB Changes**: Yes — `sales_rep` table  
**API Changes**: None yet

**Acceptance**: Schema generates successfully

---

#### Task 3.2: Create Sales Rep APIs

**Priority**: P1  
**Complexity**: ⭐⭐  
**Files**: `src/app/api/admin/sales-reps/route.ts`, `src/app/api/admin/sales-reps/[id]/route.ts`, `src/app/api/admin/sales-reps/stats/route.ts`  
**DB Changes**: No  
**API Changes**: Yes

**Endpoints**: CRUD for sales reps + stats

**Acceptance**: Admin can manage sales reps

---

#### Task 3.3: Implement Sales Code on Checkout

**Priority**: P1  
**Complexity**: ⭐⭐  
**Files**: `src/app/api/checkout/route.ts` (modify)  
**DB Changes**: No  
**API Changes**: Yes (extend existing)

**Logic**:
1. Accept optional `salesCode` in checkout request
2. Look up sales rep by code
3. Store salesRepId + salesCode on order

**Acceptance**: Sales code is stored on order when provided

---

#### Task 3.4: Add MarketingEvent Model

**Priority**: P2  
**Complexity**: ⭐  
**Files**: `prisma/schema.prisma`  
**DB Changes**: Yes — `marketing_event` table  
**API Changes**: None yet

**Acceptance**: Schema generates successfully

---

#### Task 3.5: Implement UTM Tracking

**Priority**: P2  
**Complexity**: ⭐⭐⭐  
**Files**: `src/components/tracking/UTMTracker.tsx`, `src/app/api/marketing/track/route.ts`, `src/app/api/marketing/associate/route.ts`  
**DB Changes**: No  
**API Changes**: Yes

**Logic**:
1. Client component: read UTM from URL params on landing
2. POST /api/marketing/track → create marketing_event (status: first_visit)
3. Set `session_id` cookie (30 days)
4. On checkout: POST /api/marketing/associate → link session to order

**Acceptance**: UTM parameters are captured and associated with orders

---

### Sprint 4: Admin Dashboard & Reports

#### Task 4.1: Create Reports API

**Priority**: P2  
**Complexity**: ⭐⭐⭐  
**Files**: `src/app/api/admin/reports/route.ts`  
**DB Changes**: No  
**API Changes**: Yes

**Endpoints**:
- `GET /api/admin/reports/revenue?period=day|week|month`
- `GET /api/admin/reports/coupons?period=month`
- `GET /api/admin/reports/referrals?period=month`
- `GET /api/admin/reports/marketing?period=month`

**Acceptance**: All report endpoints return data

---

#### Task 4.2: Update Admin Dashboard with KPIs

**Priority**: P2  
**Complexity**: ⭐⭐  
**Files**: `src/app/admin/dashboard/page.tsx`  
**DB Changes**: No  
**API Changes**: No (consumes reports API)

**New KPIs**:
1. Revenue (today, week, month)
2. Active coupons
3. Referral conversions
4. Top traffic sources
5. Coupon usage stats

**Acceptance**: Dashboard shows all KPIs correctly

---

#### Task 4.3: Create Marketing Reports Page

**Priority**: P2  
**Complexity**: ⭐⭐⭐  
**Files**: `src/app/admin/marketing/reports/page.tsx`  
**DB Changes**: No  
**API Changes**: No (consumes reports API)

**Page**:
1. Traffic by source (bar chart)
2. Conversions by campaign (table)
3. Revenue by channel (pie chart)
4. Date range picker

**Acceptance**: Marketing reports render with data

---

### Sprint 5: XTransfer Payment Enhancement

#### Task 5.1: Add XTransfer Fields to Payment Model

**Priority**: P1  
**Complexity**: ⭐  
**Files**: `prisma/schema.prisma`  
**DB Changes**: Yes — add fields to Payment model  
**API Changes**: None yet

**Fields**:
- `invoiceUrl` (String?) — already exists
- `invoiceNumber` (String?) — new
- `paymentNote` (String?) — new

**Acceptance**: Schema generates successfully

---

#### Task 5.2: Create XTransfer Payment Admin UI

**Priority**: P1  
**Complexity**: ⭐⭐  
**Files**: `src/app/admin/orders/[id]/page.tsx` (extend)  
**DB Changes**: No  
**API Changes**: Yes — PATCH /api/admin/payments/{id}

**Extend existing order detail page**:
1. Add XTransfer invoice URL field (link)
2. Add invoice number field
3. Add payment note textarea
4. Improve "Mark as Paid" with note support

**Acceptance**: Admin can fully manage XTransfer payments

---

### Dependency Graph

```
Sprint 1 (Coupons)
  Task 1.1 (Schema) ──→ Task 1.2 (CRUD API) ──→ Task 1.4 (Cart UI)
                       └─→ Task 1.3 (Validate API) ──→ Task 1.4 (Cart UI)
                                                           └─→ Task 1.5 (Admin UI)

Sprint 2 (Referrals)
  Task 2.1 (Schema) ──→ Task 2.2 (Link Track) ──→ Task 2.3 (Claim)
                       └─→ Task 2.4 (Dashboard) ──→ Task 2.5 (Admin)

Sprint 3 (Attribution)
  Task 3.1 (Schema) ──→ Task 3.2 (Sales API) ──→ Task 3.3 (Checkout)
  Task 3.4 (Schema) ──→ Task 3.5 (UTM Track)

Sprint 4 (Reports)
  Task 4.1 (Reports API) ──→ Task 4.2 (Dashboard)
                           └─→ Task 4.3 (Marketing Page)

Sprint 5 (XTransfer)
  Task 5.1 (Schema) ──→ Task 5.2 (Admin UI)
```

---

## Summary File

```bash
# Total tasks: 17
# Sprint 1: 5 tasks (Coupons)
# Sprint 2: 5 tasks (Referrals)
# Sprint 3: 5 tasks (Attribution)
# Sprint 4: 3 tasks (Reports)
# Sprint 5: 2 tasks (XTransfer)

# Estimated total: ~20-25 hours engineering
```
