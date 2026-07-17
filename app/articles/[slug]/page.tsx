import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleCard } from "@/components/ArticleCard";
import { ProductCard } from "@/components/ProductCard";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { ArticleLikeButton } from "@/components/ArticleLikeButton";
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
  const products = getArticleProducts(article, 10);
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
        <section className="container-premium py-6 md:py-12">
          <nav className="mb-6 text-sm text-smoke dark:text-bone">
            <Link href="/" className="hover:text-ink dark:hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-ink dark:hover:text-white">Categories</Link>
            <span className="mx-2">/</span>
            <span>{article.category}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="flex justify-center overflow-hidden rounded-[24px] bg-bone">
              <Image
                src={article.cover}
                alt={article.title}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto', maxHeight: '75vh', objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="mt-2 md:mt-4 lg:mt-0 lg:pl-4">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">{article.category}</p>
              <h1 className="font-serif text-3xl leading-[1.02] text-ink md:text-4xl lg:text-6xl xl:text-7xl dark:text-linen">{article.title}</h1>
              <p className="mt-4 md:mt-6 text-base md:text-lg leading-relaxed md:leading-9 text-smoke dark:text-bone">{article.description}</p>
              <div className="mt-7">
                <ShareButtons title={article.title} url={url} image={article.cover} />
              </div>
            </div>
          </div>
        </section>

        <section className="container-premium grid gap-12 sm:gap-4 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="w-full max-w-5xl pr-0 lg:pr-4">
            <div className="prose-vana prose-lg xl:prose-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
            </div>
            <ArticleLikeButton slug={article.slug} />
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-2 md:mb-3 font-serif text-2xl md:text-3xl text-ink dark:text-linen text-center">Recommended Products</h2>
            <p className="mb-1 text-[10px] sm:text-[11px] text-[#9c8b7a] dark:text-bone/50 leading-relaxed text-center">This article may contain affiliate links. We earn a small commission at no extra cost to you.</p>
            <p className="mb-6 md:mb-8 text-center"><a href="/disclosure" className="text-[10px] sm:text-[11px] text-[#9c8b7a] dark:text-bone/50 underline underline-offset-2 hover:text-[#b89569] transition-colors">Learn more</a></p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-2 lg:gap-5">
              {products.slice(0, 10).map((product, index) => (
                <div key={product.slug} className={index >= 4 ? "hidden lg:block" : ""}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </aside>
        </section>
      </article>

      <section className="container-premium py-10 md:py-16">
        <h2 className="mb-6 md:mb-8 font-serif text-3xl md:text-4xl lg:text-5xl text-ink dark:text-linen">Related Articles</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => <ArticleCard key={item.slug} article={item} />)}
        </div>
      </section>
    </>
  );
}
