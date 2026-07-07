import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 尝试多种连接方式，从 Vercel 的不同区域连接
// 使用 Supabase 的连接池 + session 模式 + 禁用 SSL 验证
const url = "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=disable";

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: { db: { url } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
