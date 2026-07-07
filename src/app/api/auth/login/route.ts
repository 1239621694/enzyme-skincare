import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://tsbxnpcbncoiasbacqja.supabase.co";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }
    
    // 通过 Supabase REST API 查询管理员（不走 Prisma 直连）
    const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzYnhucGNibmNvaWFzYmFjcWphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE4MjY1MCwiZXhwIjoyMDk3NzU4NjUwfQ.-8HrObMs0rCLy12ih14OzUUt2phuY_6Y5zzG1qfDhKc";
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&select=*`, {
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
      cache: "no-store",
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: "Database connection failed", detail: `HTTP ${res.status}` }, { status: 500 });
    }
    
    const users = await res.json();
    const user = users?.[0];
    
    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 401 });
    }
    
    if (user.password_hash !== password) {
      return NextResponse.json({ error: "PASSWORD_MISMATCH" }, { status: 401 });
    }
    
    // 创建 session
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 86400000).toISOString();
    
    await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: "POST",
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_token: token,
        user_id: user.id,
        expires,
      }),
    });
    
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 });
    return response;
    
  } catch (err: any) {
    return NextResponse.json({ error: "AUTH_ERROR", detail: err?.message?.substring(0, 200) }, { status: 500 });
  }
}
