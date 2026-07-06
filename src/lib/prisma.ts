import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// 直接硬编码连接字符串
const DATABASE_URL = "postgresql://postgres:lijiuliang0927@db.xtutmfmuzpkfttvtzocp.supabase.co:6543/postgres?pgbouncer=true&connection_limit=5&pool_timeout=10&connect_timeout=15";

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
