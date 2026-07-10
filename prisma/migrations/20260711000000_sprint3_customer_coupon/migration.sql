-- Migration: Sprint 3 — Customer Management + Coupon Enhancement
-- Changes:
--   1. Create Customer model
--   2. Create CustomerAddress model
--   3. Add customerId to orders
--   4. Add customer FK to CouponUsage

-- Step 1: Create Customer table
CREATE TABLE IF NOT EXISTS "customers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "first_name" TEXT,
  "last_name" TEXT,
  "phone" TEXT,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "notes" TEXT,
  "referral_source" TEXT,
  "sales_rep_id" UUID,
  "total_orders" INTEGER NOT NULL DEFAULT 0,
  "total_spent" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "first_order_at" TIMESTAMPTZ,
  "last_order_at" TIMESTAMPTZ,
  "last_visit_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "customers_email_key" ON "customers"("email");

-- Step 2: Create CustomerAddress table
CREATE TABLE IF NOT EXISTS "customer_addresses" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "customer_id" UUID NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "label" TEXT,
  "first_name" TEXT,
  "last_name" TEXT,
  "phone" TEXT,
  "address1" TEXT NOT NULL,
  "address2" TEXT,
  "city" TEXT NOT NULL,
  "province" TEXT,
  "postal_code" TEXT,
  "country" TEXT NOT NULL DEFAULT 'US',
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

-- Step 3: Add customerId to orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customer_id" UUID REFERENCES "customers"("id");

-- Step 4: Add customer_email FK to coupon_usages (alter only if column exists)
-- Note: customerEmail already exists, we just add the FK
-- Create index for customer lookups
CREATE INDEX IF NOT EXISTS "customers_email_idx" ON "customers"("email");
CREATE INDEX IF NOT EXISTS "customers_total_orders_idx" ON "customers"("total_orders");
CREATE INDEX IF NOT EXISTS "orders_customer_id_idx" ON "orders"("customer_id");
