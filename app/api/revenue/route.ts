import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RevenueSchema = z.object({
  type: z.enum(["adsense", "affiliate", "sponsored", "inquiry"]),
  amount: z.number().positive(),
  date: z.string().optional(),
  note: z.string().optional(),
});

export async function GET() {
  const revenues = await prisma.revenue.findMany({ orderBy: { date: "desc" }, take: 100 });
  return NextResponse.json(revenues);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = RevenueSchema.parse(body);
    const rev = await prisma.revenue.create({
      data: { ...data, date: data.date ? new Date(data.date) : new Date() },
    });
    return NextResponse.json(rev, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
