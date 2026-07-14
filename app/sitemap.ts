import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:12300";
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  const categories = await prisma.category.findMany({ select: { slug: true } });

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c: any) => ({ url: `${baseUrl}/category/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...articles.map((a: any) => ({ url: `${baseUrl}/articles/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
