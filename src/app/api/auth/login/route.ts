import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  
  try {
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`;
  } catch (dbErr: any) {
    return NextResponse.json({ error: "DB_ERROR", detail: dbErr?.message?.substring(0, 200) }, { status: 500 });
  }
  
  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 401 });
    if (user.passwordHash !== password) return NextResponse.json({ error: "PASSWORD_MISMATCH" }, { status: 401 });
    
    const token = await createAdminSession(user.id);
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 });
    return res;
    
  } catch (err: any) {
    return NextResponse.json({ error: "AUTH_ERROR", detail: err?.message?.substring(0, 200) }, { status: 500 });
  }
}
