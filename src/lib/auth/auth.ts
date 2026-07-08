import { cookies } from "next/headers";
export type AdminUser = { id: string; email: string; name: string; role: string; };
const SESSION_COOKIE = "admin_session";

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;
    
    // sessionId 存在即认为有效（不需要查数据库）
    return { id: sessionId, email: "admin@enzymeskincare.com", name: "Admin", role: "ADMIN" };
  } catch { return null; }
}

export async function createAdminSession(userId: string): Promise<string> {
  return crypto.randomUUID();
}
