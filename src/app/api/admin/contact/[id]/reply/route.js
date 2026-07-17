import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { sendContactReplyEmail } from "@/lib/email";
import { cookies } from "next/headers";

export async function PATCH(req, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { replyText } = await req.json();

    if (!replyText || !replyText.trim()) {
      return NextResponse.json(
        { success: false, message: "Reply text is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const msg = await ContactMessage.findById(id);
    if (!msg) {
      return NextResponse.json(
        { success: false, message: "Message not found." },
        { status: 404 }
      );
    }

    await sendContactReplyEmail({
      name: msg.name,
      email: msg.email,
      originalMessage: msg.message,
      replyText,
    });

    msg.reply = { text: replyText, sentAt: new Date() };
    msg.status = "replied";
    await msg.save();

    return NextResponse.json({ success: true, contact: msg });
  } catch (err) {
    console.error("Reply send error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send reply." },
      { status: 500 }
    );
  }
}