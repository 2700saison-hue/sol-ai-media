import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://media.seasonsezon.co.jp";
  const now = new Date();

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true, publishedAt: true, views: { select: { id: true } } },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  // 人気記事は priority 高め
  const maxViews = Math.max(...articles.map((a: any) => a.views?.length || 0), 1);

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/articles`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/feed`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
    ...categories.map((c: any) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...articles.map((a: any) => {
      const views = a.views?.length || 0;
      const priority = Math.min(0.9, 0.6 + (views / maxViews) * 0.3);
      return {
        url: `${baseUrl}/articles/${a.slug}`,
        lastModified: a.updatedAt || now,
        changeFrequency: "weekly" as const,
        priority: Math.round(priority * 10) / 10,
      };
    }),
  ];
}
