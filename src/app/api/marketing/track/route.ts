import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

    let event = await prisma.marketingEvent.findFirst({ where: { sessionId: data.sessionId } });
    if (event) {
      event = await prisma.marketingEvent.update({
        where: { id: event.id },
        data: { utmSource: data.utmSource ?? event.utmSource, utmMedium: data.utmMedium ?? event.utmMedium, utmCampaign: data.utmCampaign ?? event.utmCampaign },
      });
    } else {
      event = await prisma.marketingEvent.create({
        data: { sessionId: data.sessionId, utmSource: data.utmSource, utmMedium: data.utmMedium, utmCampaign: data.utmCampaign, utmTerm: data.utmTerm, utmContent: data.utmContent, landingPage: data.landingPage, referrerUrl: data.referrerUrl, userAgent: data.userAgent, ipAddress: data.ipAddress },
      });
    }
    return NextResponse.json({ success: true, eventId: event.id });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}