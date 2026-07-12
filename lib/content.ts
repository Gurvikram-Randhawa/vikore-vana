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
  const candidates = getArticles()
    .filter((item) => item.slug !== article.slug && categorySlug(item.category) === categorySlug(article.category));
  return shuffle(candidates).slice(0, limit);
}

/** Fisher-Yates shuffle – returns a new shuffled copy of the array */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Categories that should also show cross-category recommendations */
const CROSS_RECOMMEND_CATEGORIES = ["bedroom", "living-room", "small-spaces"];
/** The extra categories to pull bonus products from */
const BONUS_CATEGORIES = ["luxury-decor", "home-decor", "lighting"];

export function getArticleProducts(article: Article, limit = 6) {
  const products = getProducts();

  // 1. Try explicitly referenced product slugs (keep author-curated order)
  if (article.products?.length) {
    const explicit = article.products
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is Product => Boolean(product));
    if (explicit.length) return explicit.slice(0, limit);
    // If none resolved, fall through to category matching
  }

  const articleCatSlug = categorySlug(article.category);

  // 2. Get main-category products
  const byCategory = products.filter(
    (product) => categorySlug(product.category) === articleCatSlug
  );

  // 3. For Bedroom / Living Room / Small Spaces, mix in bonus products
  if (CROSS_RECOMMEND_CATEGORIES.includes(articleCatSlug) && byCategory.length) {
    const mainLimit = Math.min(4, byCategory.length);        // majority from main category
    const bonusLimit = limit - mainLimit;                     // rest from bonus categories

    const main = shuffle(byCategory).slice(0, mainLimit);
    const usedSlugs = new Set(main.map((p) => p.slug));

    const bonusPool = products.filter(
      (product) =>
        BONUS_CATEGORIES.includes(categorySlug(product.category)) &&
        !usedSlugs.has(product.slug)
    );
    const bonus = shuffle(bonusPool).slice(0, bonusLimit);

    return [...main, ...bonus];
  }

  // 4. Regular category match – shuffled so each reload shows different products
  if (byCategory.length) return shuffle(byCategory).slice(0, limit);

  // 5. Fallback: featured products, then any products – also shuffled
  const featured = products.filter((product) => product.featured);
  if (featured.length) return shuffle(featured).slice(0, limit);
  return shuffle(products).slice(0, limit);
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
