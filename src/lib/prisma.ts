import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=require";

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: { db: { url: dbUrl } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
