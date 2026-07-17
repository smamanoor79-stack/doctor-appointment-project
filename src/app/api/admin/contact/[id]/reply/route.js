import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { sendContactReplyEmail } from "@/lib/email"; 
// import { requireAdmin } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    // await requireAdmin(req);

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