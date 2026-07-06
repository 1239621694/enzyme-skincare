import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;
  const rep = await prisma.salesRep.findUnique({ where: { id } });
  if (!rep) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rep);
}
export async function PATCH(req: NextRequest, { params }: any) {
  const { id } = await params; const body = await req.json(); delete body.id;
  const rep = await prisma.salesRep.update({ where: { id }, data: body });
  return NextResponse.json({ success: true, salesRep: rep });
}