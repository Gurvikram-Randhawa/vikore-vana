import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, inquiryType, message } = body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "messages.json");
    let messages: any[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, "utf-8");
        messages = JSON.parse(fileData);
      } catch {
        messages = [];
      }
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "General Inquiry").trim(),
      inquiryType: inquiryType || "general",
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    messages.unshift(newMessage);
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Your message has been received, and we will get back to you shortly.",
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Failed to process message. Please try again later or email us directly at vikorevana@gmail.com." },
      { status: 500 }
    );
  }
}
