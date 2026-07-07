import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 硬编码新 Supabase 数据库连接
// 不读取任何环境变量，避免被 Vercel 上的旧 DATABASE_URL 覆盖
export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=require"
    }
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
