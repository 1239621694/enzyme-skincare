import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  try {
    const { sessionId, orderId } = await req.json();
    const event = await prisma.marketingEvent.findFirst({ where: { sessionId } });
    if (!event) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    await prisma.marketingEvent.update({ where: { id: event.id }, data: { orderId, convertedAt: new Date() } });
    if (event.utmSource) await prisma.order.update({ where: { id: orderId }, data: { utmSource: event.utmSource, utmMedium: event.utmMedium, utmCampaign: event.utmCampaign } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}