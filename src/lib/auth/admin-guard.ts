import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export class AuthError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
  }
}

// M6: Two-layer auth - route handler checks role (middleware checks session)
export async function requireAdmin(): Promise<{ userId: string }> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) {
    throw new AuthError("UNAUTHORIZED", "Please log in", 401);
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: sessionId },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    throw new AuthError("UNAUTHORIZED", "Session expired", 401);
  }

  const user = session.user as any;
  if (user.role !== "admin") {
    throw new AuthError("FORBIDDEN", "Admin access required", 403);
  }

  return { userId: user.id };
}