import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 硬编码新数据库，不依赖环境变量
export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=require"
    }
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
