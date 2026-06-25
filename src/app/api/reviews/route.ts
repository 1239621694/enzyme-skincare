import { NextRequest, NextResponse } from "next/server";
import { createReview } from "@/lib/supabase/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userName, rating, title, body: reviewBody, skinType } = body;

    if (!productId || !userName || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await createReview({
      productId,
      userName,
      rating,
      title,
      body: reviewBody,
      skinType,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}