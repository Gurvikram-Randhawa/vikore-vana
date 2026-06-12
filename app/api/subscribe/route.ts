import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "subscribers.json");
    let subscribers: any[] = [];
    
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      subscribers = JSON.parse(fileData);
    }
    
    // Check if email already exists
    const exists = subscribers.some(sub => sub.email === email);
    if (!exists) {
      subscribers.push({ email, date: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
