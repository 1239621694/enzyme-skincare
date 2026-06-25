import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
export type AdminUser = { id: string; email: string; name: string; role: string; };
const SESSION_COOKIE = "admin_session";

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;
    const session = await prisma.session.findUnique({ where: { sessionToken: sessionId }, include: { user: true } });
    if (!session || session.expires < new Date()) return null;
    const u = session.user as any;
    return { id: session.user.id, email: u.email, name: u.name, role: u.role ?? "customer" };
  } catch { return null; }
}

export async function createAdminSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 86400000);
  await prisma.session.create({ data: { sessionToken: token, userId, expires } });
  return token;
}