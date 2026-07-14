# Database Migration: Supabase PostgreSQL → Neon PostgreSQL

## Overview

This document describes the process of migrating the BELOYAN Enzyme Skincare database from Supabase PostgreSQL to Neon PostgreSQL.

**Current database:** Supabase PostgreSQL (`enzyme-skincare-db`)
**Target database:** Neon PostgreSQL

---

## Architecture

The project uses Prisma as the sole database access layer. Prisma Client is initialized as a global singleton in `src/lib/prisma.ts`. Only PostgreSQL is used — no Supabase Auth, Storage, Realtime, or Edge Functions.

### Data Access Flow

```
Next.js App Router (Node.js runtime)
  → API Routes / Server Components
    → Prisma Client (global singleton)
      → DATABASE_URL (pooled connection)
        → Neon / Supabase PostgreSQL
```

### Runtime Configuration

- All API routes use `runtime = "nodejs"` (no Edge Runtime)
- Prisma Client is cached as a global singleton (`src/lib/prisma.ts`)
- Connection pooling is handled by Neon's PgBouncer (when using pooled URL) or Supabase's connection pool
- `pg` npm package (version ^8.22.0) is available for direct Pool usage (used in `login/route.ts`)

---

## Environment Variables

### Current (.env files + Vercel Environment Variables)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Prisma runtime connection (currently Supabase with `?sslmode=require`) |
| `DIRECT_URL` | Prisma migrations / direct operations (currently same as DATABASE_URL) |

### Target (Neon)

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Pooled connection (via Neon's PgBouncer — append `?pgbouncer=true&sslmode=require`) | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | Direct connection (for migrations, pg_dump — no pooler) | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require` |

### ⚠️ After migration, do NOT rename Supabase variables to Neon identifiers unless the new values are confirmed working.

---

## Migration Steps

### Phase 1: Preparation

1. **Install local dependencies**

   ```bash
   cd /path/to/enzyme-skincare
   npm install
   ```

2. **Verify current Prisma schema**

   The Prisma schema at `prisma/schema.prisma` is already configured with `directUrl`:

   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

   Both variables point to the same Supabase URL in current `.env` files. No schema changes are needed for the migration.

3. **Check migration status**

   ```bash
   npx prisma migrate status
   ```

   All migrations should be applied. If there are unapplied migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. **Verify database connection**

   Run the verification script:

   ```bash
   npx ts-node scripts/verify-database.ts
   ```

   This will confirm:
   - Database is reachable
   - All key tables exist with expected row counts
   - Migration history is intact

### Phase 2: Backup Supabase Database

You need `pg_dump` (PostgreSQL client tools) installed locally.

**Option A — Custom format (recommended for pg_restore):**

```bash
pg_dump \
  --format=custom \
  --no-owner \
  --no-acl \
  "$DIRECT_URL" \
  --file="./backups/supabase-$(date +%Y%m%d-%H%M%S).dump"
```

**Option B — Plain SQL (for manual inspection):**

```bash
pg_dump \
  --format=plain \
  --no-owner \
  --no-acl \
  "$DIRECT_URL" \
  --file="./backups/supabase-$(date +%Y%m%d-%H%M%S).sql"
```

**Note:** Replace `$DIRECT_URL` with the actual Supabase direct connection string (from your `.env` or Vercel environment variables). Store the backup file securely.

### Phase 3: Create and Configure Neon Database

1. Sign in to [Neon Console](https://console.neon.tech)
2. Create a new project (e.g., `enzyme-skincare-db`)
3. Select the region closest to your users
4. From the Neon dashboard, copy:
   - **Pooled connection string** → will become the new `DATABASE_URL`
   - **Direct connection string** → will become the new `DIRECT_URL`

### Phase 4: Import Data to Neon

**Using custom format dump (recommended):**

```bash
pg_restore \
  --no-owner \
  --no-acl \
  --dbname="$NEON_DIRECT_URL" \
  "./backups/supabase-20250714-120000.dump"
```

> This command **appends** data without dropping existing objects.
> For a fresh Neon database (no existing data), this is safe.

**If you need to replace existing data (⚠️ only for empty/throwaway Neon DB):**

```bash
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  --dbname="$NEON_DIRECT_URL" \
  "./backups/supabase-20250714-120000.dump"
```

> `--clean` drops existing objects before recreating them.
> **Never** use `--clean` against a database with production data.

### Phase 5: Prisma Migration Sync

After importing the data, run:

```bash
# Point DIRECT_URL to Neon temporarily for this check
export DIRECT_URL="$NEON_DIRECT_URL"

npx prisma migrate status
npx prisma migrate deploy
npx prisma generate
```

This ensures the `_prisma_migrations` table is populated and the Prisma schema matches the database.

### Phase 6: Test in Vercel Preview Environment

1. In Vercel dashboard, go to your project → **Settings** → **Environment Variables**
2. Under **Preview** environment, add:
   - `DATABASE_URL` = Neon pooled connection string
   - `DIRECT_URL` = Neon direct connection string
3. Trigger a **Preview Deployment** (push a branch or redeploy)
4. Verify:

   - [ ] Products load correctly on the homepage
   - [ ] Product detail pages render
   - [ ] Cart and checkout flow works
   - [ ] Order creation works
   - [ ] Coupon validation works
   - [ ] Admin dashboard loads
   - [ ] Admin order management works
   - [ ] Blog and case studies load
   - [ ] Contact form submission works
   - [ ] Newsletter subscription works

### Phase 7: Production Switch (Maintenance Window)

**Prerequisites:**
- All tests pass in Preview environment
- You have confirmed `prisma migrate status` shows no differences
- You have a recent backup of Supabase

**Assuming no real orders exist yet (pre-launch), the simplified approach:**

1. Update **Production** environment variables in Vercel:
   - `DATABASE_URL` = Neon pooled connection
   - `DIRECT_URL` = Neon direct connection
2. Trigger a **Production Deployment**
3. Run `npx prisma migrate deploy` (if needed) pointing to the new Neon database
4. Verify all critical flows

**If real orders exist, follow the full cut-over process:**

1. Enable **maintenance mode** on the website (see Phase 8)
2. Wait for in-flight Stripe payments to settle (check `payment_intent.succeeded` webhooks)
3. Stop accepting new orders
4. Take a **final backup** of Supabase
5. Import the final backup into Neon
6. Update Vercel Production env vars
7. Trigger Production Deployment
8. Verify all functions
9. Disable maintenance mode

### Phase 8: Database Maintenance Mode

For sites with active orders, create a maintenance mode mechanism.

**Suggestion:** Add a check against an environment variable `MAINTENANCE_MODE=true` in critical API routes (`checkout`, `orders/create`, admin write operations) that returns a 503 response with a maintenance message.

Example:

```typescript
// In checkout route handler
if (process.env.MAINTENANCE_MODE === "true") {
  return NextResponse.json(
    { error: "We are currently undergoing maintenance. Please try again shortly." },
    { status: 503 }
  );
}
```

---

## Data Verification SQL

Run these queries against the new Neon database after migration to verify completeness.

```sql
-- Migration record count
SELECT count(*) FROM _prisma_migrations;

-- Table counts (adjust table names to match your schema)
SELECT table_name, (xpath('/row/c/text()', query_to_xml('select count(*) as c from "' || table_name || '"', true, false, '')))[1]::text::int as row_count
FROM (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name NOT LIKE '_prisma_migrations'
  ORDER BY table_name
) t;

-- Product count
SELECT count(*) as products FROM products;

-- Review count
SELECT count(*) as reviews FROM reviews;

-- Order count
SELECT count(*) as orders FROM orders;

-- Customer count
SELECT count(*) as customers FROM customers;

-- Coupon count
SELECT count(*) as coupons FROM coupons;

-- Foreign key integrity
SELECT
  tc.table_schema,
  tc.table_name,
  tc.constraint_name
FROM information_schema.table_constraints tc
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';

-- Sequence health
SELECT sequence_name, last_value, start_value
FROM information_schema.sequences
WHERE sequence_schema = 'public';

-- Index check
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## Rollback Plan

If issues are found after switching to Neon:

1. Go to **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. Restore `DATABASE_URL` and `DIRECT_URL` to the **original Supabase** values
3. Trigger a new **Production Deployment**
4. The site will revert to using Supabase
5. No data loss occurs because Supabase was never modified during the migration

> Keep the Supabase project active for at least 14 days after successful migration.

---

## Risk and Notes

### Can we fully remove Supabase?

**Yes.** The project does NOT use any Supabase-specific features:
- ❌ No Supabase Auth (admin auth uses custom password check + session cookies)
- ❌ No Supabase Storage (images are hosted on Supabase CDN via `*.supabase.co` remote pattern — these need to be migrated separately if Supabase is decommissioned)
- ❌ No Supabase Realtime
- ❌ No Supabase Edge Functions

All database access goes through Prisma, which is database-agnostic.

### Image Hosting Note

The CSP and `next.config.ts` `remotePatterns` currently allow `*.supabase.co` for images. If you decommission Supabase entirely, you'll need to:

1. Migrate product images to an alternative host (e.g., Vercel Blob, Cloudinary, AWS S3)
2. Update `next.config.ts` `remotePatterns` to include the new host
3. Update CSP headers in `next.config.ts`
4. Update image URLs in the product data (`src/lib/products.ts`) and database

**This is outside the scope of the PostgreSQL migration.**

### Stripe Webhooks

- Webhook route uses `runtime = "nodejs"` ✅
- Signature verification is performed ✅
- Idempotency via `ProcessedEvent` table with unique constraint on `eventId` ✅
- On database error, returns HTTP 500 — Stripe retries ✅
- Webhook does NOT log PII or payment secrets ✅

### Database Connection in Serverless

- Prisma Client is a global singleton — safe for Vercel Serverless ✅
- No Edge Runtime issues — all DB routes use Node.js runtime ✅

### Hardcoded Credentials

- **FIXED:** `login/route.ts` had a hardcoded Supabase connection string — replaced with `process.env.DATABASE_URL` ✅
- **NO OTHER hardcoded credentials found** ✅

---

## Required Environment Variables for Neon

Once you create your Neon project, you'll get two connection strings:

```
# Application runtime (pooled connection via Neon PgBouncer)
DATABASE_URL="postgresql://[user]:[password]@[ep-xxxx].[region].aws.neon.tech/neondb?sslmode=require"

# Direct connection (migrations, pg_dump)
DIRECT_URL="postgresql://[user]:[password]@[ep-xxxx].[region].aws.neon.tech/neondb?sslmode=require"
```

Replace `[user]`, `[password]`, `[ep-xxxx]`, and `[region]` with the actual values from your Neon project dashboard.

---

## Scripts (added to package.json)

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:validate": "prisma validate",
    "db:status": "prisma migrate status",
    "db:deploy": "prisma migrate deploy",
    "db:verify": "npx ts-node scripts/verify-database.ts"
  }
}
```

---

## Example: pg_dump backup command

```bash
# Create backups directory
mkdir -p ./backups

# Custom format backup (for restore)
pg_dump \
  --format=custom \
  --no-owner \
  --no-acl \
  "$DIRECT_URL" \
  --file="./backups/supabase-$(date +%Y%m%d-%H%M%S).dump"

# SQL format backup (readable, for verification)
pg_dump \
  --format=plain \
  --no-owner \
  --no-acl \
  "$DIRECT_URL" \
  --file="./backups/supabase-$(date +%Y%m%d-%H%M%S).sql"
```

## Example: pg_restore to Neon

```bash
# Safe append (for first import into empty Neon DB)
pg_restore \
  --no-owner \
  --no-acl \
  --dbname="$NEON_DIRECT_URL" \
  "./backups/supabase-20250714-120000.dump"

# Replace (for re-import — only for throwaway DB)
# pg_restore --clean --if-exists --no-owner --no-acl --dbname="$NEON_DIRECT_URL" "./backups/supabase-20250714-120000.dump"
```

---

## Post-Migration Checklist

- [ ] All products visible on site
- [ ] Product detail pages render correctly
- [ ] Cart add/remove works
- [ ] Checkout creates order in database
- [ ] Stripe webhook updates order to PAID
- [ ] Admin dashboard loads data
- [ ] Admin order management works
- [ ] Blog/case studies load
- [ ] Contact form saves to database
- [ ] Newsletter subscription works
- [ ] Coupon validation works
- [ ] Order history visible in account
- [ ] Database backup verified
- [ ] `prisma migrate status` shows all migrations applied
- [ ] No errors in Vercel deployment logs
