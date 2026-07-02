import { saveArticleToGithub } from "@/lib/githubArticle";
import { NextRequest, NextResponse } from "next/server";
import { deleteContent, readAdminArticles, saveArticle } from "@/lib/adminContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    articles: readAdminArticles()
  });
}

export async function POST(request: NextRequest) {
  try {
    const slug = await saveArticleToGithub(await request.json());

    return NextResponse.json({
      ok: true,
      slug
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save article."
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing slug."
      },
      { status: 400 }
    );
  }

  deleteContent("articles", slug);

  return NextResponse.json({
    ok: true
  });
}