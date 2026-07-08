import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Supabase 连接：必须使用 sslmode=require 否则被拒绝
const url = "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=require&connect_timeout=15";

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: { db: { url } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
