import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "likes.json");
    let likes: Record<string, number> = {};

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      try {
        likes = JSON.parse(fileData);
      } catch (e) {
        likes = {};
      }
    }

    // Increment like count
    likes[slug] = (likes[slug] || 0) + 1;

    fs.writeFileSync(filePath, JSON.stringify(likes, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving like:", error);
    return NextResponse.json({ error: "Failed to process like" }, { status: 500 });
  }
}
