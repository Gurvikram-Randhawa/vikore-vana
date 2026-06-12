import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const articleDir = path.join(root, "content/articles");
const productDir = path.join(root, "content/products");
const uploadDir = path.join(root, "public/uploads");

export type AdminArticleInput = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  cover: string;
  featured: boolean;
  draft: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  products: string[];
  body: string;
};

export type AdminProductInput = {
  slug: string;
  name: string;
  description: string;
  category: string;
  image: string;
  affiliate: string;
  featured: boolean;
  body: string;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ensureContentDirs() {
  fs.mkdirSync(articleDir, { recursive: true });
  fs.mkdirSync(productDir, { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });
}

function readCollection(dir: string) {
  ensureContentDirs();
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = matter(raw);
      return { slug, ...parsed.data, body: parsed.content };
    });
}

export function readAdminArticles() {
  return readCollection(articleDir);
}

export function readAdminProducts() {
  return readCollection(productDir);
}

export function saveArticle(input: AdminArticleInput) {
  ensureContentDirs();
  const slug = slugify(input.slug || input.title);
  if (!slug) throw new Error("Article slug is required.");
  const file = matter.stringify(input.body || "", {
    title: input.title,
    description: input.description,
    category: input.category,
    date: input.date || new Date().toISOString(),
    cover: input.cover,
    featured: input.featured,
    draft: input.draft,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    seoKeywords: input.seoKeywords,
    products: input.products.filter(Boolean)
  });
  fs.writeFileSync(path.join(articleDir, `${slug}.md`), file);
  return slug;
}

export function saveProduct(input: AdminProductInput) {
  ensureContentDirs();
  const slug = slugify(input.slug || input.name);
  if (!slug) throw new Error("Product slug is required.");
  const file = matter.stringify(input.body || "", {
    name: input.name,
    description: input.description,
    category: input.category,
    image: input.image,
    affiliate: input.affiliate,
    featured: input.featured
  });
  fs.writeFileSync(path.join(productDir, `${slug}.md`), file);
  return slug;
}

export function deleteContent(type: "articles" | "products", slug: string) {
  const dir = type === "articles" ? articleDir : productDir;
  const safeSlug = slugify(slug);
  const file = path.join(dir, `${safeSlug}.md`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

export function listUploads() {
  ensureContentDirs();
  return fs
    .readdirSync(uploadDir)
    .filter((file) => /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file))
    .map((file) => `/uploads/${file}`)
    .sort();
}

export async function saveUpload(file: File) {
  ensureContentDirs();
  const extension = path.extname(file.name).toLowerCase();
  const base = slugify(path.basename(file.name, extension)) || "image";
  const name = `${base}-${Date.now()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(uploadDir, name), bytes);
  return `/uploads/${name}`;
}

export function deleteUpload(publicPath: string) {
  const name = path.basename(publicPath);
  const file = path.join(uploadDir, name);
  if (file.startsWith(uploadDir) && fs.existsSync(file)) fs.unlinkSync(file);
}
