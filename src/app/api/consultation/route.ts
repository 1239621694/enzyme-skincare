import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { sendConsultationConfirmation } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    await sendConsultationConfirmation(email, name);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit consultation" }, { status: 500 });
  }
}