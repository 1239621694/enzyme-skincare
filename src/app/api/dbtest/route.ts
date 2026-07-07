import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient({ datasources: { db: { url: "postgresql://postgres:lijiuliang0927@db.xtutmfmuzpkfttvtzocp.supabase.co:5432/postgres?sslmode=require&connect_timeout=5" } } });
  try {
    await prisma.$queryRaw`SELECT 1 as ok`;
    return NextResponse.json({ status: "connected" });
  } catch (e: any) {
    return NextResponse.json({ status: "failed", error: e?.message?.substring(0,200) });
  } finally { await prisma.$disconnect(); }
}
