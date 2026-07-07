import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const conn = await prisma.$queryRaw`SELECT current_database() as db, version() as ver`;
    const email = await prisma.adminUser.findUnique({ where: { email: "admin@enzymeskincare.com" } });
    return NextResponse.json({
      db: conn,
      admin: email ? { exists: true, email: email.email, passMatch: email.passwordHash === "admin123" } : { exists: false }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message?.substring(0, 200) }, { status: 500 });
  }
}
