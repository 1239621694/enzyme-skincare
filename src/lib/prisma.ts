import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:6543/postgres?pgbouncer=true&sslmode=require"
    }
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
