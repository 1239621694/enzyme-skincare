import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Supabase 数据库连接 - 使用池化连接（端口 6543）
// 连接参数：ssl 强制启用 + 超时配置
const DATABASE_URL = "postgresql://postgres:lijiuliang0927@db.xtutmfmuzpkfttvtzocp.supabase.co:6543/postgres?pgbouncer=true&sslmode=require&connect_timeout=30&pool_timeout=30";

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
