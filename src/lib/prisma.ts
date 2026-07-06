import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:lijiuliang0927@db.xtutmfmuzpkfttvtzocp.supabase.co:6543/postgres?pgbouncer=true";

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: databaseUrl } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
