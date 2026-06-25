import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { searchProducts } from "@/lib/supabase/queries";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProducts(q.trim());
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}