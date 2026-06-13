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
  slugify,
  type AdminArticleInput,
  type AdminProductInput,
} from "./adminContent";

import { saveArticleToGithub, deleteContentFromGithub } from "./githubArticle";
import { saveProductToGithub } from "./githubProduct";
import { saveUploadToGithub, deleteUploadFromGithub } from "./githubMedia";

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
    let slug = input.slug || slugify(input.title);
    try {
      slug = saveArticleFile(input);
    } catch (e: any) {
      console.warn("Local save skipped:", e.message);
    }

    if (process.env.GITHUB_TOKEN) {
      try {
        slug = await saveArticleToGithub(input);
      } catch (ghError) {
        console.error("Failed to save to GitHub:", ghError);
        if (!slug) throw ghError;
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
    let slug = input.slug || slugify(input.name);
    try {
      slug = saveProductFile(input);
    } catch (e: any) {
      console.warn("Local product save skipped:", e.message);
    }

    if (process.env.GITHUB_TOKEN) {
      try {
        slug = await saveProductToGithub(input);
      } catch (ghError) {
        console.error("Failed to save to GitHub:", ghError);
        if (!slug) throw ghError;
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
  try {
    deleteContent(type, slug);
  } catch (e: any) {
    console.warn("Local delete skipped:", e.message);
  }

  if (process.env.GITHUB_TOKEN) {
    try {
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

  let url = "";
  try {
    url = await saveUploadFile(file);
  } catch (e: any) {
    console.warn("Local media save skipped:", e.message);
  }

  if (process.env.GITHUB_TOKEN) {
    try {
      url = await saveUploadToGithub(file);
    } catch (ghError) {
      console.error("Failed to upload to GitHub:", ghError);
      if (!url) return { ok: false, error: "Failed to upload to GitHub" };
    }
  }

  return { ok: true, url };
}

export async function removeMedia(filePath: string) {
  try {
    deleteUploadFile(filePath);
  } catch (e: any) {
    console.warn("Local media delete skipped:", e.message);
  }

  if (process.env.GITHUB_TOKEN) {
    try {
      await deleteUploadFromGithub(filePath);
    } catch (ghError) {
      console.error("Failed to delete media from GitHub:", ghError);
    }
  }

  return { ok: true };
}
