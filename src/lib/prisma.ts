import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Supabase 连接字符串 - 使用直连 + session 模式（非事务池）
const DATABASE_URL = "postgresql://postgres:lijiuliang0927@db.xtutmfmuzpkfttvtzocp.supabase.co:5432/postgres?sslmode=require";

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
