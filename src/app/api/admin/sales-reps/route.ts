import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const reps = await prisma.salesRep.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ salesReps: reps });
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.salesCode) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const rep = await prisma.salesRep.create({ data: { name: body.name, email: body.email, salesCode: body.salesCode.toUpperCase(), commissionRate: body.commissionRate || 0, passwordHash: body.password || "changeme123" } });
    return NextResponse.json({ success: true, salesRep: rep }, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}