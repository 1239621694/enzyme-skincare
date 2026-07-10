import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PATCH(req: NextRequest, { params }: any) {
  const { orderId } = await params;
  const { status } = await req.json();
  const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
  return NextResponse.json({ success: true, order });
}