import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    
    // 在路由内部创建 PrismaClient，确保使用正确的连接字符串
    const prisma = new PrismaClient({
      datasources: {
        db: { url: "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=require" }
      }
    });
    
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) { await prisma.$disconnect(); return NextResponse.json({ error: "Invalid" }, { status: 401 }); }
    if (user.passwordHash !== password) { await prisma.$disconnect(); return NextResponse.json({ error: "Invalid" }, { status: 401 }); }
    
    // 创建 session
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 86400000);
    await prisma.session.create({ data: { sessionToken: token, userId: user.id, expires } });
    await prisma.$disconnect();
    
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 });
    return res;
  } catch { return NextResponse.json({ error: "Auth failed" }, { status: 500 }); }
}
