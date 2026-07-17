import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, messages });
  } catch (err) {
    console.error("Fetch contact messages error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load messages." },
      { status: 500 }
    );
  }
}