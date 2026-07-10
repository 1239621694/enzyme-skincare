import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/url";

export async function GET(req: NextRequest) {
  try {
    const reps = await prisma.salesRep.findMany({
      orderBy: { createdAt: "desc" },
      include: { orders: { select: { id: true, total: true, status: true, orderNumber: true, createdAt: true } } },
    });

    const salesReps = reps.map((r) => {
      const completedOrders = r.orders.filter((o) => o.status === "DELIVERED" || o.status === "PAID");
      const totalRevenue = completedOrders.reduce((s, o) => s + Number(o.total), 0);
      return {
        ...r,
        totalOrders: r.orders.length,
        totalRevenue,
        commissionRate: Number(r.commissionRate),
        referralLink: getBaseUrl(req) + "/?ref=" + r.salesCode,
        recentOrders: r.orders.slice(0, 5),
      };
    });

    return NextResponse.json({ salesReps });
  } catch (e) {
    console.error("Sales reps error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.salesCode) {
      return NextResponse.json({ error: "name, email, and salesCode are required" }, { status: 400 });
    }
    const rep = await prisma.salesRep.create({
      data: {
        name: body.name,
        email: body.email,
        salesCode: body.salesCode.toUpperCase(),
        commissionRate: body.commissionRate || 0,
        passwordHash: body.password || "changeme123",
      },
    });
    return NextResponse.json({ success: true, salesRep: rep }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Sales code or email already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
