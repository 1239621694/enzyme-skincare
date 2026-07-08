import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    
    const adminEmail = process.env.ADMIN_EMAIL || "admin@enzymeskincare.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid" }, { status: 401 });
    }
    
    const token = crypto.randomUUID();
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 });
    return res;
  } catch { return NextResponse.json({ error: "Auth failed" }, { status: 500 }); }
}
