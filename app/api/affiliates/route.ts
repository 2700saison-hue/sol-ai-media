import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.affiliateProduct.findMany({ orderBy: { clickCount: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const product = await prisma.affiliateProduct.create({ data });
    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
