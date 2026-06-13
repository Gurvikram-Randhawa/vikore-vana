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
    const slug = saveArticleFile(input);
    return { ok: true, slug };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to save article.",
    };
  }
}

export async function createProduct(input: AdminProductInput) {
  try {
    const slug = saveProductFile(input);
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
  deleteContent(type, slug);
  return { ok: true };
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File))
    return { ok: false, error: "Missing file.", url: "" };
  const url = await saveUploadFile(file);
  return { ok: true, url };
}

export async function removeMedia(filePath: string) {
  deleteUploadFile(filePath);
  return { ok: true };
}
