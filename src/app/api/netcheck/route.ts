import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const results: any = {};
  
  // 测试各种连接方式
  const hosts = [
    "db.tsbxnpcbncoiasbacqja.supabase.co:5432",
    "db.tsbxnpcbncoiasbacqja.supabase.co:6543",
    "google.com:443",
    "supabase.com:443",
  ];
  
  for (const host of hosts) {
    const [h, p] = host.split(":");
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://${h}:${p}`, { 
        method: "HEAD", 
        signal: controller.signal 
      }).catch(() => null);
      clearTimeout(t);
      results[host] = res ? `reachable (${res.status})` : "unreachable";
    } catch {
      results[host] = "error";
    }
  }
  
  // 测试 Prisma 连接
  const { PrismaClient } = require("@prisma/client");
  for (const url of [
    "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=require&connect_timeout=5",
    "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:6543/postgres?pgbouncer=true&connect_timeout=5",
  ]) {
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    try {
      await prisma.$queryRaw\`SELECT 1\`;
      results[url.substring(0, 80)] = "connected";
    } catch (e: any) {
      results[url.substring(0, 80)] = e.message?.substring(0, 100) || "failed";
    }
    await prisma.$disconnect();
  }
  
  return NextResponse.json(results);
}
