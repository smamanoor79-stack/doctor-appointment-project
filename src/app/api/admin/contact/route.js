import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
// import { requireAdmin } from "@/lib/auth"; 

export async function GET(req) {
  try {
    // await requireAdmin(req); // uncomment + wire up to your existing admin auth check

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