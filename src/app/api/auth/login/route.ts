import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://postgres:lijiuliang0927@db.tsbxnpcbncoiasbacqja.supabase.co:5432/postgres?sslmode=require",
  max: 1,
  idleTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT id, email, password_hash, role FROM admin_users WHERE email = $1", [email]);
      
      if (result.rows.length === 0) return NextResponse.json({ error: "Invalid" }, { status: 401 });
      
      const user = result.rows[0];
      if (user.password_hash !== password) return NextResponse.json({ error: "Invalid" }, { status: 401 });
      
      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 86400000);
      await client.query("INSERT INTO sessions (session_token, user_id, expires) VALUES ($1, $2, $3)", [token, user.id, expires]);
      
      const res = NextResponse.json({ success: true });
      res.cookies.set("admin_session", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400 });
      return res;
    } finally {
      client.release();
    }
  } catch { return NextResponse.json({ error: "Auth failed" }, { status: 500 }); }
}
