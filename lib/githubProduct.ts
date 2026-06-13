import matter from "gray-matter";
import { createOrUpdateFile } from "./github";
import { slugify, type AdminProductInput } from "./adminContent";

export async function saveProductToGithub(
    input: AdminProductInput
) {
    const slug = slugify(input.slug || input.name);

    const markdown = matter.stringify(input.body || "", {
        name: input.name,
        description: input.description,
        category: input.category,
        image: input.image,
        affiliate: input.affiliate,
        featured: input.featured
    });

    await createOrUpdateFile(
        `content/products/${slug}.md`,
        markdown,
        `Update product: ${slug}`
    );

    return slug;
}
