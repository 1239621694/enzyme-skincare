const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function run() {
  const envContent = fs.readFileSync(".env", "utf8").replace(/^﻿/, "");
  const m = envContent.match(/^DATABASE_URL=(.+)/m);
  const url = m ? m[1] : "";

  const client = new Client({
    connectionString: url,
    connectionTimeoutMillis: 30000,
  });
  await client.connect();
  console.log("Connected to Neon.");

  // Run each migration file in order
  const migrationsDir = "prisma/migrations";
  const dirs = fs.readdirSync(migrationsDir).sort();

  for (const dir of dirs) {
    const sqlFile = path.join(migrationsDir, dir, "migration.sql");
    if (!fs.existsSync(sqlFile)) continue;

    // Check if already applied
    try {
      const existing = await client.query(
        "SELECT migration_name FROM _prisma_migrations WHERE migration_name = $1",
        [dir]
      );
      if (existing.rows.length > 0) {
        console.log("Already applied:", dir);
        continue;
      }
    } catch (e) {
      // _prisma_migrations table probably doesn't exist yet
    }

    const sql = fs.readFileSync(sqlFile, "utf8");
    console.log("Running migration:", dir);

    try {
      await client.query(sql);
      console.log("  OK");
    } catch (e) {
      if (e.code === "42P07" || e.code === "42710" || e.code === "42P04") {
        console.log("  Skipped:", e.message.split("\n")[0]);
      } else {
        console.log("  Error:", e.code, "-", e.message.split("\n")[0]);
        throw e;
      }
    }

    // Record in _prisma_migrations
    try {
      await client.query(
        "INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_applying, applied_steps_count) VALUES (gen_random_uuid(), '', NOW(), $1, '', NULL, NOW(), 0) ON CONFLICT DO NOTHING",
        [dir]
      );
    } catch (e) {
      // _prisma_migrations columns may differ on initial creation
      if (e.code !== "42P01") {
        // Try without started_applying column
        try {
          await client.query(
            "INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, applied_steps_count) VALUES (gen_random_uuid(), '', NOW(), $1, '', NULL, 0) ON CONFLICT DO NOTHING",
            [dir]
          );
        } catch (e2) {}
      }
    }
  }

  // List all tables
  const tables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name"
  );
  console.log("\nTables:", tables.rows.map((r) => r.table_name).join(", "));
  console.log("Total:", tables.rows.length);

  // List applied migrations
  try {
    const migrations = await client.query(
      "SELECT migration_name FROM _prisma_migrations ORDER BY migration_name"
    );
    console.log(
      "\nMigrations:",
      migrations.rows.map((r) => r.migration_name).join(", ")
    );
  } catch (e) {}

  await client.end();
  console.log("\nDone!");
}

run().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
