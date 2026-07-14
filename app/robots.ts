import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://media.seasonsezon.co.jp";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/articles/", "/category/", "/sitemap.xml"],
        disallow: ["/admin/", "/api/", "/login", "/_next/", "/search"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/search"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
