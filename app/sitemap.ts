import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/categories", "/products", "/search"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date()
  }));
  const articles = getArticles().map((article) => ({
    url: `${site.url}/articles/${article.slug}`,
    lastModified: new Date(article.date)
  }));
  return [...routes, ...articles];
}
