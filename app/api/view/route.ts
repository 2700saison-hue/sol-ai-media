import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { articleId } = await req.json();
    const referer = req.headers.get("referer") || "direct";
    await prisma.articleView.create({ data: { articleId, referer } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
