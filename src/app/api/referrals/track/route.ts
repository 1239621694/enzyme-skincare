import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  try {
    const { referrerCode, visitorId } = await req.json();
    if (!referrerCode) return NextResponse.json({ error: "Missing referrerCode" }, { status: 400 });
    const referrer = await prisma.referral.findFirst({ where: { referrerCode } });
    if (!referrer) return NextResponse.json({ error: "Referrer not found" }, { status: 404 });
    const ref = await prisma.referral.create({ data: { referrerEmail: referrer.referrerEmail, referrerCode, visitorId, status: "CLICKED" } });
    const res = NextResponse.json({ success: true, referralId: ref.id });
    res.cookies.set("ref", referrerCode, { maxAge: 2592000, path: "/" });
    return res;
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}