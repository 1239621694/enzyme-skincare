import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { sendContactAcknowledgement } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // H7: Comprehensive validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 });
    }
    if (subject && subject.length > 200) {
      return NextResponse.json({ error: "Subject too long" }, { status: 400 });
    }

    // Try to save to DB (gracefully handle missing DB)
    try {
      await prisma.contactMessage.create({
        data: { name: name.trim(), email: email.trim(), subject: subject?.trim(), message: message.trim() },
      });
    } catch (dbError) {
      console.warn("DB save failed (non-blocking):", dbError);
    }

    // Send acknowledgment email (non-blocking)
    sendContactAcknowledgement(email.trim(), name.trim()).catch((e: any) =>
      console.error("Email failed (non-blocking):", e)
    );

    return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}