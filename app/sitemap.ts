import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content";
import { site } from "@/lib/site";

/** Parse any date value safely. Returns a valid Date or fallback to now. */
function safeDate(value: unknown): Date {
  try {
    if (!value) return new Date();
    const parsed = new Date(value as string | number);
    if (isNaN(parsed.getTime())) return new Date();
    return parsed;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = ["", "/categories", "/products", "/search"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now
  }));

  const articles = getArticles().map((article) => ({
    url: `${site.url}/articles/${article.slug}`,
    lastModified: safeDate(article.date)
  }));

  return [...routes, ...articles];
}
