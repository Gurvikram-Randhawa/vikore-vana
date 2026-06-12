import { NextRequest, NextResponse } from "next/server";
import { deleteUpload, listUploads, saveUpload } from "@/lib/adminContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ media: listUploads() });
}

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "Missing file." }, { status: 400 });
  const url = await saveUpload(file);
  return NextResponse.json({ ok: true, url });
}

export async function DELETE(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");
  if (!file) return NextResponse.json({ ok: false, error: "Missing file." }, { status: 400 });
  deleteUpload(file);
  return NextResponse.json({ ok: true });
}
