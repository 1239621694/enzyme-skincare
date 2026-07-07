import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 删除 DATABASE_URL 环境变量，防止 Vercel 的旧配置覆盖
delete process.env.DATABASE_URL;

const url = "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=require";

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: { db: { url } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
