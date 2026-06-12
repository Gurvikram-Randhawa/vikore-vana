"use client";

import Image from "next/image";
import { Edit3, FileText, ImagePlus, Package, Plus, Save, Trash2, Upload, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/site";

type ArticleForm = {
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
  products: string;
  body: string;
};

type ProductForm = {
  slug: string;
  name: string;
  description: string;
  category: string;
  image: string;
  affiliate: string;
  featured: boolean;
  body: string;
};

const emptyArticle: ArticleForm = {
  slug: "",
  title: "",
  description: "",
  category: "Home Decor",
  date: new Date().toISOString(),
  cover: "",
  featured: true,
  draft: false,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  products: "",
  body: "## Section Title\n\nWrite your article here.\n\n![Image description](/uploads/example.jpg)\n\n## Recommended Styling Notes\n\nAdd more rich article content here."
};

const emptyProduct: ProductForm = {
  slug: "",
  name: "",
  description: "",
  category: "Home Decor",
  image: "",
  affiliate: "",
  featured: false,
  body: ""
};

const adminTabs: { value: "articles" | "products" | "media"; icon: LucideIcon; label: string }[] = [
  { value: "articles", icon: FileText, label: "Articles" },
  { value: "products", icon: Package, label: "Products" },
  { value: "media", icon: ImagePlus, label: "Media Library" }
];

export function AdminDashboard() {
  const [tab, setTab] = useState<"articles" | "products" | "media">("articles");
  const [articles, setArticles] = useState<Record<string, unknown>[]>([]);
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [article, setArticle] = useState<ArticleForm>(emptyArticle);
  const [product, setProduct] = useState<ProductForm>(emptyProduct);
  const [notice, setNotice] = useState("");

  async function loadAll() {
    const [articleRes, productRes, mediaRes] = await Promise.all([fetch("/api/admin/articles"), fetch("/api/admin/products"), fetch("/api/admin/media")]);
    setArticles((await articleRes.json()).articles || []);
    setProducts((await productRes.json()).products || []);
    setMedia((await mediaRes.json()).media || []);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const productSlugOptions = useMemo(() => products.map((item) => String(item.slug)), [products]);

  async function saveArticle() {
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...article, products: article.products.split(",").map((item) => item.trim()).filter(Boolean) })
    });
    const data = await res.json();
    setNotice(data.ok ? "Article published. Refresh the homepage or categories page to see it." : data.error);
    await loadAll();
  }

  async function saveProduct() {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    setNotice(data.ok ? "Product saved. It now appears in collections." : data.error);
    await loadAll();
  }

  async function deleteItem(type: "articles" | "products", slug: string) {
    await fetch(`/api/admin/${type}?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    setNotice(`${type === "articles" ? "Article" : "Product"} deleted.`);
    await loadAll();
  }

  async function upload(file: File | null, target?: "article" | "product") {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: data });
    const json = await res.json();
    if (json.url) {
      if (target === "article") setArticle((current) => ({ ...current, cover: json.url }));
      if (target === "product") setProduct((current) => ({ ...current, image: json.url }));
      setNotice(`Uploaded ${json.url}`);
      await loadAll();
    }
  }

  async function deleteMedia(file: string) {
    await fetch(`/api/admin/media?file=${encodeURIComponent(file)}`, { method: "DELETE" });
    setNotice("Image deleted.");
    await loadAll();
  }

  return (
    <div className="min-h-screen bg-[#fffaf4] text-ink">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex min-h-16 w-[min(100%-2rem,1180px)] flex-wrap items-center justify-between gap-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cedar">Admin Dashboard</p>
            <h1 className="font-serif text-3xl">Vikore Vana</h1>
          </div>
          <a href="/" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">View Website</a>
        </div>
      </header>

      <main className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border border-black/10 bg-white p-3 shadow-soft lg:sticky lg:top-6 lg:self-start">
          {adminTabs.map((item) => (
            <button key={item.value} onClick={() => setTab(item.value)} className={`mb-2 flex min-h-12 w-full items-center gap-3 rounded-md px-4 text-left text-sm ${tab === item.value ? "bg-ink text-white" : "hover:bg-linen"}`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </aside>

        <section>
          {notice && <div className="mb-5 rounded-lg border border-cedar/30 bg-linen px-5 py-4 text-sm text-ink">{notice}</div>}

          {tab === "articles" && (
            <div className="grid gap-6">
              <Panel title="Create or Edit Article" icon={<Edit3 size={20} />}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title" value={article.title} onChange={(value) => setArticle({ ...article, title: value })} />
                  <Field label="Slug" value={article.slug} onChange={(value) => setArticle({ ...article, slug: value })} placeholder="auto-created from title" />
                  <TextArea label="Description" value={article.description} onChange={(value) => setArticle({ ...article, description: value })} />
                  <Select label="Category" value={article.category} onChange={(value) => setArticle({ ...article, category: value })} />
                  <Field label="Cover Image URL" value={article.cover} onChange={(value) => setArticle({ ...article, cover: value })} />
                  <UploadField label="Upload Cover Image" onChange={(file) => upload(file, "article")} />
                  <Field label="SEO Title" value={article.seoTitle} onChange={(value) => setArticle({ ...article, seoTitle: value })} />
                  <Field label="SEO Keywords" value={article.seoKeywords} onChange={(value) => setArticle({ ...article, seoKeywords: value })} />
                  <TextArea label="SEO Description" value={article.seoDescription} onChange={(value) => setArticle({ ...article, seoDescription: value })} />
                  <TextArea label="Product Slugs, comma separated" value={article.products} onChange={(value) => setArticle({ ...article, products: value })} placeholder={productSlugOptions.join(", ")} />
                </div>
                <div className="mt-4 flex flex-wrap gap-5">
                  <Check label="Featured" checked={article.featured} onChange={(value) => setArticle({ ...article, featured: value })} />
                  <Check label="Keep as draft / hide from website" checked={article.draft} onChange={(value) => setArticle({ ...article, draft: value })} />
                </div>
                <TextArea tall label="Rich Text / Markdown Article Body" value={article.body} onChange={(value) => setArticle({ ...article, body: value })} />
                <button onClick={saveArticle} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white"><Save size={18} /> Save Article</button>
              </Panel>
              <ContentList items={articles} type="articles" onEdit={(item) => setArticle(fromArticle(item))} onDelete={deleteItem} />
            </div>
          )}

          {tab === "products" && (
            <div className="grid gap-6">
              <Panel title="Add or Edit Product" icon={<Plus size={20} />}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Product Name" value={product.name} onChange={(value) => setProduct({ ...product, name: value })} />
                  <Field label="Slug" value={product.slug} onChange={(value) => setProduct({ ...product, slug: value })} placeholder="auto-created from name" />
                  <TextArea label="Product Description" value={product.description} onChange={(value) => setProduct({ ...product, description: value })} />
                  <Select label="Category" value={product.category} onChange={(value) => setProduct({ ...product, category: value })} />
                  <Field label="Product Image URL" value={product.image} onChange={(value) => setProduct({ ...product, image: value })} />
                  <UploadField label="Upload Product Image" onChange={(file) => upload(file, "product")} />
                  <Field label="Affiliate Link" value={product.affiliate} onChange={(value) => setProduct({ ...product, affiliate: value })} />
                  <TextArea label="Private Notes" value={product.body} onChange={(value) => setProduct({ ...product, body: value })} />
                </div>
                <div className="mt-4">
                  <Check label="Featured product" checked={product.featured} onChange={(value) => setProduct({ ...product, featured: value })} />
                </div>
                <button onClick={saveProduct} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white"><Save size={18} /> Save Product</button>
              </Panel>
              <ContentList items={products} type="products" onEdit={(item) => setProduct(fromProduct(item))} onDelete={deleteItem} />
            </div>
          )}

          {tab === "media" && (
            <Panel title="Media Library" icon={<ImagePlus size={20} />}>
              <UploadField label="Upload Image" onChange={(file) => upload(file)} />
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {media.map((file) => (
                  <div key={file} className="rounded-lg border border-black/10 bg-white p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-linen">
                      <Image src={file} alt="" fill sizes="300px" className="object-cover" />
                    </div>
                    <p className="mt-3 break-all text-xs text-smoke">{file}</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => navigator.clipboard.writeText(file)} className="min-h-10 rounded-full bg-linen px-4 text-xs font-medium">Copy URL</button>
                      <button onClick={() => deleteMedia(file)} className="grid min-h-10 place-items-center rounded-full bg-red-50 px-4 text-red-700"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </section>
      </main>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
      <h2 className="mb-5 flex items-center gap-2 font-serif text-3xl">{icon} {title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-12 rounded-md border border-black/10 px-4 outline-none focus:border-cedar" />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, tall }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; tall?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-medium md:col-span-2">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${tall ? "min-h-96" : "min-h-28"} rounded-md border border-black/10 p-4 font-sans outline-none focus:border-cedar`} />
    </label>
  );
}

function Select({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-md border border-black/10 px-4 outline-none focus:border-cedar">
        {site.categories.map((category) => <option key={category}>{category}</option>)}
      </select>
    </label>
  );
}

function UploadField({ label, onChange }: { label: string; onChange: (file: File | null) => void }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <span className="flex min-h-12 cursor-pointer items-center gap-2 rounded-md border border-dashed border-black/20 px-4 text-sm text-smoke">
        <Upload size={17} />
        Choose image
      </span>
      <input type="file" accept="image/*" onChange={(event) => onChange(event.target.files?.[0] || null)} className="sr-only" />
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5 accent-cedar" />
      {label}
    </label>
  );
}

function ContentList({ items, type, onEdit, onDelete }: { items: Record<string, unknown>[]; type: "articles" | "products"; onEdit: (item: Record<string, unknown>) => void; onDelete: (type: "articles" | "products", slug: string) => void }) {
  return (
    <Panel title={type === "articles" ? "Existing Articles" : "Existing Products"} icon={<FileText size={20} />}>
      <div className="grid gap-3">
        {items.map((item) => {
          const title = String(item.title || item.name || item.slug);
          const slug = String(item.slug);
          return (
            <div key={slug} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-black/10 p-4">
              <div>
                <h3 className="font-serif text-xl">{title}</h3>
                <p className="text-xs text-smoke">{slug} · {String(item.category || "Uncategorized")}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(item)} className="min-h-10 rounded-full bg-linen px-4 text-xs font-medium">Edit</button>
                <button onClick={() => onDelete(type, slug)} className="grid min-h-10 place-items-center rounded-full bg-red-50 px-4 text-red-700"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function fromArticle(item: Record<string, unknown>): ArticleForm {
  return {
    ...emptyArticle,
    slug: String(item.slug || ""),
    title: String(item.title || ""),
    description: String(item.description || ""),
    category: String(item.category || "Home Decor"),
    date: String(item.date || new Date().toISOString()),
    cover: String(item.cover || ""),
    featured: Boolean(item.featured),
    draft: Boolean(item.draft),
    seoTitle: String(item.seoTitle || ""),
    seoDescription: String(item.seoDescription || ""),
    seoKeywords: String(item.seoKeywords || ""),
    products: Array.isArray(item.products) ? item.products.join(", ") : "",
    body: String(item.body || "")
  };
}

function fromProduct(item: Record<string, unknown>): ProductForm {
  return {
    ...emptyProduct,
    slug: String(item.slug || ""),
    name: String(item.name || ""),
    description: String(item.description || ""),
    category: String(item.category || "Home Decor"),
    image: String(item.image || ""),
    affiliate: String(item.affiliate || ""),
    featured: Boolean(item.featured),
    body: String(item.body || "")
  };
}
