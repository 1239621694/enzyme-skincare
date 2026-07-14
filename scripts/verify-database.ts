/**
 * Database Verification Script
 *
 * Usage: npx ts-node scripts/verify-database.ts
 *
 * This script connects to the database using the current DATABASE_URL,
 * verifies connectivity, and checks key table row counts.
 *
 * It does NOT:
 *   - Modify any data
 *   - Output secrets or connection strings
 *   - Print personal data
 */
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

async function verifyDatabase(): Promise<void> {
  console.log("=".repeat(60));
  console.log("  BELOYAN — Database Verification Script");
  console.log("  Running: check connectivity, schema, and row counts");
  console.log("=".repeat(60));
  console.log();

  // Step 1: Prisma validate
  console.log("[1/5] Prisma schema validation...");
  try {
    execSync("npx prisma validate", { stdio: "pipe", encoding: "utf-8" });
    console.log("  ✓ Prisma schema is valid");
  } catch (err: any) {
    console.error("  ✗ Prisma validation failed:", err.stdout || err.message);
    process.exit(1);
  }
  console.log();

  // Step 2: Prisma generate
  console.log("[2/5] Prisma client generation...");
  try {
    execSync("npx prisma generate", { stdio: "pipe", encoding: "utf-8" });
    console.log("  ✓ Prisma Client generated successfully");
  } catch (err: any) {
    console.error("  ✗ Prisma generation failed:", err.stdout || err.message);
    process.exit(1);
  }
  console.log();

  // Step 3: Database connectivity
  console.log("[3/5] Database connection test...");
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("  ✓ Connected to database successfully");

    // Test a simple query
    const result = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT NOW() as now`;
    const dbTime = result[0]?.now;
    console.log(`  ✓ Database server time: ${dbTime?.toISOString() ?? "unknown"}`);
  } catch (err) {
    console.error("  ✗ Database connection failed");
    console.error("    Make sure DATABASE_URL is set correctly");
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
  console.log();

  // Step 4: Key table row counts
  console.log("[4/5] Key table row counts...");

  type TableCheck = {
    name: string;
    query: () => Promise<number>;
  };

  const tables: TableCheck[] = [
    { name: "products", query: () => prisma.product.count() },
    { name: "reviews", query: () => prisma.review.count() },
    { name: "orders", query: () => prisma.order.count() },
    { name: "customers", query: () => prisma.customer.count() },
    { name: "coupons", query: () => prisma.coupon.count() },
    { name: "blog_posts", query: () => prisma.blogPost.count() },
    { name: "subscribers", query: () => prisma.subscriber.count() },
    { name: "consultations", query: () => prisma.consultation.count() },
    { name: "contact_messages", query: () => prisma.contactMessage.count() },
    { name: "sales_reps", query: () => prisma.salesRep.count() },
    { name: "referrals", query: () => prisma.referral.count() },
    { name: "analytics_events", query: () => prisma.analyticsEvent.count() },
  ];

  let hasErrors = false;
  for (const table of tables) {
    try {
      const count = await table.query();
      console.log(`  ${String(count).padStart(6)}  ${table.name}`);
    } catch (err) {
      console.error(`  ${"ERROR".padStart(6)}  ${table.name} — table may not exist yet`);
      hasErrors = true;
    }
  }

  console.log();

  // Step 5: Migration status
  console.log("[5/5] Migration status...");
  try {
    const migrations = await prisma.$queryRaw<
      Array<{ migration_name: string; started_at: Date; finished_at: Date | null }>
    >`SELECT migration_name, started_at, finished_at FROM _prisma_migrations ORDER BY started_at`;

    if (migrations.length === 0) {
      console.log("  ⚠ No migrations found in _prisma_migrations table");
    } else {
      console.log(`  ✓ ${migrations.length} migration(s) applied:`);
      for (const m of migrations) {
        const status = m.finished_at ? "applied" : "in progress";
        console.log(`    - ${m.migration_name} (${status})`);
      }
    }
  } catch (err) {
    console.error("  ✗ Could not read _prisma_migrations table — database may not be initialized");
    hasErrors = true;
  }

  console.log();

  // Cleanup
  await prisma.$disconnect();

  console.log("=".repeat(60));
  if (hasErrors) {
    console.log("  ⚠ Some checks had issues — review the output above.");
    process.exit(1);
  } else {
    console.log("  ✓ All checks passed. Database is healthy.");
  }
  console.log("=".repeat(60));
}

verifyDatabase().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
