import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, include: { product: true } });
  return NextResponse.json({ reviews });
}
export async function PATCH(req: NextRequest) {
  const { id, isApproved } = await req.json();
  const r = await prisma.review.update({ where: { id }, data: { isApproved: isApproved } });
  return NextResponse.json({ success: true, review: r });
}