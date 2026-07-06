import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const events = await prisma.marketingEvent.findMany({ where: { utmSource: { not: null } }, include: { order: { select: { total: true } } } });
  const bySource: any = {};
  events.forEach(e => {
    const s = e.utmSource || "direct";
    if (!bySource[s]) bySource[s] = { source: s, visits: 0, conversions: 0, revenue: 0 };
    bySource[s].visits++;
    if (e.convertedAt) { bySource[s].conversions++; bySource[s].revenue += Number(e.order?.total || 0); }
  });
  return NextResponse.json({ sources: Object.values(bySource) });
}