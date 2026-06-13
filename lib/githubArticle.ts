import matter from "gray-matter";
import { createOrUpdateFile } from "./github";
import { slugify, type AdminArticleInput } from "./adminContent";

export async function saveArticleToGithub(
    input: AdminArticleInput
) {
    const slug = slugify(input.slug || input.title);

    const markdown = matter.stringify(input.body || "", {
        title: input.title,
        description: input.description,
        category: input.category,
        date: input.date,
        cover: input.cover,
        featured: input.featured,
        draft: input.draft,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        seoKeywords: input.seoKeywords,
        products: input.products
    });

    await createOrUpdateFile(
        `content/articles/${slug}.md`,
        markdown,
        `Update article: ${slug}`
    );

    return slug;
}

export async function deleteContentFromGithub(
    type: "articles" | "products",
    slug: string
) {
    const { deleteFile } = await import("./github");
    const safeSlug = slugify(slug);
    await deleteFile(`content/${type}/${safeSlug}.md`, `Delete ${type}: ${slug}`);
}