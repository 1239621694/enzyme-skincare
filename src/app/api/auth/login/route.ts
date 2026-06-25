import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, type } = await req.json();
    if (type === "register") {
      const exists = await prisma.adminUser.findUnique({ where: { email } });
      if (exists) return NextResponse.json({ error: "Email exists" }, { status: 400 });
      await prisma.adminUser.create({ data: { email, name: email.split("@")[0], passwordHash: password, role: "customer" } });
    }
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || user.passwordHash !== password) return NextResponse.json({ error: "Invalid" }, { status: 401 });
    const token = await createAdminSession(user.id);
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 });
    return res;
  } catch { return NextResponse.json({ error: "Auth failed" }, { status: 500 }); }
}