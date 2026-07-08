import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categorySlug } from "./site";

const root = process.cwd();
const articleDir = path.join(root, "content/articles");
const productDir = path.join(root, "content/products");
const looksDir = path.join(root, "content/looks");

export type Hotspot = {
  id: string;
  x: number;
  y: number;
  productName: string;
  price?: string;
  category?: string;
  slug?: string;
  affiliate?: string;
  image: string;
};

export type Look = {
  id: string;
  title: string;
  image: string;
  hotspots: Hotspot[];
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  cover: string;
  featured?: boolean;
  draft?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  products?: string[];
  body: string;
};

export type Product = {
  slug: string;
  name: string;
  description: string;
  category: string;
  image: string;
  affiliate: string;
  featured?: boolean;
  date?: string;
  body?: string;
};

function readMarkdown<T>(dir: string, mapper: (slug: string, data: Record<string, unknown>, body: string) => T): T[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return mapper(slug, data, content);
    });
}

export function getArticles({ includeDrafts = false } = {}) {
  return readMarkdown<Article>(articleDir, (slug, data, body) => ({
    slug,
    title: String(data.title || ""),
    description: String(data.description || ""),
    category: String(data.category || "Home Decor"),
    date: String(data.date || ""),
    cover: String(data.cover || ""),
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
    seoKeywords: data.seoKeywords ? String(data.seoKeywords) : undefined,
    products: Array.isArray(data.products) ? data.products.map(String) : [],
    body
  }))
    .filter((article) => includeDrafts || !article.draft)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
}

export function getArticle(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}

export function getProducts() {
  return readMarkdown<Product>(productDir, (slug, data, body) => ({
    slug,
    name: String(data.name || ""),
    description: String(data.description || ""),
    category: String(data.category || "Home Decor"),
    image: String(data.image || ""),
    affiliate: String(data.affiliate || "#"),
    featured: Boolean(data.featured),
    date: data.date ? String(data.date) : "",
    body
  })).sort((a, b) => {
    if (!a.date && !b.date) return a.name.localeCompare(b.name);
    if (!a.date) return 1;
    if (!b.date) return -1;
    return Number(new Date(b.date)) - Number(new Date(a.date));
  });
}

export function getRelatedArticles(article: Article, limit = 3) {
  return getArticles()
    .filter((item) => item.slug !== article.slug && categorySlug(item.category) === categorySlug(article.category))
    .slice(0, limit);
}

export function getArticleProducts(article: Article, limit = 6) {
  const products = getProducts();

  // 1. Try explicitly referenced product slugs
  if (article.products?.length) {
    const explicit = article.products
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is Product => Boolean(product));
    if (explicit.length) return explicit.slice(0, limit);
    // If none resolved, fall through to category matching
  }

  // 2. Exact category match
  const byCategory = products.filter((product) => product.category === article.category);
  if (byCategory.length) return byCategory.slice(0, limit);

  // 3. Slug-normalized category match (handles casing/spacing differences)
  const articleCatSlug = categorySlug(article.category);
  const byCategorySlug = products.filter((product) => categorySlug(product.category) === articleCatSlug);
  if (byCategorySlug.length) return byCategorySlug.slice(0, limit);

  // 4. Fallback: featured products, then any products
  const featured = products.filter((product) => product.featured);
  if (featured.length) return featured.slice(0, limit);
  return products.slice(0, limit);
}

export function getLooks(): Look[] {
  if (!fs.existsSync(looksDir)) return [];
  return fs
    .readdirSync(looksDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(looksDir, file), "utf8");
      try {
        return JSON.parse(raw) as Look;
      } catch (e) {
        return null;
      }
    })
    .filter((look): look is Look => look !== null);
}
