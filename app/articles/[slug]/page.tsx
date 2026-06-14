import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleCard } from "@/components/ArticleCard";
import { ProductCard } from "@/components/ProductCard";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { getArticle, getArticleProducts, getArticles, getRelatedArticles } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `${site.url}/articles/${article.slug}`;
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.description,
    keywords: article.seoKeywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
      images: [{ url: article.cover }]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.cover]
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const products = getArticleProducts(article);
  const related = getRelatedArticles(article);
  const url = `${site.url}/articles/${article.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.cover,
    datePublished: article.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: url
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article>
        <section className="container-premium py-8 md:py-12">
          <nav className="mb-6 text-sm text-smoke dark:text-bone">
            <Link href="/" className="hover:text-ink dark:hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-ink dark:hover:text-white">Categories</Link>
            <span className="mx-2">/</span>
            <span>{article.category}</span>
          </nav>
          <div className="mx-auto flex justify-center overflow-hidden rounded-lg bg-bone md:max-w-4xl">
            <Image 
              src={article.cover} 
              alt="" 
              width={0} 
              height={0} 
              sizes="100vw" 
              style={{ width: '100%', height: 'auto', maxHeight: '75vh', objectFit: 'contain' }} 
              priority 
            />
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">{article.category}</p>
            <h1 className="font-serif text-5xl leading-[1.02] text-ink md:text-7xl dark:text-linen">{article.title}</h1>
            <p className="mt-6 text-lg leading-9 text-smoke dark:text-bone">{article.description}</p>
            <div className="mt-7">
              <ShareButtons title={article.title} url={url} image={article.cover} />
            </div>
          </div>
        </section>

        <section className="container-premium grid gap-12 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="mx-auto max-w-3xl">
            <div className="prose-vana">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-5 font-serif text-3xl text-ink dark:text-linen">Recommended Products</h2>
            <div className="grid gap-5">
              {products.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          </aside>
        </section>
      </article>

      <section className="container-premium py-16">
        <h2 className="mb-8 font-serif text-4xl text-ink md:text-5xl dark:text-linen">Related Articles</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => <ArticleCard key={item.slug} article={item} />)}
        </div>
      </section>
    </>
  );
}
