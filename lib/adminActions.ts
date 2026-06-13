"use server";

import {
  readAdminArticles,
  readAdminProducts,
  saveArticle as saveArticleFile,
  saveProduct as saveProductFile,
  deleteContent,
  listUploads,
  saveUpload as saveUploadFile,
  deleteUpload as deleteUploadFile,
  type AdminArticleInput,
  type AdminProductInput,
} from "./adminContent";

export async function fetchArticles() {
  return readAdminArticles();
}

export async function fetchProducts() {
  return readAdminProducts();
}

export async function fetchMedia() {
  return listUploads();
}

export async function createArticle(input: AdminArticleInput) {
  try {
    if (process.env.VERCEL) {
      const { saveArticleToGithub } = await import("./githubArticle");
      const slug = await saveArticleToGithub(input);

      return { ok: true, slug };
    }

    const slug = saveArticleFile(input);

    if (process.env.GITHUB_TOKEN) {
      try {
        const { saveArticleToGithub } = await import("./githubArticle");
        await saveArticleToGithub(input);
      } catch (ghError) {
        console.error("Failed to save to GitHub:", ghError);
      }
    }

    return { ok: true, slug };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to save article."
    };
  }
}

export async function createProduct(input: AdminProductInput) {
  try {
    if (process.env.VERCEL) {
      const { saveProductToGithub } = await import("./githubProduct");
      const slug = await saveProductToGithub(input);
      return { ok: true, slug };
    }

    const slug = saveProductFile(input);

    if (process.env.GITHUB_TOKEN) {
      try {
        const { saveProductToGithub } = await import("./githubProduct");
        await saveProductToGithub(input);
      } catch (ghError) {
        console.error("Failed to save to GitHub:", ghError);
      }
    }

    return { ok: true, slug };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to save product.",
    };
  }
}

export async function removeContent(
  type: "articles" | "products",
  slug: string
) {
  if (process.env.VERCEL) {
    const { deleteContentFromGithub } = await import("./githubArticle");
    await deleteContentFromGithub(type, slug);
    return { ok: true };
  }

  deleteContent(type, slug);

  if (process.env.GITHUB_TOKEN) {
    try {
      const { deleteContentFromGithub } = await import("./githubArticle");
      await deleteContentFromGithub(type, slug);
    } catch (ghError) {
      console.error("Failed to delete from GitHub:", ghError);
    }
  }

  return { ok: true };
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File))
    return { ok: false, error: "Missing file.", url: "" };

  if (process.env.VERCEL) {
    const { saveUploadToGithub } = await import("./githubMedia");
    const url = await saveUploadToGithub(file);
    return { ok: true, url };
  }

  const url = await saveUploadFile(file);

  if (process.env.GITHUB_TOKEN) {
    try {
      const { saveUploadToGithub } = await import("./githubMedia");
      await saveUploadToGithub(file);
    } catch (ghError) {
      console.error("Failed to upload to GitHub:", ghError);
    }
  }

  return { ok: true, url };
}

export async function removeMedia(filePath: string) {
  if (process.env.VERCEL) {
    const { deleteUploadFromGithub } = await import("./githubMedia");
    await deleteUploadFromGithub(filePath);
    return { ok: true };
  }

  deleteUploadFile(filePath);

  if (process.env.GITHUB_TOKEN) {
    try {
      const { deleteUploadFromGithub } = await import("./githubMedia");
      await deleteUploadFromGithub(filePath);
    } catch (ghError) {
      console.error("Failed to delete media from GitHub:", ghError);
    }
  }

  return { ok: true };
}
