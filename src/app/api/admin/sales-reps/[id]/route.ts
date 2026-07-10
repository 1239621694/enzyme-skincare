import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;
  const rep = await prisma.salesRep.findUnique({ where: { id }, include: { orders: { orderBy: { createdAt: "desc" }, take: 20 } } });
  if (!rep) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...rep, totalRevenue: rep.orders.reduce((s, o) => s + Number(o.total), 0), orders: rep.orders.map((o) => ({ ...o, total: Number(o.total) })) });
}
export async function PATCH(req: NextRequest, { params }: any) {
  const { id } = await params; const body = await req.json(); delete body.id;
  try {
    const rep = await prisma.salesRep.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, salesRep: rep });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Code or email already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;
  await prisma.salesRep.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}